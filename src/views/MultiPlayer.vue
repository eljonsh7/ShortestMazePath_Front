<template>
  <NameBox v-if="this.nameEntering" @close-box="getMaze"/>
  <div v-else class="flex gap-1 w-full">
    <div class="flex flex-col gap-1 w-2/3 justify-center items-center">
      <div class="flex gap-1 w-full justify-center">
        <CustomButton text="Single player" @click="this.$router.push('/')"
                      :class="{ 'bg-lime-400 text-black': this.amReady }"/>
        <CustomButton text="Ready?" @click="getReady" :disabled="this.amReady"
                      :class="{ 'bg-lime-400 text-black': this.amReady }"/>
      </div>
      <p class="text-xl font-bold text-lime-400" id="timer">{{ this.time }}</p>
      <div class="flex flex-wrap flex-col" style="height: 30rem; width: 30rem;">
        <div v-for="(row, rowIndex) in maze" :key="`row${rowIndex}`" class="flex"
             :style="{ height: `${this.maze.length > 0 ? 100 / this.maze.length : 0}%` }">
          <div v-for="(cell, colIndex) in row" :key="`col${colIndex}`"
               :style="{ width: `${this.maze.length > 0 ? 100 / this.maze.length : 0}%` }"
               class="hover:border-2 hover:border-red-500 cursor-pointer border-lime-400"
               @click="setMirror(rowIndex, colIndex)" :class="{
                'bg-black': !cell.status,
                'bg-white': cell.status,
                'border-t-2': cell[0] === 'Wall',
                'border-r-2': cell[1] === 'Wall',
                'border-b-2': cell[2] === 'Wall',
                'border-l-2': cell[3] === 'Wall',
              }">
            <img :src="cell.mirror === 1 ? mirror1 : mirror2" class="w-full h-full" v-if="cell.mirror"
                 :class="{ 'rotate-180': cell.rotate }" alt="">
          </div>
        </div>
      </div>
      <div class="w-full flex justify-center">
        <div class="w-auto flex flex-col gap-2">
          <div class="text-xl font-bold text-lime-400 flex items-center justify-center">Pick a mirror:</div>
          <div class="w-auto flex gap-2">
            <img src="../assets/p1.png" alt=""
                 class="w-16 h-16 border-2 border-black cursor-pointer rounded-2xl hover:border-red-500"
                 :disabled="this.running || this.amReady || this.hasSucceded" @click="selectMirror(1)"
                 :class="{ 'border-red-500': this.selectedMirror === 1 }">
            <img src="../assets/p2.png" alt=""
                 class="w-16 h-16 border-2 border-black cursor-pointer rounded-2xl hover:border-red-500"
                 :disabled="this.running || this.amReady || this.hasSucceded" @click="selectMirror(2)"
                 :class="{ 'border-red-500': this.selectedMirror === 2 }">
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
          <CustomButton text="Reset" @do-action="reset(true)"/>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 w-1/3 text-white">
      <div class="font-bold text-lg underline">On Game / Ready Users ({{ this.onGameUsers }} / {{
          this.readyUsers
        }})
      </div>
      <div class="font-bold text-lg underline">Ranked users</div>
      <table class="border border-white">
        <thead>
        <tr>
          <th class="border border-white py-1 bg-white/20">Rank</th>
          <th class="border border-white py-1 bg-white/20">Name</th>
          <th class="border border-white py-1 bg-white/20">Time</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, key) in users" :key="key">
          <th class="border border-white py-1"
              :class="{ 'text-yellow-400': key === 0, 'text-stone-300': key === 1, 'text-amber-600': key === 2, }">
            {{ key + 1 }}
          </th>
          <th class="border border-white py-1">{{ user.name }}</th>
          <th class="border border-white py-1">{{ formatTime(user.time) }}</th>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <CountDown v-if="showCountDown"
             @close-modal="this.gameStarted = true; this.showCountDown = false; this.timer.start()"/>
</template>

<script>
import NameBox from "@/components/NameBox.vue";
import CustomButton from "@/components/CustomButton.vue";
import CountDown from "@/components/CountDown.vue";

import Api from "@/services/api.js";
import Time from "@/utils/time.js";
import Maze from "@/utils/maze.js";

import {Timer} from "easytimer.js";
import Pusher from "pusher-js";

