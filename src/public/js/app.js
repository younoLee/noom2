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
        video: { deviceId: { exact: deviceId } }
    };
    try {
        myStream= await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints: initialConstraints
        );
        myFace.srcObject = myStream;
        await getCameras();
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

async function handleCameraChange(){
    await getMedia(cameraSelect.value);
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
    const offer = await mypeerConnection.createOffer();
    mypeerConnection.setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer", offer, roomName)
})

socket.on("offer",async(offer) => {
    mypeerConnection.setRemoteDescription(offer);
    const answer = await mypeerConnection.createAnswer();
    mypeerConnection.setLocalDescription(answer);
    socket.emit("answer",answer,roomName);
})
socket.on("answer",answer => {
    mypeerConnection.setRemoteDescription(answer);
});
// RTC Code

function makeConnection() {
    mypeerConnection = new RTCPeerConnection();
    myStream.getTracks()
    .forEach(track => mypeerConnection.addTrack(track, myStream));
}