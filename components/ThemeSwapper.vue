<template>
    <input type="checkbox" v-model="colorMode.preference" true-value="dark" false-value="light"/>
</template>

<script setup>
    const colorMode = useColorMode();
</script>
