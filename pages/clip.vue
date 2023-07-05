<template>
    <div>
        <h2>Data</h2>
        <pre>{{ data }}</pre>
        <button @click="updateClip">Update clip</button>
    </div>
</template>

<script setup>
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";

// Server Side
const { data } = useFetch('/api/clip');

// Client Side
onMounted(async() => {
    const { firestore } = useNuxtApp();
    const docRef = doc(firestore, `clips`, '0');
    onSnapshot(docRef, (snap) => {
        data.value = snap.data();
    });
});

const updateClip = async() => {
    const { firestore } = useNuxtApp();
    const docRef = doc(firestore, `clips`, '0');
    await updateDoc(docRef, {
        name: `0-${Math.floor(Math.random() * 1000)}`,
    });
}
</script>

<style lang="scss" scoped>

</style>