export default {
  name: "MultiPlayer",
  components: {CountDown, CustomButton, NameBox},
  data() {
    return {
      nameEntering: true,
      maze: [],
      selectedMirror: 0,
      removeSelected: false,
      running: false,
      timer: new Timer(),
      time: '00:00:00',
      amReady: false,
      fullName: '',
      pusher: null,
      channel: null,
      mirror1: require('../assets/1.png'),
      mirror2: require('../assets/2.png'),
      users: [],
      onGameUsers: 0,
      readyUsers: 0,
      showCountDown: false,
      gameStarted: false,
      hasSucceded: false,
    }
  },
  beforeMount() {
    this.timer.addEventListener('secondsUpdated', () => {
      this.time = this.timer.getTimeValues().toString();
    });
  },
  methods: {
    formatTime(time) {
      return Time.formatTime(time);
    },
    async getMaze(name) {
      this.fullName = name;
      let response = await Api.getMultiplayerMaze(this.$route.params.mazeId, {name});
      if (response) {
        this.maze = response.data.maze;
        this.onGameUsers = Object.values(response.data.users).length;
        this.readyUsers = Object.values(response.data.users).filter(value => value === true).length;
        this.nameEntering = false;
        this.createPusher(this.$route.params.mazeId);
      }
    },
    setMirror(rowIndex, colIndex) {
      if (!this.gameStarted) {
        return;
      }

      if (this.removeSelected)
        this.maze[rowIndex][colIndex].mirror = 0;
      else if (this.selectedMirror !== 0)
        this.maze[rowIndex][colIndex].mirror = this.selectedMirror;
    },
    selectMirror(num) {
      if (!this.gameStarted) {
        return;
      }

      if (this.selectedMirror === num) {
        this.selectedMirror = 0;
      } else {
        this.selectedMirror = num;
      }

      this.removeSelected = false;
    },
    selectRemove() {
      if (!this.gameStarted) {
        return;
      }
      this.removeSelected = !this.removeSelected;
      this.selectedMirror = 0;
    },
    async getReady() {
      if (await Api.beReady(this.$route.params.mazeId, {name: this.fullName})) {
        this.amReady = true;
      }
    },
    createPusher(routeId) {
      this.pusher = null;
      this.pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
        appId: process.env.VUE_APP_PUSHER_APP_ID,
        key: process.env.VUE_APP_PUSHER_KEY,
        secret: process.env.VUE_APP_PUSHER_SECRET,
        cluster: process.env.VUE_APP_PUSHER_CLUSTER,
        useTLS: true,
        channelAuthorization: {
          endpoint: `${process.env.VUE_APP_SERVER_URL}/broadcasting/auth`,
        },
      });
      this.channel = null;
      this.channel = this.pusher.subscribe(`multi-player.${routeId}`);
      this.bindChannel();
    },
    async bindChannel() {
      await this.unbindChannels();
      this.channel.bind("UserFinished", async (e) => {
        console.log(e);
        this.users.push({
          name: e.user,
          time: e.time
        });
      });
      this.channel.bind("AllUsersReady", async (e) => {
        this.onGameUsers = Object.values(e.users).length;
        this.readyUsers = Object.values(e.users).filter(value => value === true).length;
        if (this.readyUsers === this.onGameUsers) {
          this.showCountDown = true;
        }
      });
      this.channel.bind("UserAdded", async (e) => {
        this.onGameUsers = Object.values(e).length;
        this.readyUsers = Object.values(e).filter(value => value === true).length;
      });
    },
    async unbindChannels() {
      if (this.channel) {
        this.channel.unbind("NewMessage");
        this.channel.unbind("AllUsersReady");
        this.channel.unbind("UserAdded");
      }
    },
    async start() {
      if (!this.gameStarted) {
        return;
      }

      let path = [], rowIndex, colIndex;
      for (let i = 0; i < this.maze.length; i++) {
        for (let j = 0; j < this.maze[0].length; j++) {
          this.maze[i][j].status = false;
        }
      }

      [this.maze, path, rowIndex, colIndex] = Maze.startMazePath(this.maze);
      await this.goThroughPath(path, rowIndex, colIndex);
    },
    async goThroughPath(array, rowIndex, colIndex, fromBack = false) {
      this.running = true;
      if (fromBack) {
        for (let i = 0; i < array.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 200));
          this.maze[array[i]['y']][array[i]['x']].status = true;
          this.maze[array[i]['y']][array[i]['x']].mirror = array[i]['m'] ?? null;
          this.maze[array[i]['y']][array[i]['x']].rotate = array[i]['rotate'] ?? false;
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
          await Api.finishMaze(this.$route.params.mazeId, {
            name: this.fullName,
            time: this.time,
          });
          this.timer.stop();
        } else {
          this.result = 'failure';
        }
      }
    },
    reset(shouldRemoveMirrors = false) {
      if (!this.gameStarted) {
        return;
      }

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

      this.hasSucceded = false;
      this.selectedMirror = 0;
      this.removeSelected = false;
      this.running = false;
      this.result = null;
    },
  }
}
</script>
