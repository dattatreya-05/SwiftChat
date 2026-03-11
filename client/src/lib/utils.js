//here we will create utility functions

//the msg.createdAt is very long (2025-04-28T10:23:27.844Z),we will only extract the hours and minutes from it (23:27) using this function
export function formatMessageTime(date){
    return new Date(date).toLocaleTimeString("en-US",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:false,
    })
}