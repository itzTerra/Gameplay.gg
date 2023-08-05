import {
  getDoc,
  doc,
  type Firestore,
  type DocumentReference,
  type DocumentData,
  setDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  collection,
  increment,
  arrayRemove,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  Timestamp,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { type ClipData } from "utils/utils";

const fillClipsFromFirestore = async (
  clipArray: ClipData[] | DocumentData[],
  firestoreClips: DocumentReference[],
  cache: globalThis.Ref<Record<string, any>>
) => {
  const clipIds = clipArray.map((clip) => clip.id);
  const asyncTasks = firestoreClips.map(async (docRef) => {
    if (clipIds.includes(docRef.id)) return;

    try {
      const snap = await getDoc(docRef);
      const clip = snap.data();

      if (clip) {
        clip.id = docRef.id;

        const suggestedSnap = await getDoc(clip.suggested);
        clip.suggested = suggestedSnap.data();
        clip.suggestedLoaded = true;

        const approvedSnap = await getDoc(clip.approved).catch(() => null);
        clip.approved = approvedSnap?.data();

        clip.date = getTimeDifference(clip.date);

        // @ts-ignore
        clipArray.push(clip);
        cache.value[clip.id] = clip;
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Wait for all async tasks to complete before continuing
  await Promise.all(asyncTasks);
};

export const getClipsForGame = async (
  gameId: string | number,
  onFeaturedLoaded: CallableFunction | null = null
) => {
  const clipsRes = ref<Record<string, any>>({
    featured: [],
    featuredLoaded: false,
    approved: [],
    approvedLoaded: false,
  });

  const cachedClips = getCachedClips();
  let cached = true;
  if (cachedClips.value.length > 0) {
    for (const clip of Object.values(cachedClips.value)) {
      if (clip.game_id != gameId) {
        cached = false;
        break;
      }

      if (clip.featured) {
        clipsRes.value.featured.push(clip);
      } else {
        clipsRes.value.approved.push(clip);
      }
    }
  } else {
    cached = false;
  }

  console.log("Clips are cached:", cached);

  if (!cached) {
    const firestore = useNuxtApp().$firestore as Firestore;
    const firestoreData = (
      await getDoc(doc(firestore, "games", gameId.toString())).catch(() => null)
    )?.data();

    if (firestoreData) {
      fillClipsFromFirestore(
        clipsRes.value.featured,
        firestoreData.featured,
        cachedClips
      )
        .then(async () => {
          if (onFeaturedLoaded !== null) {
            await onFeaturedLoaded(clipsRes.value.featured);
          }
          clipsRes.value.featuredLoaded = true;
        })
        .catch((err) => {
          console.error(err);
        });
      fillClipsFromFirestore(
        clipsRes.value.approved,
        firestoreData.approved,
        cachedClips
      )
        .then(() => {
          clipsRes.value.approvedLoaded = true;
        })
        .catch((err) => {
          console.error(err);
        });

      return clipsRes;
    }
  }

  if (onFeaturedLoaded !== null) {
    await onFeaturedLoaded(clipsRes.value.featured);
  }
  clipsRes.value.featuredLoaded = true;
  clipsRes.value.approvedLoaded = true;

  return clipsRes;
};

export const useClip = async (id: string) => {
  const clip = ref<Record<string, any>>({});

  const firestore = useNuxtApp().$firestore as Firestore;
  const clipDocRef = doc(firestore, "clips", id.toString());

  const cachedClips = getCachedClips();
  if (cachedClips.value && cachedClips.value[id]) {
    clip.value = cachedClips.value[id];
  } else {
    // Get firestore user-data
    const firestoreData = (await getDoc(clipDocRef).catch(() => null))?.data();

    if (firestoreData) {
      firestoreData.id = id;
      clip.value = firestoreData;

      clip.value.date = getTimeDifference(clip.value.date);

      getDoc(firestoreData.suggested)
        .then((snap) => {
          clip.value.suggested = snap.data();
        })
        .catch(() => {
          clip.value.suggested = null;
        });
      getDoc(firestoreData.approved)
        .then((snap) => {
          clip.value.approved = snap.data();
        })
        .catch(() => {
          clip.value.approved = null;
        });
    }
  }

  // Update values on Firestore update
  onSnapshot(clipDocRef, (snap) => {
    const data = snap.data();
    if (data && data.likes != clip.value.likes) {
      clip.value.likes = data.likes;
    }
  });

  return clip;
};

const updateGameClips = async (
  firestore: Firestore,
  gameId: string,
  data: DocumentData
) => {
  const docRef = doc(firestore, "games", gameId);

  if (!(await getDoc(docRef)).exists()) {
    await setDoc(docRef, {
      featured: [],
      approved: [],
    });
  }

  await updateDoc(docRef, data);
};

const createClip = async (
  firestore: Firestore,
  clipId: string,
  clipData: Record<string, any>
) => {
  const clipDocRef = doc(firestore, "clips", clipId);
  await setDoc(clipDocRef, {
    ...clipData,
    likes: 0,
    date_approved: Timestamp.now(),
});

  if (clipData.featured) {
    await updateGameClips(firestore, clipData.game_id.toString(), {
      featured: arrayUnion(clipDocRef),
    });
  } else {
    await updateGameClips(firestore, clipData.game_id.toString(), {
      approved: arrayUnion(clipDocRef),
    });
  }
};

export const submitClip = async (
  clipDataRaw: Record<string, any>,
  autoApprove: boolean
) => {
  const firestore = useNuxtApp().$firestore as Firestore;
  const userRef = doc(firestore, "users", clipDataRaw.suggested);

  if (autoApprove) {
    const clipId = clipDataRaw.clipId;
    delete clipDataRaw.clipId;

    await createClip(firestore, clipId, {
      ...clipDataRaw,
      suggested: userRef,
      approved: userRef,
      date: Timestamp.now(),
    });
  } else {
    await addDoc(collection(firestore, "suggestedClips"), {
      ...clipDataRaw,
      suggested: userRef,
      date: Timestamp.now(),
      status: "pending",
    });
  }
};

export const useSuggestedClips = async () => {
  const clips = ref<any>([]);

  const firestore = useNuxtApp().$firestore as Firestore;

  if (firestore) {
    getDocs(query(collection(firestore, "suggestedClips"), where("status", "==", "pending"), orderBy("date")))
      .then(async (snap) => {
        for (const doc of snap.docs) {
          const clip = doc.data();

          clip.id = doc.id;
          const userObj = (
            await getDoc(clip.suggested).catch(() => null)
          )?.data();
          // @ts-ignore
          userObj.id = clip.suggested.id;
          clip.suggested = userObj;
          clip.date = getTimeDifference(clip.date);
          delete clip.suggested.approvedClips;

          clips.value.push(clip);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return clips;
};

export const rejectClip = async (docId: string) => {
  const firestore = useNuxtApp().$firestore as Firestore;

  await updateDoc(doc(firestore, "suggestedClips", docId), {
    status: "rejected",
    date_rejected: Timestamp.now(),
  });
};

export const approveClip = async (docId: string, uid: string) => {
  const firestore = useNuxtApp().$firestore as Firestore;

  const sClipDocRef = doc(firestore, "suggestedClips", docId);
  const sClipSnap = await getDoc(sClipDocRef);
  const clip = sClipSnap.data();

  if (!clip) {
    throw new Error("suggested clip doc does not exist");
  }

  await updateDoc(sClipDocRef, {
    status: "approved",
  });

  const clipId = clip.clip_id;
  delete clip.clip_id;
  delete clip.id;
  delete clip.mod_notes;
  delete clip.status;

  await createClip(firestore, clipId, {
    ...clip,
    approved: doc(firestore, "users", uid),
    suggested: doc(firestore, "users", clip.suggested.id),
  });
};

export const likeClip = async (uid: string, clipId: string) => {
  const firestore = useNuxtApp().$firestore as Firestore;

  updateDoc(doc(firestore, "users", uid), {
    likedClips: arrayUnion(clipId),
  });

  updateDoc(doc(firestore, "clips", clipId), {
    likes: increment(1),
  });
};

export const dislikeClip = async (uid: string, clipId: string) => {
  const firestore = useNuxtApp().$firestore as Firestore;

  updateDoc(doc(firestore, "users", uid), {
    likedClips: arrayRemove(clipId),
  });

  updateDoc(doc(firestore, "clips", clipId), {
    likes: increment(-1),
  });
};

export const usePopularClips = async (clipsPerPage: number = 8) => {
  const firestore = useNuxtApp().$firestore as Firestore;

  const clips = ref<any>([]);
  const games = ref<any>({});
  let lastClipSnap: null | QueryDocumentSnapshot<DocumentData>;

  const queryClips = async (count: number) => {
    try {
      const snap = await getDocs(
        lastClipSnap
          ? query(
              collection(firestore, "clips"),
              orderBy("likes", "desc"),
              orderBy("date", "desc"),
              orderBy("title"),
              startAfter(lastClipSnap),
              limit(count)
            )
          : query(
              collection(firestore, "clips"),
              orderBy("likes", "desc"),
              orderBy("date", "desc"),
              orderBy("title"),
              limit(count)
            )
      );

      const gameIds = [];
      for (const doc of snap.docs) {
        const clip = reactive(doc.data());

        clip.id = doc.id;
        getDoc(clip.suggested).then((snap) => {
          clip.suggested = snap.data();
          clip.suggestedLoaded = true;
        });
        clip.date = getTimeDifference(clip.date);
        gameIds.push(clip.game_id);

        clips.value.push(clip);

        lastClipSnap = doc;
      }

      getShortGames(gameIds).then((res) => {
        let reduced = res.reduce((result: any, obj: any) => {
          result[obj.id] = obj;
          return result;
        }, {});

        games.value = {
          ...games.value,
          ...reduced,
        };
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (firestore) {
    queryClips(clipsPerPage);
  }

  return { clips, queryClips, games };
};
