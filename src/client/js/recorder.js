import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordBtn = document.getElementById("recordBtn");
const videoBox = document.getElementById('videoBox');
const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = { //오타 방지를 위한 string을 위한 객체 생성.
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
}

const downloadFile = (fileUrl, fileName) =>{
    const a = document.createElement("a"); //a tag 생성.
    a.href = fileUrl; //a의 link 주소는 fileUrl
    a.download = fileName //download 이름과 파일 형식까지 지정
    document.body.appendChild(a);
    a.click();// 이 함수가 호출되면 자동으로 a태그가 click됨.
}

const handleDownload = async () =>{
    actionBtn.removeEventListener("click", handleDownload); //download btn 클릭시 이 함수가 또 호출되는 것을 막음.
    actionBtn.innerText = "Transcoding...";
    actionBtn.disabled = true; //transcoding 하는 동안은 btn 사용 못함.

    //ffmpeg의 File System에서 작동한다고 생각하면됨.
    const ffmpeg = createFFmpeg({ log: true,  }); //ffmpeg 실행 과정을 console에 loging 해줄것이다.
    await ffmpeg.load(); //ffmpeg는 외부의 sw이므로 load하는것을 기다려 주어야함.

    ffmpeg.FS("writeFile", files.input , await fetchFile(videoFile)); //ffmpeg fileSystem의 메모리에 우리가 만들어 놓은 videoFile의 url을 가지고 recording.webm이라는 file write

    await ffmpeg.run("-i", files.input, "-r", "60", files.output) //ffmpeg 가상 세계에서 recording.webm파일을 input하고 60프레임으로 output.mp4파일로 변환시켜줌.
    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb) //영상의 1초대로 가서 1장의 이미지를 thumbnail로 추출하는 코드.

    const mp4File = ffmpeg.FS("readFile", files.output); //output.mp4로 변환된 비디오 읽어오기.
    const thumbFile = ffmpeg.FS("readFile", files.thumb); //thumbnail.jpg 읽어오기

    const mp4Blob = new Blob([mp4File.buffer], {type: "video/mp4"}); //mp4File은 숫자로만 된 row data임. 이것을 buffer를 사용하여 우리가 사용할 수 있는 data로 바꿔줌.
    const thumbBlob = new Blob([thumbFile.buffer], {type: "image/jpg"});

    const mp4URL = URL.createObjectURL(mp4Blob); //mp4URL 생성
    const thumbURL = URL.createObjectURL(thumbBlob);

    downloadFile(mp4URL, "Recorded Video.mp4");
    downloadFile(thumbURL, "Thumbnail.jpg");

    //브라우저의 속도향상을 위해 다운로드 완료 후엔 video 와 thumbnail에 관련된 file, URL 모두 삭제.
    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);

    URL.revokeObjectURL(videoFile);
    URL.revokeObjectURL(mp4URL);
    URL.revokeObjectURL(thumbURL);

    actionBtn.disabled = false;
    actionBtn.innerText = "Record Again?";
    actionBtn.addEventListener("click", handleStart) //click 시 처음부터 다시 record 가능하게 해줌
}
/*
const handleStop = () =>{
    actionBtn.innerText = "Downloading the Video"
    actionBtn.removeEventListener("click", handleStop);
    actionBtn.addEventListener("click", handleDownload);

    recorder.stop(); //record stop
}
*/
const handleStart = () => {
    actionBtn.innerText = "Recording..."
    actionBtn.disabled = true; //recording 하는 동안엔 disable
    actionBtn.removeEventListener("click", handleStart);

    recorder = new MediaRecorder(stream); //stream의 정보를 녹화하기 위해 인자로 넣음.
    recorder.ondataavailable = (event) =>{
        console.log(event.data);
        video.srcObject = null; //기존의 video자리의 srcObj 를 지움.
        videoFile = URL.createObjectURL(event.data);  //recording된 video file url을 만들어서 기존 video자리 대체 
        video.src = videoFile;
        video.loop = true;
        video.play();      
        actionBtn.innerText="Download";
        actionBtn.disabled=false;
        actionBtn.addEventListener("click", handleDownload);  
    }
    recorder.start();//record start
    setTimeout(()=>{
        recorder.stop();
    }, 5000)
}

const showRecordBox = async() =>{
    stream = await navigator.mediaDevices.getUserMedia({audio: false, video: {width: 1024, height: 576},}) //usermedia를 가져옴.
    video.srcObject = stream //template에 src가 없는 video를 만들어 놓고 이 함수에서 src 객체를 넣어줌.
    video.play();
}

const handleRecord = () =>{
    showRecordBox();
    videoBox.classList.remove("hide")
    videoBox.classList.add("upload_video")
    actionBtn.classList.add("social_btn")

    recordBtn.classList.remove("record_btn")
    recordBtn.classList.add("hide")
}

recordBtn.addEventListener("click", handleRecord)
actionBtn.addEventListener("click",handleStart)