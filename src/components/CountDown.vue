<template>
  <div v-if="showModal" class="fixed top-0 left-0 w-screen h-screen bg-black/30 flex items-center justify-center z-50">
    <div class="bg-lime-500 p-20 rounded-xl text-center font-extrabold text-6xl">
      <h1 v-if="count > 0">{{ count }}</h1>
      <h1 v-else>Go</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "CountDown",
  emits: ['close-modal'],
  data() {
    return {
      count: 3,
      showModal: true,
    };
  },
  mounted() {
    this.startCountdown();
  },
  methods: {
    startCountdown() {
      const interval = setInterval(() => {
        if (this.count > 0) {
          this.count--;
        } else {
          clearInterval(interval);
          this.$emit('close-modal');
          this.showModal = false;
        }
      }, 1000);
    },
  },
};
</script>
