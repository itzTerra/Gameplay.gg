<template>
    <div class="flex">
        <ConfirmPassReset v-if="$route.query.mode == 'resetPassword'" />
    </div>
</template>

<script setup>
useHead({title: "Confirm"})
const route = useRoute()

onMounted(() => {
    if (!route.query.mode){
        navigateTo("/")
    }
})

</script>

