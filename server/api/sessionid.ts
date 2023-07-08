export default defineEventHandler(async event => { 
    const {req, res} = event.node
    if (req.method == "POST"){
        let id = getCookie(event, "sessionId")
        if (!id || id != event.context.session.id){
            return null
        }
        console.log(event.context.session)
        return event.context.session
    }
})