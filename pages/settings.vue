<template>
    <div class="flex flex-col lg:flex-row items-center">
        <div class="mx-auto my-auto bg-base-200 rounded-box px-8 py-6 max-w-7xl min-h-[300px] flex flex-col items-start">
            <h2 class="text-3xl font-bold mb-4">Profile</h2>
            <div class="flex flex-wrap gap-10 items-center justify-around w-full">
                <div>
                    <p class="font-light text-lg mb-2">Username</p>
                    <form v-if="usernameEditing" @submit.prevent="setUsername" class="flex items-center gap-1">
                        <input ref="usernameInput" type="text" v-model="newUsername" class="input w-56 me-4">
                        <button v-if="!usernameLoading" type="submit" class="btn btn-sm btn-success btn-circle"
                            title="Save">
                            <SVGSave class="w-6 h-6" />
                        </button>
                        <span v-else class="loading loading-spinner"></span>
                        <button @click="usernameEditing = false" type="button" class="btn btn-sm btn-error btn-circle"
                            title="Cancel">
                            <SVGClose class="w-6 h-6" />
                        </button>
                    </form>
                    <div v-else class="flex items-center gap-4">
                        <p class="font-semibold text-xl p-3 bg-base-100 rounded-lg w-56 overflow-x-auto small-scrollbar">
                            {{ user ? user.username : '' }}</p>
                        <button @click="editUsername" class="btn btn-sm btn-ghost btn-circle">
                            <SVGEdit class="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div>
                    <p class="font-light text-lg mb-2">Email</p>
                    <div class="flex items-center gap-4">
                        <p class="font-semibold text-xl p-3 bg-base-100 rounded-lg w-56 truncate">
                            {{ formattedEmail }}</p>
                        <button @click="openChangeEmailModal" class="btn btn-sm btn-ghost btn-circle">
                            <SVGEdit class="w-6 h-6" />
                        </button>
                    </div>
                    <dialog ref="changeEmailModal" class="modal">
                        <div class="modal-box bg-base-200 text-base-content">
                            <form method="dialog" ref="changeEmailCloseForm" @submit.prevent="closeChangeEmailModal">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 class="font-bold text-xl mb-5">Change Email</h3>
                            <form @submit.prevent="changeEmail" class="flex flex-col">
                                <input type="password" v-model="currentPass" placeholder="Password"
                                    class="input input-lg input-bordered overflow-ellipsis" required>
                                <NuxtLink to="/resetpass/" target="_blank" tabindex="-1"
                                    class="link link-secondary link-hover mt-2 ms-2 self-start" title="Open in new tab">
                                    Forgot your password?
                                </NuxtLink>
                                <input type="email" v-model="newEmail" placeholder="New email"
                                    class="input input-bordered overflow-ellipsis input-lg mt-6" required>
                                <button class="btn btn-primary my-5 self-center w-auto" type="submit">
                                    <span v-show="loading == 'changeEmail'" class="loading loading-spinner"></span>
                                    Change
                                </button>
                            </form>
                        </div>
                    </dialog>
                </div>
                <div>
                    <button class="btn btn-large btn-primary" @click="openChangePassModal">Change
                        Password</button>
                    <dialog ref="changePassModal" class="modal modal-bottom sm:modal-middle">
                        <div class="modal-box bg-base-200 text-base-content">
                            <form method="dialog" ref="changePassCloseForm" @submit.prevent="closeChangePassModal">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 class="font-bold text-xl mb-5">Change Password</h3>
                            <form @submit.prevent="changePassword" class="flex flex-col">
                                <input type="password" v-model="passwords.old" placeholder="Old password"
                                    class="input input-lg input-bordered overflow-ellipsis" required>
                                <NuxtLink to="/resetpass/" target="_blank" tabindex="-1"
                                    class="link link-secondary link-hover mt-2 ms-2 self-start" title="Open in new tab">
                                    Forgot your password?
                                </NuxtLink>
                                <div class="join join-vertical w-full mt-6">
                                    <input type="password" v-model="passwords.new1"
                                        placeholder="New password (8 characters min.)"
                                        class="input input-bordered overflow-ellipsis input-lg join-item" required>
                                    <input type="password" v-model="passwords.new2" placeholder="Confirm new password"
                                        class="input input-bordered overflow-ellipsis input-lg join-item" required>
                                </div>
                                <button class="btn btn-primary my-5 self-center w-auto" type="submit">
                                    <span v-show="loading == 'changePass'" class="loading loading-spinner"></span>
                                    Change
                                </button>
                            </form>
                        </div>
                    </dialog>
                </div>
            </div>
            <div class="divider before:bg-primary after:bg-primary"></div>
            <h2 class="text-3xl font-bold mb-4">My Clips</h2>
            <div>
                <ClientOnly>
                    <ClipsTable />
                </ClientOnly>
            </div>
        </div>
        <Alert :alertType="msgError ? 'error' : 'success'" :change="change" :interval="5000">
            {{ msgError || msgSuccess }}
        </Alert>
    </div>
