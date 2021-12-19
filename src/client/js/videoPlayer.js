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

let controlsTimeOut = null; //setTimeout함수의 id값을 저장하는 변수.
let controlsMovementTimeout = null;
let volumeValue = 0.5; //volume 의 global변수(html range tag를 위한것)
video.volume = volumeValue;

const handlePlayClick = (e) =>{
    if(video.paused){ //html video property ->paused
        video.play();
    }else{
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause"; //영상이 pause 되고 잇으면 버튼의 text는  play상태, 영상이 play 되고 잇으면 버튼의 text는  pause상태
} 

const handleMute = (e) =>{
    if(video.muted){ //mute인 상태에서 handlemute가 call됐다는 것은 unmute하겠다는 것이므로 video.muted = false로 해줘야함.
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
    volumeValue = Number(value); //volumeValue는 string형식으로 저장되므로 Number로 형식변환을 해줘야 volume이 0이 되었을때 muted활성화됨.
    video.volume = value;
    if(volumeValue === 0){
        video.muted = true;
        muteBtnIcon.classList = "fas fa-volume-mute";
    }
}

const handleTimeLine =(event)=>{
    const {
        target: {value}
    } = event; // === const value = event.target.value;
    video.currentTime = value; //timeline의 움직임에 따라 video 움직임. timeline -> video
}

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19); //시간 formating 함수

const handleLoadedMetaData = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration)); //이 함수가 호출되기 전에는 video의 전체길이를 알수 없음.
    timeline.max = Math.floor(video.duration); //timeline의 max 값 설정
}
const handleTimeUpdate = () =>{
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime); //video의 현재 시간에 따라 timeline 변화. video->timeline
}

const handleFullScreen = () => { // fullScreenBtn이 click됐을때 호출되는 콜백 함수
    const fullScreen = document.fullscreenElement; // fullscreenElement -> fullScreen요소가 document에 있는지 값을 반환하는 property. 없으면 null 반환
    if(fullScreen){
        document.exitFullscreen(); //fullscreen상태일때 Btn이 클릭되면 fullScreen 탈출.
        fullScreenIcon.classList = "fas fa-expand";
    }else{  
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
}

const hideControls = () => (videoControls.classList.remove("showing")); //mouse가 video에서 떨어지면 3초뒤 showing class 삭제

const handleMouseMove = () =>{
    if(controlsTimeOut){ //controlsTimeOut값이 있는 상태에서 이 함수가 호출됐다는 것은 마우스가 video위에 있다가 나갔다가 다시 들어온 상태를 의미함..
        clearTimeout(controlsTimeOut); //3초의 시간을 삭제.
        controlsTimeOut = null; //다시 null값으로 초기화
    }
    if(controlsMovementTimeout){ //video안에서 3초안에 마우스가 다시 움직이면 기존의 controlsMovementTimeout삭제하고 timeout 초기화. 다시 3초 시작.
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing") //video 안에서 mouse움직임이 있으면 비디오 컨트롤에 showing class추가
    controlsMovementTimeout = setTimeout(hideControls, 3000); //비디오 안에서 마우스가 3초동안 움직이지 않는다면 class 삭제.
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

const handleKeydown = (event) =>{
    if(event.key == " "){
        handleVideoClick();
    }
}

const handleEnd = () => {
    const { id } = videoContainer.dataset;  //videoContainer의 data-id에서 video의 id 가져옴
    fetch(`/api/videos/${id}/view`, {
        method: "POST",
    }); //forntend의 정보를 backend로 전송. 
}

if (video.readyState == 4) { //eventlistener을 추가하기 전에 video가 로딩이 돼, handleLoadedMetadata가 불러지지 않을 수 있음. video.readyState가 4는 video가 불러와져서 사용이 가능하다는 뜻
    handleLoadedMetaData();
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolume); //input이라는 event는 range태그의 변화를 실시간으로 출력해줌.
video.addEventListener("loadedmetadata", handleLoadedMetaData); //loadedmetadata => video의 meta data를 가져오는 event.
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnd); //비디오 시청이 끝났을때의 이벤트 감지. 
video.addEventListener("click", handleVideoClick);
timeline.addEventListener("input", handleTimeLine);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("keydown", handleKeydown);
