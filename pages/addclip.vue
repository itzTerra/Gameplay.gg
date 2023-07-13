<template>
    <div class="max-w-5xl bg-base-200 rounded m-6 p-6">
        <button @click="updateClip">Update clip</button>
        
        <div v-if="user.role >= 2">
            <h2 class="text-3xl text-center">Admin View</h2>
        </div>
        <div v-else>
            <h2 class="text-3xl text-center">User View</h2>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ["auth", "save-url"]
})

const user = await useUser()


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

<style lang="scss" scoped>

</style>