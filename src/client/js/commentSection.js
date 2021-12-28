const videoContainer = document.getElementById("videoContainer"); //video_dataset_id를 가져오기위함
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".deleteBtn");

const addComment = (text, id) =>{
    const videoComments = document.querySelector(".video_comments ul");
    const newComment = document.createElement("li"); //js에서 만들 comment tag
    newComment.className = "video_comment" //pug template에서 comment형식과 똑같이 만들어줌.
    newComment.dataset.id = id; //새로운 comment에 바로 id 적용.
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement('span');
    span.innerText = ` ${text}`;
    const span2 = document.createElement('span');
    span2.className = "deleteBtn"
    span2.innerText = `❌`;
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
    span2.addEventListener("click", handleDelete);
}

const handleSubmit =  async (event) =>{
    event.preventDefault(); //submit되어 default로 새로고침 되는것 막음.
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;//해당 video의 정보 가져옴.
    if(text === ""){
        return; //text내용이 없을땐, 동작x
    }
    //backend로 text 정보 fetch
    const response = await fetch(`/api/videos/${videoId}/comment`,{   
        method: "POST", //req의 방법
        headers:{ //req의 세부 사항
            "Content-Type": "application/json", //req로 가는 정보가 json형식이라는 것을 알려줌.
        },
        body: //req의 실질적 내용. 
        JSON.stringify({text}), //text를 string화 해서 보내줌. 그러나 header에서 이 요청은 json정보라는 것을 알려주므로 backend에서 이해가능
    })
    if(response.status === 201 ){ //comment가 backend에 갔다가 돌아오면
        textarea.value = ""; //comment 작성 후 textarea 비워주기.
        const { newCommentId } = await response.json(); //backend에서의 newcommentid 가져옴.
        addComment(text, newCommentId);
    }
}

const handleDelete = async (event) =>{
    const videoId  = videoContainer.dataset.id;
    const li = event.target.parentElement;
    const commentId = li.dataset.id;
    const response = await fetch(`/api/comments/${commentId}`,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({videoId}),
    })

    if(response.status === 200 ){
        li.remove();
    }
}

if(form){ //login돼있다면 form이 보일거임. 그럴때만 event실행
    form.addEventListener("submit", handleSubmit);
}

if(deleteBtn){// deleteBtn이 보인다면
    deleteBtn.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", handleDelete);
    })
} 