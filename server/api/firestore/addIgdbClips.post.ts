import {
  FieldValue,
  Timestamp,
  type DocumentReference,
} from "firebase-admin/firestore";
import { type ApprovedClip } from "utils/clipUtils";

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;
  const body = await readBody(event);

  if (!body.gameId || !body.clips) {
    res.statusCode = 400;
    res.statusMessage = "bad request body";
    return
  }

  const batch = firestore.batch();
  const docRefs: DocumentReference[] = [];
  for (const [id, data] of Object.entries(body.clips)) {
    const clipData: ApprovedClip = data as ApprovedClip;
    // MUST BE SAME AS gameUtils CONSTANTS
    clipData.suggested = firestore.doc("users/IGDB");
    clipData.dateSuggested = Timestamp.fromDate(new Date(2023, 6, 20));
    clipData.approved = firestore.doc("users/system");
    clipData.dateApproved = Timestamp.fromDate(new Date(2023, 6, 20));

    const docRef = firestore.doc(`approvedClips/${id}`);
    batch.set(docRef, data);
    docRefs.push(docRef);
  }

  if (!docRefs.length) return "no clips to add"

  try {
    await batch.commit();

    const gameDocRef = firestore.doc(`games/${body.gameId}`);
    if (!(await gameDocRef.get()).exists) {
      await gameDocRef.set({
        featured: [],
        approved: [],
      });
    }

    await gameDocRef.update({
      featured: FieldValue.arrayUnion(...docRefs),
    });

  } catch (err) {
    res.statusCode = 401;
    res.statusMessage = "error in firestore operations: " + err;
  }

  return "ok";
});
