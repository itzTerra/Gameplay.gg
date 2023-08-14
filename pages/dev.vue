<template>
    <div>
        <button @click="execute">GO</button>
    </div>
</template>

<script lang="ts" setup>
import { getDocs, type Firestore, query, collection, where, doc, addDoc, Timestamp, setDoc } from 'firebase/firestore';

const user = await useUser()

const execute = async () => {
    if (!user.value) return

    const firestore = useNuxtApp().$firestore as Firestore;

    const snap = await getDocs(query(collection(firestore, "clips"), where("suggested", "!=", doc(firestore, "users", "IGDB"))))
    for (const docRef of snap.docs){
        const data = docRef.data();
        console.log(data);
        await setDoc(doc(firestore, "approvedClips", docRef.id), {
            title: data.title,
            gameId: data.game_id,
            featured: data.featured,
            description: data.description || "",
            likes: data.likes,
            suggested: data.suggested,
            dateSuggested: data.date,
            approved: data.approved,
            dateApproved: Timestamp.now(),
            startTime: data.start_time,
            endTime: data.endTime || null
        })
    }

}

</script>
