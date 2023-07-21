<template>
    <div class="flex flex-col items-center ">
        <div
            class="mx-auto my-auto bg-base-200 rounded-box px-8 py-4 w-full sm:w-[400px] xl:w-[600px] min-h-[300px] flex flex-col items-start">
            <h1 class="self-center text-3xl font-bold">Profile</h1>
            <div class="divider my-1"></div>
            <div class="flex flex-wrap gap-10 items-center justify-around w-full">
                <div>
                    <p class="font-light text-lg mb-2">Username</p>
                    <div v-if="usernameEditing" class="flex items-center gap-1">
                        <input ref="usernameInput" type="text" v-model="newUsername" class="input w-56 me-4">
                        <button v-if="!usernameLoading" @click="setUsername" class="btn btn-sm btn-ghost btn-circle" title="Save">
                            <SVGSave class="w-6 h-6" />
                        </button>
                        <span v-else class="loading loading-spinner"></span>
                        <button @click="usernameEditing = false" class="btn btn-sm btn-ghost btn-circle" title="Cancel">
                            <SVGClose class="w-6 h-6" />
                        </button>
                    </div>
                    <div v-else class="flex items-center gap-4">
                        <p class="font-semibold text-xl p-3 bg-base-100 rounded-lg w-56">{{ user ? user.username : '' }}</p>
                        <button @click="editUsername" class="btn btn-sm btn-ghost btn-circle">
                            <SVGEdit class="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div>
                    <button class="btn btn-large btn-secondary">Change Password</button>
                </div>
            </div>
        </div>
        <Alert :alertType="msgError ? 'error' : 'success'" :change="change" :interval="5000">
            {{ msgError || msgSuccess }}
        </Alert>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["auth", "save-url"]
})

const user = await useUser()
const { updateUsername } = await useAuth()

const usernameEditing = ref(false)
const usernameLoading = ref(false)

const msgSuccess = ref("")
const msgError = ref("")
const change = ref(false)

const newUsername = ref("")

const usernameInput = ref(null)

const editUsername = async () => {
    newUsername.value = user.value.username
    usernameEditing.value = true

    await nextTick()
    // @ts-ignore
    usernameInput.value.select()
}

const setUsername = async () => {
    if (newUsername.value == user.value.username) {
        usernameEditing.value = false
        return
    }

    usernameLoading.value = true
    updateUsername(user.value.uid, newUsername.value, user.value.role < 3).then((result) => {
        msgSuccess.value = `Successfully changed username to: ${newUsername.value}`
        msgError.value = ""

        usernameEditing.value = false
    }).catch((err) => {
        msgError.value = `Error in changing username, try a different one`
        msgSuccess.value = ""
    }).finally(() => {
        change.value = !change.value
        usernameLoading.value = false
    });
}
</script>

<style scoped></style>