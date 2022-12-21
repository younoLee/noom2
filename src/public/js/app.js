const socket = io();
const myface= document.getElementById("myface");
const muteBin = document.getElementById("mute");
const cameraBin = document.getElementById("camera");

let mystream;
let muted = false;
let cameraOff = false;

async function getMedia() {
    try {
        mystream= await navigator.mediaDevices.getUserMedia({
            audio: true,
            vidio: true,
        });
        myface.srcObject= mystream;
    } catch(e) {
        console.log(e);
    }
}
getMedia();

function handleMuteClick(){
    if(!muted){
        muteBin.innerText = "Unmute"
        muted = true;
    }else{
        muteBin.innerText = "Mute"
        muted = false;
    }
}

function handleCameraClick(){
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