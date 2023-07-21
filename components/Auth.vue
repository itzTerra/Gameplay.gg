<template>
    <div class="flex items-center justify-center flex-grow">
        <div class="w-96">
            <nav class="flex justify-center mb-2">
                <NuxtLink to="/" class="hover:opacity-80">&#171; Home</NuxtLink>
            </nav>
            <div class="bg-base-200 py-4 px-5 rounded-xl mb-3">
                <slot></slot>
            </div>
        </div>
        <Alert :alertType="error ? 'error' : 'success'" :change="change" :interval="5000">{{ error || success}}</Alert>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['success', "error", "change"])
</script>
