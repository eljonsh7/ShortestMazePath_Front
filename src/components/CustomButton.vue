<template>
    <button class="px-5 py-2 text-lg border-black rounded-full bg-black/50 border-2"
        :class="{ 'text-lime-400 border-lime-400 hover:text-black hover:bg-lime-400': text != 'Remove mirror', 'text-red-600 border-red-600 hover:text-black hover:bg-red-600': text == 'Remove mirror' }"
        @click="this.$emit('do-action')">{{
            text }}</button>
</template>

<script>
export default {
    props: ['text'],
    emits: ['do-action'],
}
</script>