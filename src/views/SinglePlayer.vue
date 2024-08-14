<template>
  <div class="flex flex-col gap-2">
    <h1 class="text-5xl font-extrabold mb-5 text-lime-400">Mirror Maze Game</h1>
    <p class="text-xl font-bold text-lime-400" id="timer">{{ this.time }}</p>
    <div class="flex justify-center md:flex-row flex-col gap-5">
      <div class="flex h-auto md:justify-center justify-evenly content-center flex-wrap md:w-1/2 w-full flex-col gap-1">
        <CustomButton text="New Maze" @do-action="this.multiplayer = false; this.chooseDifficulty = true"
                      :disabled="this.running"/>
        <CustomButton text="Show solution" @do-action="this.solutionBox = true" :disabled="this.running"/>
      </div>
      <div class="flex justify-center" style="width: 32.5rem; height: 32.5rem;" v-if="isLoading">
        <BaseSpinner/>
      </div>
      <div class="flex h-auto justify-center" v-else>
        <div class="h-full md:flex flex-col justify-end hidden">
          <img id="light1" src="../assets/light.png" class="border-y-2 cursor-pointer border-lime-400"
               :class="{ 'bg-white': this.running || this.hasSucceded }"
               :style="{ height: `${this.maze.length > 0 ? 100 / this.maze.length : 0}%` }" alt=""/>
        </div>
        <div class="flex flex-wrap flex-col" style="height: 30rem; width: 30rem;">
          <div v-for="(row, rowIndex) in maze" :key="`row${rowIndex}`" class="flex"
               :style="{ height: `${this.maze.length > 0 ? 100 / this.maze.length : 0}%` }">
            <div v-for="(cell, colIndex) in row" :key="`col${colIndex}`"
                 :style="{ width: `${this.maze.length > 0 ? 100 / this.maze.length : 0}%` }"
                 class="hover:border-2 hover:border-red-500 cursor-pointer border-lime-400" :disabled="this.running"
                 @click="setMirror(rowIndex, colIndex)" :class="{
                'bg-black': !cell.status,
                'bg-white': cell.status,
                'border-t-2': cell[0] === 'Wall',
                'border-r-2': cell[1] === 'Wall',
                'border-b-2': cell[2] === 'Wall',
                'border-l-2': cell[3] === 'Wall',
              }">
              <img :src="cell.mirror == 1 ? mirror1 : mirror2" class="w-full h-full" v-if="cell.mirror"
                   :class="{ 'rotate-180': cell.rotate }" alt="">
            </div>
          </div>
        </div>
        <div class="h-full md:flex flex-col justify-start hidden">
          <img id="light2" src="../assets/light.png" class="border-y-2 border-x-white cursor-pointer border-lime-400"
               :class="{ 'bg-white': hasSucceded }"
               :style="{ height: `${this.maze.length > 0 ? 100 / this.maze.length : 0}%` }" alt=""/>
        </div>
      </div>
      <div class="md:flex hidden h-auto justify-center content-center flex-wrap w-1/2">
        <CustomButton text="Multi player" @do-action="this.multiplayer = true; this.chooseDifficulty = true"
                      :disabled="this.running"/>
      </div>
    </div>
    <div class="w-full flex justify-center">
      <div class="w-auto flex flex-col gap-2">
        <div class="text-xl font-bold text-lime-400 flex items-center justify-center">Pick a mirror:</div>
        <div class="w-auto flex gap-2">
          <img src="../assets/p1.png" alt=""
               class="w-16 h-16 border-2 border-black cursor-pointer rounded-2xl hover:border-red-500"
               :disabled="this.running" @click="selectMirror(1)"
               :class="{ 'border-red-500': this.selectedMirror == 1 }">
          <img src="../assets/p2.png" alt=""
               class="w-16 h-16 border-2 border-black cursor-pointer rounded-2xl hover:border-red-500"
               :disabled="this.running" @click="selectMirror(2)"
               :class="{ 'border-red-500': this.selectedMirror == 2 }">
          <CustomButton text="Remove mirror" @do-action="selectRemove" :disabled="this.running" :class="{
            'text-red-600': !this.removeSelected,
            'bg-red-600 text-white': this.removeSelected
          }"/>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center">
      <div class="w-auto gap-2 flex">
        <CustomButton text="Start" @do-action="start" :disabled="this.running"/>
        <CustomButton text="Reset" @do-action="reset(true)" :disabled="this.running"/>
      </div>
    </div>
  </div>
  <AlertBox v-if="this.result" :result="result" :time="time" @close-box="closeSuccess" @try-again="reset"/>
  <DifficultyBox v-if="this.chooseDifficulty" @close-box="this.chooseDifficulty = false"
                 @choose-difficulty="getMaze"/>
  <SolutionBox v-if="this.solutionBox" @close-box="this.solutionBox = null" @show-solution="showSolution"/>
</template>

<script>
import CustomButton from '../components/CustomButton.vue';
import AlertBox from '../components/AlertBox.vue';
import DifficultyBox from '../components/DifficultyBox.vue';
import SolutionBox from '../components/SolutionBox.vue';
import BaseSpinner from '../components/BaseSpinner.vue';

