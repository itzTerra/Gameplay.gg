export default defineEventHandler(async (event) => {
    // UNUSED
  const { req, res } = event.node;
  if (req.method == "POST") {
    const body = await readBody(event);
    const uid = body.uid;

    if (!uid) {
      res.statusCode = 400;
      return "bad request body";
    }

    const ref = firestore.doc(`users/${uid}`);
    const snapshot = await ref.get();
    const data = snapshot.data();
    return data;
  }

  res.statusCode = 403;
  return "bad request";
});
