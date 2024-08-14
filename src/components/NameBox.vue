<template>
  <div class="w-full h-full fixed top-0 left-0 flex justify-center content-center flex-wrap bg-black/50">
    <div class="md:w-1/3 w-2/3 h-auto p-6 flex justify-evenly flex-col rounded-lg border-4 gap-6 text-white bg-black/70 border-lime-500">
      <h1 class="text-xl text-lime-500">Enter your name below:</h1>
      <div class="w-full flex justify-evenly gap-2 md:flex-row flex-col flex-wrap">
        <input type="text" v-model="fullName" placeholder="Enter your full name" class="bg-white/10 p-2 rounded-lg w-full outline-none ring-0 border-lime-500 border" />
      </div>
      <div class="flex justify-end">
        <CustomButton text="Enter" @do-action="this.$emit('close-box', this.fullName)" :disabled="this.fullName === ''" />
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/CustomButton.vue";

export default {
  components: {CustomButton},
  emits: ['close-box'],
  name: 'NameBox',
  data() {
    return {
      fullName: '',
    }
  }
}
</script>