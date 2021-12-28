const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeOut = null; 
let controlsMovementTimeout = null;
let volumeValue = 0.5; 
video.volume = volumeValue;

const handlePlayClick = (e) =>{
    if(video.paused){ 
        video.play();
    }else{
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
} 

const handleMute = (e) =>{
    if(video.muted){ 
        video.muted = false;
    }else{
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
}

const handleVolume = (event) => {
    const value = event.target.value;
    if(video.muted){
        video.muted = false;
        muteBtnIcon.classList = "fas fa-volume-up";
    }
    volumeValue = Number(value); 
    video.volume = value;
    if(volumeValue === 0){
        video.muted = true;
        muteBtnIcon.classList = "fas fa-volume-mute";
    }
}

const handleTimeLine =(event)=>{
    const {
        target: {value}
    } = event; 
    video.currentTime = value; 
}

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19); 

const handleLoadedMetaData = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration)); 
    timeline.max = Math.floor(video.duration); 
}
const handleTimeUpdate = () =>{
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime); 
}

const handleFullScreen = () => { 
    const fullScreen = document.fullscreenElement; 
    if(fullScreen){
        document.exitFullscreen(); 
        fullScreenIcon.classList = "fas fa-expand";
    }else{  
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
}

const hideControls = () => (videoControls.classList.remove("showing")); 

const handleMouseMove = () =>{
    if(controlsTimeOut){ 
        clearTimeout(controlsTimeOut); 
        controlsTimeOut = null; 
    }
    if(controlsMovementTimeout){ 
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing") 
    controlsMovementTimeout = setTimeout(hideControls, 3000); 
}

const handleMouseLeave = () =>{
    videoControls.classList.remove("showing");
}

const handleVideoClick = (event) =>{
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
}


const handleEnd = () => {
    const { id } = videoContainer.dataset;  
    fetch(`/api/videos/${id}/view`, {
        method: "POST",
    });  
}

if (video.readyState == 4) { 
    handleLoadedMetaData();
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolume); 
video.addEventListener("loadedmetadata", handleLoadedMetaData); 
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnd);  
video.addEventListener("click", handleVideoClick);
timeline.addEventListener("input", handleTimeLine);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);