</template>

<script setup lang="ts">
useHead({ title: "Profile" })
definePageMeta({
    middleware: ["auth", "save-url"]
})

const route = useRoute()
const router = useRouter()

const changePassModal = ref(null)
const changePassCloseForm = ref(null)

onMounted(() => {
    if (route.query.action) {
        if (route.query.action == "changePass") {
            // @ts-ignore
            changePassModal.value.showModal()
        }
    }
})

const user = await useUser()
const { updateUsername, updatePass, changeEmail: updateEmail } = await useAuth()

const usernameEditing = ref(false)
const usernameLoading = ref(false)

const msgSuccess = ref("")
const msgError = ref("")
const change = ref(false)

const loading = ref("")

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
    try {
        await updateUsername(user.value.uid, newUsername.value, user.value.role < 3)
        msgSuccess.value = `Successfully changed username to: ${newUsername.value}`
        msgError.value = ""

        usernameEditing.value = false
    } catch (error: any) {
        if (error.name == "usernameExists") {
            msgError.value = `Username already exists`
        } else {
            msgError.value = `Error in changing username, try a different one`
        }
        msgSuccess.value = ""
    }

    change.value = !change.value
    usernameLoading.value = false
}

const passwords = shallowReactive({
    old: "",
    new1: "",
    new2: ""
})

const openChangePassModal = () => {
    // @ts-ignore
    changePassModal.value.showModal()
    router.replace({ path: route.fullPath, query: { action: "changePass" } })
}

const closeChangePassModal = () => {
    // @ts-ignore
    changePassCloseForm.value.submit()
    router.replace(route.path)
}

const changePassword = async () => {
    const passwordCheck = isValidPassword(passwords.new1, passwords.new2)
    if (!passwordCheck.valid) {
        passwords.new1 = ""
        passwords.new2 = ""
        msgError.value = passwordCheck.msg || ""
        msgSuccess.value = ""
        change.value = !change.value
        return
    }

    loading.value = "changePass"
    try {
        await updatePass(passwords.old, passwords.new1);

        msgSuccess.value = "Password successfully changed"
        msgError.value = ""

        passwords.old = ""
        passwords.new1 = ""
        passwords.new2 = ""
        closeChangePassModal()
    } catch (error) {
        msgSuccess.value = ""

        if (error == "Error: auth/wrong-password") {
            passwords.old = ""
            msgError.value = "Wrong old password"
        } else if (error == "Error: auth/too-many-requests") {
            msgError.value = "Too many failed login attempts, reset your password or try again later"
        } else {
            msgError.value = "Change failed: " + error
        }
    }
    change.value = !change.value
    loading.value = ""
}

const changeEmailModal = ref(null)
const changeEmailCloseForm = ref(null)

const currentPass = ref("")
const newEmail = ref("")

const formattedEmail = computed(() => {
    if (!user.value || !user.value.email) return ""

    const [name, domain] = user.value.email.split('@');
    const domains = domain.split('.');
    const firstLevelDomain = domains.pop()

    const otherDomains = domains.map((d: string) => { return d.slice(0, 1) + "..." }).join(".")

    return `${name.slice(0, 1)}...@${otherDomains}.${firstLevelDomain}`;
})

const openChangeEmailModal = () => {
    // @ts-ignore
    changeEmailModal.value.showModal()
    router.replace({ path: route.fullPath, query: { action: "changeEmail" } })
}

const closeChangeEmailModal = () => {
    // @ts-ignore
    changeEmailCloseForm.value.submit()
    router.replace(route.path)
}

const changeEmail = async () => {
    loading.value = "changeEmail"
    try {
        await updateEmail(currentPass.value, newEmail.value);

        msgSuccess.value = "Email successfully changed"
        msgError.value = ""

        currentPass.value = ""
        newEmail.value = ""
        closeChangeEmailModal()
    } catch (error) {
        msgSuccess.value = ""

        if (error == "Error: auth/wrong-password") {
            currentPass.value = ""
            msgError.value = "Wrong current password"
        } else if (error == "Error: auth/too-many-requests") {
            msgError.value = "Too many failed login attempts, reset your password or try again later"
        } else {
            msgError.value = "Change failed: " + error
        }
    }
    change.value = !change.value
    loading.value = ""
}
</script>

<style scoped></style>