import Api from '../services/api.js';
import Maze from "@/utils/maze.js";

let {Timer} = require("easytimer.js");

export default {
  name: 'SinglePla yer',
  components: {
    CustomButton,
    AlertBox,
    BaseSpinner,
    DifficultyBox,
    SolutionBox,
  },
  beforeMount() {
    this.getMaze('easy');
    this.timer.addEventListener('secondsUpdated', () => {
      this.time = this.timer.getTimeValues().toString();
    });
  },
  data() {
    return {
      timer: new Timer(),
      maze: [],
      time: '',
      selectedMirror: 0,
      removeSelected: false,
      mirror1: require('../assets/1.png'),
      mirror2: require('../assets/2.png'),
      directionFrom: 'left',
      running: false,
      result: null,
      solutionBox: false,
      isLoading: false,
      chooseDifficulty: false,
      hasSucceded: false,
      multiplayer: false,
    };
  },
  methods: {
    async getMaze(difficulty) {
      this.returnToStart();
      this.isLoading = true;
      this.hasSucceded = false;
      this.chooseDifficulty = false;
      try {
        if (this.multiplayer) {
          let a = await Api.storeMaze(difficulty);
          console.log(a);
          this.$router.push('/multiplayer/' + a.data.id);
        } else {
          let a = await Api.getGeneratedMaze(difficulty);
          this.maze = a.data;
          this.resetMaze = a.data;
        }
      } catch (error) {
        console.log(error)
      }
      this.isLoading = false;
    },
    async showSolution(solutionMethod) {
      for (let i = 0; i < this.maze.length; i++) {
        for (let j = 0; j < this.maze[0].length; j++) {
          this.maze[i][j].status = false;
          this.maze[i][j].mirror = null;
        }
      }
      this.returnToStart();
      this.solutionBox = false;
      try {
        let a = await Api.getSolution(solutionMethod, this.maze);
        await this.goThroughPath(a.data, 0, this.maze.length - 1, true);
      } catch (error) {
        console.log(error)
      }
    },
    setMirror(rowIndex, colIndex) {
      if (!this.timer.isRunning()) this.timer.start();
      if (this.removeSelected)
        this.maze[rowIndex][colIndex].mirror = 0;
      else if (this.selectedMirror != 0)
        this.maze[rowIndex][colIndex].mirror = this.selectedMirror;
    },
    selectMirror(num) {
      if (!this.timer.isRunning()) this.timer.start();
      if (this.selectedMirror == num) this.selectedMirror = 0;
      else this.selectedMirror = num;
      this.removeSelected = false;
    },
    selectRemove() {
      this.removeSelected = !this.removeSelected;
      this.selectedMirror = 0;
    },
    closeSuccess() {
      this.result = null;
      this.running = false;
    },
    reset(shouldRemoveMirrors = false) {
      this.returnToStart();
      this.running = true;
      if (shouldRemoveMirrors) {
        for (let i = 0; i < this.maze.length; i++) {
          for (let j = 0; j < this.maze[0].length; j++) {
            this.maze[i][j].status = false;
            this.maze[i][j].mirror = null;
          }
        }
      } else {
        for (let i = 0; i < this.maze.length; i++) {
          for (let j = 0; j < this.maze[0].length; j++) {
            this.maze[i][j].status = false;
          }
        }
      }
      this.running = false;
      this.removeSelected = false;
      this.selectedMirror = 0;
      this.result = null;
    },
    async start() {
      let path = [], rowIndex, colIndex;
      for (let i = 0; i < this.maze.length; i++) {
        for (let j = 0; j < this.maze[0].length; j++) {
          this.maze[i][j].status = false;
        }
      }
      this.timer.pause();

      [this.maze, path, rowIndex, colIndex] = Maze.startMazePath(this.maze);
      await this.goThroughPath(path, rowIndex, colIndex);
    },
    async goThroughPath(array, rowIndex, colIndex, fromBack = false) {
      this.running = true;
      if (fromBack) {
        for (let i = 0; i < array.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 200));
          this.maze[array[i]['y']][array[i]['x']].status = true;
          if (array[i]['m']) this.maze[array[i]['y']][array[i]['x']].mirror = array[i]['m'];
          if (array[i]['rotate']) this.maze[array[i]['y']][array[i]['x']].rotate = true;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
        this.hasSucceded = true;
        this.running = false;
      } else {
        for (let i = 0; i < array.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 200));
          this.maze[array[i]['x']][array[i]['y']].status = true;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
        if (colIndex === this.maze.length && rowIndex === 0) {
          this.result = 'success';
          this.hasSucceded = true;
        } else {
          this.result = 'failure';
        }
      }
    },
    returnToStart() {
      this.hasSucceded = false;
      this.timer.reset();
      this.timer.stop();
      this.time = '00:00:00';
      this.selectedMirror = 0;
      this.removeSelected = false;
    },
  },
}
</script>