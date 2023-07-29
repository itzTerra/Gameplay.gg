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
} from "firebase/firestore";
import { type ClipData } from "utils/utils";

const fillClipsFromFirestore = async (
  clipArray: ClipData[] | DocumentData,
  firestoreClips: DocumentReference[],
  cache: globalThis.Ref<Record<string, any>>
) => {
  for (const docRef of firestoreClips) {
    const clip = (await getDoc(docRef).catch(() => null))?.data();

    if (clip) {
      clip.id = docRef.id;
      getDoc(clip.suggested).then(snap => {
        clip.suggested = snap.data()
        clip.suggestedLoaded = true
      });
      clip.approved = (await getDoc(clip.approved).catch(() => null))?.data();
      clip.date = getTimeDifference(clip.date);

      clipArray.push(clip);
      cache.value[clip.id] = clip;
    }
  }
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
  let cached = false;
  if (cachedClips.value) {
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

    cached = Object.values(cachedClips.value).length > 0;
    console.log("Clips are cached:", cached);
  }

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

export const submitClip = async (
  clipDataRaw: Record<string, any>,
  autoApprove: boolean
) => {
  const firestore = useNuxtApp().$firestore as Firestore;
  const userRef = doc(firestore, "users", clipDataRaw.suggested);

  if (autoApprove) {
    const clipDocRef = doc(firestore, "clips", clipDataRaw.clipId);
    await setDoc(clipDocRef, {
      ...clipDataRaw,
      suggested: userRef,
      approved: userRef,
      likes: 0,
      date: Timestamp.now(),
    });

    if (clipDataRaw.featured) {
      await updateGameClips(firestore, clipDataRaw.game_id.toString(), {
        featured: arrayUnion(clipDocRef),
      });
    } else {
      await updateGameClips(firestore, clipDataRaw.game_id.toString(), {
        approved: arrayUnion(clipDocRef),
      });
    }
  } else {
    await addDoc(collection(firestore, "suggestedClips"), {
      ...clipDataRaw,
      suggested: userRef,
      date: Timestamp.now(),
    });
  }
};

export const useSuggestedClips = async () => {
  const clips = ref<any>([]);

  const firestore = useNuxtApp().$firestore as Firestore;

  if (firestore) {
    getDocs(query(collection(firestore, "suggestedClips"), orderBy("date")))
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

  await deleteDoc(doc(firestore, "suggestedClips", docId));
};

export const approveClip = async (docId: string, uid: string) => {
  const firestore = useNuxtApp().$firestore as Firestore;

  const sClipDocRef = doc(firestore, "suggestedClips", docId);
  const sClipSnap = await getDoc(sClipDocRef);
  const clip = sClipSnap.data();

  if (!clip) {
    throw new Error("suggested clip doc does not exist");
  }

  await deleteDoc(sClipDocRef);
  delete clip.id;

  const clipId = clip.clip_id;
  delete clip.clip_id;
  delete clip.mod_notes;

  const clipDocRef = doc(firestore, "clips", clipId);
  await setDoc(clipDocRef, {
    ...clip,
    approved: doc(firestore, "users", uid),
    suggested: doc(firestore, "users", clip.suggested.id),
    likes: 0,
  });

  if (clip.featured) {
    await updateGameClips(firestore, clip.game_id.toString(), {
      featured: arrayUnion(clipDocRef),
    });
  } else {
    await updateGameClips(firestore, clip.game_id.toString(), {
      approved: arrayUnion(clipDocRef),
    });
  }
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
