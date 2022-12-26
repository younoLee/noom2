const socket = io();
const myFace= document.getElementById("myFace");
const muteBin = document.getElementById("mute");
const cameraBin = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");
const call = document.getElementById("call");
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let mypeerConnection;
let myDataChannel;

async function getCameras() {
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput")
        const currentCammera = myStream.getVideoTracks()[0];
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCammera.label == camera.label){
                option.selected = true;
            }
            cameraSelect.appendChild(option);
        });
    }catch (e){
        console.log(e);
    }
}

async function getMedia(deviceId) {
    const  initialConstraints = {
        audio: true,
        video: { facingMode: "user" }
    };
    const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } }
    };
    try {
        myStream= await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints: initialConstraints
        );
        myFace.srcObject = myStream;
        if(!deviceId){
            await getCameras();
        }
        
    } catch(e) {
        console.log(e);
    }
}


function handleMuteClick(){
    myStream.getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
    if(!muted){
        muteBin.innerText = "Unmute"
        muted = true;
    }else{
        muteBin.innerText = "Mute"
        muted = false;
    }
}

function handleCameraClick(){
    myStream.getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
    if(!cameraOff){
        cameraBin.innerText = "Turn Camera On";
        cameraOff = true;
    }else{
        cameraBin.innerText = "Turn Camera Off";
        cameraOff = false;
    }
}
// RTC Code

function makeConnection() {
    mypeerConnection = new RTCPeerConnection({
        iceServers:[
            {
                urls:[
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302",
                ]
            }
        ]

    });
    mypeerConnection.addEventListener("icecandidate",handleIce);
    mypeerConnection.addEventListener("addstream",handleAddStream);
    myStream.getTracks()
    .forEach(track => mypeerConnection.addTrack(track, myStream));
}

function handleIce(data){
    console.log("sent candidate")
    socket.emit("ice", data.candidate, roomName);
}
async function handleCameraChange(){
    await getMedia(cameraSelect.value);
    if(mypeerConnection){
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = mypeerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);
    }
}
function handleAddStream(data){
    const peerFace= document.getElementById("peerFace")
    peerFace.srcObject = data.stream;
}

// Welcome Form (join a room)

call.hidden = true;

async function initCall(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

async function handleWelcomeSubmit(event){
    event.preventDefault();
    const input = welcomeForm.querySelector("input")
    await initCall();
    socket.emit("join_room",input.value, );
    roomName = input.value;
    input.value = "";
}

muteBin.addEventListener("click", handleMuteClick);
cameraBin.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);
welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code

socket.on("welcome",async () => {
    myDataChannel = mypeerConnection.createDataChannel("chat");
    myDataChannel.addEventListener("message", (event) =>{
        console.log(event.data);
    });
    console.log("made data channel");
    const offer = await mypeerConnection.createOffer();
    mypeerConnection.setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer", offer, roomName)
})

socket.on("offer",async(offer) => {
    mypeerConnection.addEventListener("datachannel", (event) => {
        myDataChannel = event.channel;
        myDataChannel.addEventListener("message",(event) => {
            console.log(event.data)
        })
    })
    console.log("received the offer");
    mypeerConnection.setRemoteDescription(offer);
    const answer = await mypeerConnection.createAnswer();
    mypeerConnection.setLocalDescription(answer);
    socket.emit("answer",answer,roomName);
    console.log("sent the answer");
})
socket.on("answer",answer => {
    console.log("received the answer");
    mypeerConnection.setRemoteDescription(answer);
    
});
socket.on("ice",ice => {
    console.log("recived candidate")
    mypeerConnection.addIceCandidate(ice);

})
