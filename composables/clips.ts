import {
  getDoc,
  doc,
  type Firestore,
  DocumentReference,
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
  type WriteBatch,
  writeBatch,
} from "firebase/firestore";
import { type SuggestedClip } from "utils/clipUtils";

// ####################################### COMPOSABLES ######################################

/**
 * Used in games composable for game detail view.
 * @param gameId id of IGDB game
 * @param onFeaturedLoaded callback function to be called after loading
 * @returns reactive array of clips updated asynchronously
 */
export const useGameClips = async (
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
      if (clip.gameId != gameId) {
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

  // console.log("Clips are cached:", cached);

  if (!cached) {
    const firestore = useNuxtApp().$firestore as Firestore;
    const gameData = (
      await getDoc(doc(firestore, "games", gameId.toString())).catch(() => null)
    )?.data();

    if (gameData) {
      fillClipsFromFirestore(
        clipsRes.value.featured,
        gameData.featured,
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
        gameData.approved,
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

/**
 * Used to get firestore clip data for clip detail (embed dialog).
 * @param id clip id - both the key of firestore document and YT video id atm
 * @returns reactive clip object updated asynchronously
 */
export const useClip = async (id: string | number) => {
  const clip = ref<Record<string, any>>({});

  const firestore = useNuxtApp().$firestore as Firestore;
  const docRef = doc(firestore, "approvedClips", id.toString());

  const cachedClips = getCachedClips();
  if (cachedClips.value && cachedClips.value[id]) {
    clip.value = cachedClips.value[id];
  } else {
    // Intentionally not awaiting
    clip.value = getFrontendClip(docRef);
  }

  // Update values on Firestore update
  onSnapshot(docRef, (snap) => {
    const data = snap.data();
    if (data && data.likes != clip.value.likes) {
      clip.value.likes = data.likes;
    }
  });

  return clip;
};

/**
 * Used in admin suggestions view to see all suggestions.
 * @returns reactive array of clips updated asynchronously
 */
export const useSuggestedClips = async () => {
  const clips = ref<any>([]);

  const firestore = useNuxtApp().$firestore as Firestore;

  if (firestore) {
    getDocs(
      query(collection(firestore, "suggestedClips"), orderBy("dateSuggested"))
    )
      .then(async (snap) => {
        for (const doc of snap.docs) {
          clips.value.push(await getFrontendClip(doc));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return clips;
};

/**
 * Used in index view to see N approvedClips ordered by likes, date and title with their game.
 * @param clipsPerPage number of clips to load, default 8
 * @returns
 * - reactive array of all clips
 * - function to load another page of clips
 * - reactive object of game data indexed by game ids for the clips
 */
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
              collection(firestore, "approvedClips"),
              orderBy("likes", "desc"),
              orderBy("dateSuggested", "desc"),
              orderBy("title"),
              startAfter(lastClipSnap),
              limit(count)
            )
          : query(
              collection(firestore, "approvedClips"),
              orderBy("likes", "desc"),
              orderBy("dateSuggested", "desc"),
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
        clip.dateSuggested = getTimeDifference(clip.dateSuggested);

        getDoc(clip.approved).then((snap) => {
          clip.approved = snap.data();
        });
        clip.dateApproved = getTimeDifference(clip.dateApproved);

        gameIds.push(clip.gameId);

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

// ################################## FUNCTIONS USED IN VIEWS ##################################

/**
 * Used in suggest view.
 * @param clipDataRaw data from suggest form
 * @param autoApprove bool from form checkbox (admin-only)
 */
export const suggestClip = async (
  clipDataRaw: Record<string, any>,
  autoApprove: boolean
) => {
  const firestore = useNuxtApp().$firestore as Firestore;
  const userRef = doc(firestore, "users", clipDataRaw.suggested);

  clipDataRaw.suggested = userRef;

  if (autoApprove) {
    const batch = writeBatch(firestore);
    await addApprovedClip(firestore, batch, clipDataRaw.clipId, {
        ...clipDataRaw,
        approved: userRef
    });
    await batch.commit()
  } else {
    const firestoreClip: SuggestedClip = {
      id: clipDataRaw.id,
      title: clipDataRaw.title,
      gameId: clipDataRaw.gameId,
      description: clipDataRaw.description || "",
      startTime: clipDataRaw.startTime || 0,
      endTime: clipDataRaw.endTime || null,
      featured: clipDataRaw.featured || false,
      modNotes: clipDataRaw.modNotes || "",
      suggested: clipDataRaw.suggested,
      dateSuggested: clipDataRaw.dateSuggested || Timestamp.now(),
    };

    await addDoc(collection(firestore, "suggestedClips"), firestoreClip);
  }
};


/**
 * Used in suggestions admin view to approve clip.
 * @param docId firestore key for document in suggestedClips collection, from v-for
 * @param uid user id from session's authentication
 */
export const approveClip = async (docId: string, uid: string) => {
  const firestore = useNuxtApp().$firestore as Firestore;

  const docRefSuggested = doc(firestore, "suggestedClips", docId);
  const clipData = (await getDoc(docRefSuggested)).data();

  if (!clipData) {
    throw new Error("suggested clip doc does not exist");
  }

  const batch = writeBatch(firestore);

  await addApprovedClip(firestore, batch, clipData.id, {
    ...clipData,
    approved: doc(firestore, "users", uid),
  })

  batch.delete(docRefSuggested);

  try {
    await batch.commit();
  } catch (e) {
    console.error(e);
  }
};

/**
 * Used in suggestions admin view to reject clip AND to delete approved clips in general (TBD).
 * @param approved is this clip suggested or approved
 * @param docId firestore document id, for approvedClips collection if approved, else suggestedClips
 * @param uid user id from session's authentication
 * @param reason reason for rejection from form (TBD)
 */
export const rejectClip = async (
  approved: boolean = false,
  docId: string,
  uid: string,
  reason: string
) => {
  const firestore = useNuxtApp().$firestore as Firestore;
  let docRef;
  if (approved) {
    docRef = doc(firestore, "approvedClips", docId);
  } else {
    docRef = doc(firestore, "suggestedClips", docId);
  }

  const clipData = (await getDoc(docRef)).data();

  if (!clipData) {
    throw new Error("clip doc does not exist");
  }

  const batch = writeBatch(firestore);

  const rejectedClipData = getRejectedClipData({
    ...clipData,
    rejected: doc(firestore, "users", uid),
    reason: reason,
  });
  batch.set(doc(collection(firestore, "rejectedClips")), rejectedClipData);

  if (approved) {
    if (clipData.featured) {
      await updateGameClips(firestore, batch, clipData.gameId.toString(), {
        featured: arrayRemove(docRef),
      });
    } else {
      await updateGameClips(firestore, batch, clipData.gameId.toString(), {
        approved: arrayRemove(docRef),
      });
    }
  }

  batch.delete(docRef);

  try {
    await batch.commit();
  } catch (e) {
    console.error(e);
  }
};

/**
 * Increments approved clip's likes field and adds reference to user's likedClips
 * @param uid user id from session's authentication
 * @param clipId 
 */
export const likeClip = async (uid: string, clipId: string) => {
  const firestore = useNuxtApp().$firestore as Firestore;

  updateDoc(doc(firestore, "users", uid), {
    likedClips: arrayUnion(clipId),
  });

  updateDoc(doc(firestore, "approvedClips", clipId), {
    likes: increment(1),
  });
};

/**
 * Decrements approved clip's likes field and removes reference from user's likedClips
 * @param uid user id from session's authentication
 * @param clipId 
 */
export const dislikeClip = async (uid: string, clipId: string) => {
  const firestore = useNuxtApp().$firestore as Firestore;

  updateDoc(doc(firestore, "users", uid), {
    likedClips: arrayRemove(clipId),
  });

  updateDoc(doc(firestore, "approvedClips", clipId), {
    likes: increment(-1),
  });
};
