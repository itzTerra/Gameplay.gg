import {
  FieldValue,
  Timestamp,
  type DocumentReference,
} from "firebase-admin/firestore";

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
  for (const clip of body.clips) {
    const igdbUserRef = firestore.doc("users/IGDB");
    const systemUserRef = firestore.doc("users/system");
    clip.suggested = igdbUserRef;
    clip.approved = systemUserRef;
    clip.date = Timestamp.fromDate(new Date(2023, 6, 20));

    const docRef = firestore.doc(`clips/${clip.id}`);
    delete clip.id;

    batch.set(docRef, clip);
    docRefs.push(docRef);
  }

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
