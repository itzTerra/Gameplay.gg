export default defineEventHandler(async event => { 
    console.log(event.node.req.method)

    const sessionCookie = {
        idToken: event.node.req.headers.authorization,
        user: await readBody(event)
    }
    console.log(sessionCookie)
    
    // setCookie(event, "__session", sessionCookie)

    /*
    I need to verify the auth token with Firebase
    If correct -> save user to session
    */
    // event.context.session.user = ... 

})