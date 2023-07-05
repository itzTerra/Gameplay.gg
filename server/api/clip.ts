export default defineEventHandler(async event => { 
    const ref = firestore.doc(`clips/0`);
    const snapshot = await ref.get();
    const data = snapshot.data();
    return data;
})