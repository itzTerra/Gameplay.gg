<template>
    <div class="flex items-center justify-center flex-grow">
        <div class="w-96">
            <nav class="flex justify-center mb-2">
                <a href="/">&#171; Home</a>
            </nav>
            <slot></slot>
            <div class="alert alert-danger" role="alert" v-if="message">{{ message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps(['message'])
</script>

<style lang="scss" scoped></style>