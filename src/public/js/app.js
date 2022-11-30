const socket = new WebSocket(`ws://${window.location.host}`)

socket.addEventListener("open", () =>{
    console.log("connect to Server")
});
socket.addEventListener("message", (message)=>{
    console.log(("Just got this:", message,"from the server"))
});
socket.addEventListener("close", () =>{
    console.log("Disconnect from the Server")
});
setTimeout(() => {
    socket.send("hello from browser")
},5000);