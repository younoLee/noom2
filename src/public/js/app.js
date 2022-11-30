const messageList = document.querySelector("ul");
const messageform = document.querySelector("form")
const socket = new WebSocket(`ws://${window.location.host}`)

socket.addEventListener("open", () =>{
    console.log("connect to Server")
});
socket.addEventListener("message", (message)=>{
    const li = document.createElement("li");
    li.innerText= message.data;
    messageList.append(li);
});
socket.addEventListener("close", () =>{
    console.log("Disconnect from the Server")
});
function handlesubmit(event){
    event.preventDefault();
    const input = messageform.querySelector("input");
    socket.send(input.value);
    input.value = "";
};

messageform.addEventListener("submit",handlesubmit)