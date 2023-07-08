<template>
    <div class="flex items-center justify-center flex-grow">
        <div class="w-96">
            <nav class="flex justify-center mb-2">
                <NuxtLink to="/" class="hover:opacity-80">&#171; Home</NuxtLink>
            </nav>
            <div class="bg-base-200 py-4 px-5 rounded-xl mb-3">
                <slot></slot>
                <div class="divider">OR</div>
                <div class="flex flex-col">
                    <button class="btn" @click="continueGoogle" :disabled="session?.user != null">Continue with Google</button>
                </div>
            </div>
            <Alert :alertType="error || googleError ? 'error' : 'success'" :change="isChanged" :interval="5000">{{ error || googleError || success}}</Alert>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['success', "error", "change"])

const { loginUserGoogle } = useAuth();
// const session = useSessionData()
const { session } = await useSession()


const googleError = ref("")

// This is a logical headache
let oldChange = props.change
let oldChangeVal = false
let changeVal = false
const isChanged = computed(() => {
    if (props.change !== oldChange){
        return props.change
    } else{
        if (changeVal !== oldChangeVal){
            return !props.change
        }
    }
    oldChange = props.change
})

const continueGoogle = async () => {
    const response = await loginUserGoogle()
    // console.log(JSON.stringify(response))

    if (response.credentials) {
        navigateTo(session.value ? session.value.lastUrl : "/")
    } else{
        googleError.value = `Login failed: ${response.errorMessage}`
        changeVal = !changeVal
    }
}
</script>
