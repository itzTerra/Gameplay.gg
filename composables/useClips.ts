import { getDoc, doc, type Firestore } from "firebase/firestore";

export const useClip = async (id: string) => {
  let clip = {};

  const cachedClips = getCachedClips();
  if (cachedClips.value && cachedClips.value[id]) {
    clip = cachedClips.value[id];
  } else {
    const firestore = useNuxtApp().$firestore as Firestore;
    // Get firestore user-data
    const firestoreData = (
      await getDoc(doc(firestore, "clips", id)).catch(() => null)
    )?.data();

    if (firestoreData) {
      cachedClips.value.id = null;
      cachedClips.value[id] = firestoreData;
      clip = firestoreData
    }
  }

  return clip
};


