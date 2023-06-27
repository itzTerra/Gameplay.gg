<template>
    <div>

    </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/profile',
  },
})

const { status, data, signIn, signOut } = useAuth()
console.log(status.value, data)
</script>

<style lang="scss" scoped>

</style>