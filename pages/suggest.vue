<template>
    <div class="flex flex-col justify-center items-center">
        <h1 class="text-4xl font-bold text-center my-4">Suggest a clip</h1>
        <div class="px-8 py-4 rounded-box shadow flex flex-col md:flex-row flex-wrap bg-base-200 max-w-4xl 2xl:max-w-6xl">
            <div class="flex-grow flex flex-col gap-6 items-center">
                <span>Select a game</span>
                <div class="bg-base-100 w-60 h-12">Search</div>
                <div class="form-control w-full max-w-xs">
                    <label class="label">
                        <span class="label-text">Title</span>
                    </label>
                    <input v-model="title" type="text" placeholder="an engaging title"
                        class="input input-bordered input-lg w-full" required />
                </div>
                <div class="form-control w-full max-w-xs">
                    <label class="label">
                        <span class="label-text">Description (optional)</span>
                    </label>
                    <textarea v-model="description" class="textarea textarea-bordered textarea-lg w-full"
                        placeholder="description..."></textarea>
                </div>
                <div class="form-control w-full max-w-xs">
                    <label class="label">
                        <span class="label-text">Notes for mods (optional)</span>
                    </label>
                    <textarea v-model="modNotes" class="textarea textarea-bordered textarea-lg w-full"
                        placeholder="..."></textarea>
                </div>
            </div>
            <div class="divider w-full md:divider-horizontal"></div>
            <div class="w-auto flex flex-col gap-6 items-center">
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">URL</span>
                    </label>
                    <input v-model="url" type="text" placeholder="e.g. https://youtu.be/XXQgcNZSPgY"
                        class="input input-bordered input-lg w-full" required />
                    <div class="text-sm opacity-75 mt-1">
                        <SVGInfo class="inline w-5 h-5 me-1" />Paste YT video or clip URL, short or full version, or even
                        just the id.
                    </div>
                </div>
                <div class="flex justify-center">
                    <iframe class="w-[320px] h-[180px] sm:w-[426px] sm:h-[240px] 2xl:w-[640px] 2xl:h-[360px]" src="https://www.youtube.com/embed/XXQgcNZSPgY?start=6535&end=6555"
                        title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
                </div>
                <div class="flex gap-5">
                    <div class="form-control w-1/2">
                        <label class="label">
                            <span class="label-text">Start Time</span>
                        </label>
                        <input v-model="startTime" type="number" placeholder="0:00"
                            class="input input-bordered w-full" />
                    </div>
                    <div class="form-control w-1/2">
                        <label class="label">
                            <span class="label-text">End Time</span>
                        </label>
                        <input v-model="endTime" type="number" placeholder=""
                            class="input input-bordered w-full" />
                    </div>
                </div>
            </div>
            <div class="divider w-full"></div>
            <div class="w-full mb-4 flex justify-center items-center gap-4">
                <div class="flex flex-col gap-3">
                    <label v-if="user && user.role >= 2" class="flex gap-3 cursor-pointer">
                        <input type="checkbox" :checked="makeFeatured" class="checkbox checkbox-success" />
                        <span class="">Featured</span>
                    </label>
                    <label v-if="user && user.role >= 3" class="flex gap-3 cursor-pointer">
                        <input type="checkbox" :checked="autoApprove" class="checkbox checkbox-success" />
                        <span class="">Auto-approve</span>
                    </label>
                </div>
                <button @click="suggest" class="btn btn-primary btn-lg w-40">Submit</button>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ["auth", "save-url"]
})

const user = await useUser()
const route = useRoute()

const selectedGame = ref(route.query.game)
const title = ref("")
const description = ref("")
const modNotes = ref("")

const url = ref("")
const startTime = ref(null)
const endTime = ref(null)

const makeFeatured = ref(false)
const autoApprove = ref(false)

onMounted(() => {
    if (route.query.featured) {
        makeFeatured.value = route.query.featured
    }
})

const suggest = () => {
    console.log("suggest!")
}

// import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";

// // Server Side
// const { data } = useFetch('/api/clip');

// // Client Side
// onMounted(async() => {
//     const { firestore } = useNuxtApp();
//     const docRef = doc(firestore, `clips`, '0');
//     onSnapshot(docRef, (snap) => {
//         data.value = snap.data();
//     });
// });

// const updateClip = async() => {
//     const { firestore } = useNuxtApp();
//     const docRef = doc(firestore, `clips`, '0');
//     await updateDoc(docRef, {
//         name: `0-${Math.floor(Math.random() * 1000)}`,
//     });
// }
</script>

<style lang="scss" scoped></style>