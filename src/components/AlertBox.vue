<template>
    <div class="w-full h-full fixed top-0 left-0 flex justify-center content-center flex-wrap bg-black/50">
        <div class="md:w-1/3 w-2/3 h-auto p-6 flex justify-evenly flex-col rounded-lg border-4 gap-6 text-white bg-black/70"
            :class="{ 'border-lime-400': isSuccess, 'border-red-600': !isSuccess }">
            <h1 class="text-xl font-bold" :class="{ 'text-lime-400': isSuccess, 'text-red-600': !isSuccess }">{{ isSuccess
                ? 'Well done. You have finished it.' : 'You hit a wall. Try Again!' }}</h1>
            <p v-if="this.result == 'success'" class="font-bold text-lime-400">{{ formattedTime }}</p>
            <div class="w-full flex justify-end flex-wrap">
                <button class="py-2 px-4 rounded-lg border-2 bg-black" :class="{
                    'hover:bg-lime-400 hover:text-black text-lime-400 border-lime-400': isSuccess,
                    'hover:bg-red-600 hover:text-black text-red-600 border-red-600': !isSuccess
                }" @click="doAction(isSuccess)">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['result', 'time'],
    emits: ['try-again', 'close-box'],
    computed: {
        isSuccess() {
            return this.result == 'success';
        },
        formattedTime() {
            const [hours, minutes, seconds] = this.time.split(':').map(Number);
            let formattedString = 'Your time was:';
            if (hours > 0) {
                formattedString += ` ${hours} hr`;
            }
            if (minutes > 0) {
                formattedString += ` ${minutes} min`;
            }
            if (seconds > 0 || (hours === 0 && minutes === 0 && seconds === 0)) {
                formattedString += ` ${seconds} sec`;
            }
            formattedString += '.';
            return formattedString.trim();
        },
    },
    methods: {
        doAction(isSuccess) {
            if (isSuccess) this.$emit('close-box');
            else this.$emit('try-again');
        }
    }
}
</script>