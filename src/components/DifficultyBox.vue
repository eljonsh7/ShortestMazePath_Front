<template>
    <div class="w-full h-full fixed top-0 left-0 flex justify-center content-center flex-wrap bg-black/50"
        @click="this.$emit('close-box')">
        <div class="md:w-1/3 w-2/3 h-auto p-6 flex justify-evenly flex-col rounded-lg border-4 gap-6 text-white bg-black/70"
            @click.stop>
            <h1 class="text-xl">Choose difficulty level:</h1>
            <div class="w-full flex justify-evenly gap-2 md:flex-row flex-col flex-wrap">
                <button
                    class="py-2 px-6 rounded-full border-2 bg-black text-lime-400 border-lime-400 hover:text-black hover:bg-lime-400"
                    @click="doAction('easy')">Easy</button>
                <button
                    class="py-2 px-6 rounded-full border-2 bg-black text-blue-400 border-blue-400 hover:text-black hover:bg-blue-400"
                    @click="doAction('medium')">Medium</button>
                <button
                    class="py-2 px-6 rounded-full border-2 bg-black text-red-600 border-red-600 hover:text-black hover:bg-red-600"
                    @click="doAction('hard')">Hard</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['result'],
    emits: ['choose-difficulty', 'close-box'],
    computed: {
        isSuccess() {
            return this.result == 'success';
        },
    },
    methods: {
        doAction(difficulty) {
            this.$emit('choose-difficulty', difficulty);
        }
    }
}
</script>