const videoContainer = document.getElementById("videoContainer"); 
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".deleteBtn");

const addComment = (text, id) =>{
    const videoComments = document.querySelector(".video_comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video_comment" 
    newComment.dataset.id = id; 
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
    event.preventDefault(); 
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text === ""){
        return; 
    }

    const response = await fetch(`/api/videos/${videoId}/comment`,{   
        method: "POST", 
        headers:{ 
            "Content-Type": "application/json", 
        },
        body: 
        JSON.stringify({text}), 
    })
    if(response.status === 201 ){ 
        textarea.value = ""; 
        const { newCommentId } = await response.json(); 
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

if(form){ 
    form.addEventListener("submit", handleSubmit);
}

if(deleteBtn){
    deleteBtn.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", handleDelete);
    })
} 