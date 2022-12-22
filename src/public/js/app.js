const socket = io();
const myFace= document.getElementById("myFace");
const muteBin = document.getElementById("mute");
const cameraBin = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput")
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            cameraSelect.appendChild(option);
        });
    }catch (e){
        console.log(e);
    }
}

async function getMedia() {
    try {
        myStream= await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        myFace.srcObject = myStream;
        await getCameras();
    } catch(e) {
        console.log(e);
    }
}
getMedia();

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

muteBin.addEventListener("click", handleMuteClick);
cameraBin.addEventListener("click", handleCameraClick)