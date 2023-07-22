<template>
    <div class="flex">
        <ConfirmPassReset v-if="$route.query.mode == 'resetPassword'" />
    </div>
</template>

<script setup>
const route = useRoute()

onMounted(() => {
    if (!route.query.mode){
        navigateTo("/")
    }
})

</script>

