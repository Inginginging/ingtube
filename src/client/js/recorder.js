const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () =>{
    const a = document.createElement("a"); //a tag 생성.
    a.href = videoFile; //a의 link 주소는 videoFile
    a.download = "Recorded Video.webm" //download 이름과 파일 형식까지 지정
    document.body.appendChild(a);
    a.click();// 이 함수가 호출되면 자동으로 a태그가 click됨.
}

const handleStop = () =>{
    startBtn.innerText = "Downloading the Video"
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);

    recorder.stop(); //record stop
}

const handleStart = () => {
    startBtn.innerText = "Stop Recording"
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    recorder = new MediaRecorder(stream); //stream의 정보를 녹화하기 위해 인자로 넣음.
    recorder.ondataavailable = (event) =>{
        console.log(event.data);
        video.srcObject = null; //기존의 video자리의 srcObj 를 지움.
        videoFile = URL.createObjectURL(event.data);  //recording된 video file url을 만들어서 기존 video자리 대체 
        video.src = videoFile;
        video.loop = true;
        video.play();        
    }
    recorder.start();//record start
}

const init = async() =>{
    stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true,}) //usermedia를 가져옴.
    video.srcObject = stream //template에 src가 없는 video를 만들어 놓고 이 함수에서 src 객체를 넣어줌.
    video.play();
}

init();

startBtn.addEventListener("click",handleStart)