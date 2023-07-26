import { arrayUnion } from "firebase/firestore";

export default defineEventHandler(async (event) => {
    const { req, res } = event.node
    const body = await readBody(event);
    if (!body.videoId || !body.gameId || !body.clip){
        res.statusCode = 400
        res.statusMessage = "bad request body"
    }
  
    try {
        const igdbUserRef = firestore.doc("users/IGDB");
        const systemUserRef = firestore.doc("users/system");
        body.clip.suggested = igdbUserRef
        body.clip.approved = systemUserRef

        const docRef = firestore.doc(`clips/${body.videoId}`);
        await docRef.set(body.clip);
        await firestore.doc(`games/${body.gameId}`).update({
            featured: arrayUnion(docRef),
        });
    } catch (err) {
        res.statusCode = 401
        res.statusMessage = "error in firestore operations: "+err
    }
    
    return "ok"
  });
  