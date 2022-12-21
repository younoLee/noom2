const socket = io();
const myface= document.getElementById("myface");
let mystream;
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