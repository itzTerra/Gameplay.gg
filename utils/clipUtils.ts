// Utils for clips composables and functions

import {
  DocumentReference,
  type QueryDocumentSnapshot,
  Timestamp,
  getDoc,
  type Firestore,
  type WriteBatch,
  type DocumentData,
  doc,
  arrayUnion,
} from "firebase/firestore";
import {
  type Timestamp as AdminTimestamp,
  type DocumentReference as AdminDocumentReference,
} from "firebase-admin/firestore";

// ############################### INTERFACES, ENUMS, CONSTANTS ##############################

export interface SuggestedClip {
  id: string;

  title: string;
  gameId: string | number;
  description?: string;
  startTime?: number;
  endTime?: number;
  featured: boolean;
  modNotes?: string;
  suggested: DocumentReference | AdminDocumentReference;
  dateSuggested: Timestamp | AdminTimestamp;
}

export interface ApprovedClip {
  title: string;
  gameId: string | number;
  description?: string;
  startTime?: number;
  endTime?: number;
  featured: boolean;
  modNotes?: string;
  suggested: DocumentReference | AdminDocumentReference;
  dateSuggested: Timestamp | AdminTimestamp;

  approved: DocumentReference | AdminDocumentReference;
  dateApproved: Timestamp | AdminTimestamp;
  likes: number;
}

const approvedClipReqFields = ["title", "gameId", "suggested", "approved"];

export interface RejectedClip {
  id: string;

  title: string;
  gameId: string | number;
  description?: string;
  startTime?: number;
  endTime?: number | null;
  featured: boolean;
  modNotes?: string;
  suggested: DocumentReference | AdminDocumentReference;
  dateSuggested: Timestamp | AdminTimestamp;

  approved?: DocumentReference | AdminDocumentReference;
  dateApproved?: Timestamp | AdminTimestamp;
  likes?: number;

  rejected: DocumentReference | AdminDocumentReference;
  dateRejected: Timestamp | AdminTimestamp;
  reason: string;
}

const rejectedClipReqFields = ["title", "gameId", "suggested", "rejected"];

// ################################### UTIL FUNCTIONS #############################

/**
 * Used twice in useGameClips.
 * @param clipArray array to be filled
 * @param firestoreClips firestore clip references got from game's approved or featured clips data
 * @param cache global frontend state for clips cache, not working very well atm
 */
export const fillClipsFromFirestore = async (
  clipArray: DocumentData[],
  firestoreClips: DocumentReference[],
  cache: globalThis.Ref<Record<string, any>>
) => {
  const clipIds = clipArray.map((clip) => clip.id);
  const asyncTasks = firestoreClips.map(async (docRef) => {
    if (clipIds.includes(docRef.id)) return;

    const clip = await getFrontendClip(docRef);
    if (clip) {
      clipArray.push(clip);
      cache.value[clip.id] = clip;
    }
  });

  // Wait for all async tasks to complete before continuing
  await Promise.all(asyncTasks);
};

export const getApprovedClipData = (clipData: Record<string, any>) => {
  for (const field of approvedClipReqFields) {
    if (!(field in clipData)) {
      throw new Error(`clip data is missing required field: ${field}`);
    }
  }

  const firestoreClip: ApprovedClip = {
    title: clipData.title,
    gameId: clipData.gameId,
    description: clipData.description || "",
    startTime: clipData.startTime || 0,
    endTime: clipData.endTime || null,
    featured: clipData.featured || false,
    modNotes: clipData.modNotes || "",
    suggested: clipData.suggested,
    dateSuggested: clipData.dateSuggested || Timestamp.now(),

    approved: clipData.approved,
    dateApproved: clipData.dateApproved || Timestamp.now(),
    likes: clipData.likes || 0,
  };

  return firestoreClip;
};

export const getRejectedClipData = (clipData: Record<string, any>) => {
  for (const field of rejectedClipReqFields) {
    if (!(field in clipData)) {
      throw new Error(`clip data is missing required field: ${field}`);
    }
  }

  const firestoreClip: RejectedClip = {
    id: clipData.id,
    title: clipData.title,
    gameId: clipData.gameId,
    description: clipData.description || "",
    startTime: clipData.startTime || null,
    endTime: clipData.endTime || null,
    featured: clipData.featured || false,
    modNotes: clipData.modNotes || "",
    suggested: clipData.suggested,
    dateSuggested: clipData.dateSuggested || Timestamp.now(),

    approved: clipData.approved || null,
    dateApproved: clipData.dateApproved || null,
    likes: clipData.likes || null,

    rejected: clipData.rejected,
    dateRejected: Timestamp.now(),
    reason: clipData.reason || "",
  };

  return firestoreClip;
};

export const getFrontendClip = async (
  docRef: DocumentReference | QueryDocumentSnapshot
) => {
  try {
    let snap;
    if (docRef instanceof DocumentReference) {
      snap = await getDoc(docRef);
    } else {
      snap = docRef;
    }
    const clip = snap.data();

    if (clip) {
      clip.id = docRef.id;

      clip.suggested = (await getDoc(clip.suggested)).data();
      clip.dateSuggested = clip.dateSuggested
        ? getTimeDifference(clip.dateSuggested)
        : "";
      clip.suggestedLoaded = true;

      clip.approved = (await getDoc(clip.approved)).data();
      clip.dateApproved = clip.dateApproved
        ? getTimeDifference(clip.dateApproved)
        : "";

      return clip;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateGameClips = async (
  firestore: Firestore,
  batch: WriteBatch,
  gameId: string,
  data: DocumentData
) => {
  const docRef = doc(firestore, "games", gameId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    batch.set(docRef, {
      featured: [],
      approved: [],
    });
  }

  batch.update(docRef, data);
};

/**
 * Used in suggestClip for auto-approve to skip adding to suggestedClips and ofc. in approveClip.
 * @param firestore
 * @param batch
 * @param clipId
 * @param clipData data with approved user info
 */
export const addApprovedClip = async (
  firestore: Firestore,
  batch: WriteBatch,
  clipId: string,
  clipData: Record<string, any>
) => {
  const docRefApproved = doc(firestore, "approvedClips", clipId);

  const approvedClipData = getApprovedClipData(clipData);
  batch.set(docRefApproved, approvedClipData);

  if (clipData.featured) {
    await updateGameClips(firestore, batch, clipData.gameId.toString(), {
      featured: arrayUnion(docRefApproved),
    });
  } else {
    await updateGameClips(firestore, batch, clipData.gameId.toString(), {
      approved: arrayUnion(docRefApproved),
    });
  }
};

export const getClipsOfStatus = async (
  clipSnaps: QueryDocumentSnapshot<DocumentData>[],
  clipsArray: globalThis.Ref<any[]>,
  gameIdsArray: any[],
  status: string
) => {
  for (const docSnap of clipSnaps) {
    const clip = reactive(docSnap.data());

    clip.id = docSnap.id;
    getDoc(clip.suggested).then((snap) => {
      clip.suggested = snap.data();
      clip.suggestedLoaded = true;
    });
    clip.dateSuggested = getTimeDifference(clip.dateSuggested);

    getDoc(clip.approved).then((snap) => {
      clip.approved = snap.data();
    });
    clip.dateApproved = getTimeDifference(clip.dateApproved);

    clip.status = status;

    gameIdsArray.push(clip.gameId);

    clipsArray.value.push(clip);
  }
};
