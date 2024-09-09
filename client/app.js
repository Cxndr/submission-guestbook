import 'simplebar';
import 'simplebar/dist/simplebar.css';
import ResizeObserver from 'resize-observer-polyfill';
import SimpleBar from 'simplebar';
window.ResizeObserver = ResizeObserver;
let initialPageLoad = true;

const serverURL = "http://localhost:8080";

let userName = "Anon";
let userColour = "#FFFFFF";
let likedMessages = [];

function getLocalStorage() {
    if (localStorage.getItem("userName")) {
        userName = localStorage.getItem("userName");
        document.getElementById('user-edit-name').value = userName;
    }
    if (localStorage.getItem("userColour")) {
        userColour = localStorage.getItem("userColour");
        document.getElementById('user-edit-colour').value = userColour;
    }
    if (localStorage.getItem("likedMessages")) {
        likedMessages = JSON.parse(localStorage.getItem("likedMessages"));
    }
}
function setLocalStorage() {
    localStorage.setItem("userName", userName);
    localStorage.setItem("userColour", userColour);
    localStorage.setItem("likedMessages", JSON.stringify(likedMessages));
}
function clearLocalStorage() {
    localStorage.clear();
}

const chatBox = document.getElementById('chat');
const chatBoxWrapper = document.getElementById('chat-wrapper');
const chatInput = document.getElementById('chat-input');
const chatMsgBox = document.getElementById('chat-input-text');
const chatSubmitButton = document.getElementById('chat-input-submit');

function clearChat() {
    chatBox.innerHTML = "";
}

async function getChat() {
    const response = await fetch(serverURL + "/msg");
    const chatMessages = await response.json();

    clearChat();
    await chatMessages.forEach( (msg) => {
        const chatMsgDiv = document.createElement('div');
        chatMsgDiv.classList.add("chat-msg");
        chatMsgDiv.dataset.user = msg.username;
        // add dataset.mentioned for @ mention system?

        const chatMsgUser = document.createElement('span');
        chatMsgUser.classList.add('chat-user');
        chatMsgUser.textContent = msg.username;
        chatMsgUser.style.color = msg.user_colour;
        chatMsgDiv.appendChild(chatMsgUser);

        const chatMsgContent = document.createElement('span');
        chatMsgContent.classList.add('chat-text');
        chatMsgContent.textContent = msg.msg_content;
        chatMsgDiv.appendChild(chatMsgContent);
        
        const chatMsgLike = document.createElement('button');
        chatMsgLike.classList.add('chat-button');
        chatMsgLike.classList.add('chat-like-button');
        chatMsgLike.dataset.toggled = likedMessages.includes(msg.id);
        chatMsgLike.textContent = "👍 " + msg.likes;
        chatMsgLike.addEventListener('click',function(event) {
            let bool;
            if (likedMessages.includes(msg.id)) {
                bool = false;
                likedMessages.splice(likedMessages.indexOf(msg.id),1);
            }
            else {
                bool = true;
                likedMessages.push(msg.id);
            }
            updateLikes(event, msg.id, bool)
        });
        if (msg.likes < 1) {
            chatMsgLike.classList.add("hidden");
        }
        chatMsgDiv.appendChild(chatMsgLike);

        const chatMsgDelete = document.createElement('button');
        chatMsgDelete.classList.add('chat-button');
        chatMsgDelete.classList.add('chat-delete-button');
        chatMsgDelete.textContent = "🗑️";
        chatMsgDelete.addEventListener('click',function(event) {
            deleteChatMsg(event,msg.id);
        });
        chatMsgDelete.classList.add('hidden');
        chatMsgDiv.appendChild(chatMsgDelete);

        const chatMsgTime = document.createElement('time');
        const timestamp = new Date(msg.msg_timestamp).toLocaleString('en-GB');
        console.log(timestamp);
        chatMsgTime.classList.add("time");
        chatMsgTime.title = timestamp;
        chatMsgTime.textContent = timestamp;
        chatMsgDiv.appendChild(chatMsgTime);

        chatMsgDiv.addEventListener('mouseover', function() {
            chatMsgLike.classList.remove("hidden");
            chatMsgDelete.classList.remove("hidden");
            chatMsgTime.classList.add("text-highlight")
        })
        chatMsgDiv.addEventListener('mouseleave', function() {
            if (msg.likes < 1) {
                chatMsgLike.classList.add("hidden");
            }
            chatMsgDelete.classList.add("hidden");
            chatMsgTime.classList.remove("text-highlight");
        })
        chatBox.appendChild(chatMsgDiv);
    });
    
    if (initialPageLoad) {
        chatScrollToBot();
        initialPageLoad = false;
    }
}

function chatScrollToBot() {
    const simpleBar = new SimpleBar(document.getElementById('chat-wrapper'))
    const simplebarWrapper = simpleBar.getScrollElement();
    simplebarWrapper.scrollTop = simplebarWrapper.scrollHeight;
};

async function updateLikes(event, id, bool) {
    event.preventDefault();
    const data = {};
    data.bool = bool;
    const response = await fetch(serverURL + `/msg/like/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    const responseData = await response.json();
    console.log("Server response: ", responseData);
    getChat();
    event.target.dataset.toggled = true;
    setLocalStorage();
};

async function deleteChatMsg(event,id) {
    event.preventDefault();
    const response = await fetch(serverURL + `/msg/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const responseData = await response.json();
    console.log("Server response: ", responseData);
    getChat();
}

async function submitChatMsg(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.username = userName;
    data.user_colour = userColour;

    const response = await fetch(serverURL + "/msg", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    const responseData = await response.json();

    console.log("Server response: ", responseData);
    chatMsgBox.value="";
    chatSubmitButton.disabled = true;
    chatMsgBox.focus();
    await getChat();
    chatScrollToBot();
}
chatInput.addEventListener('submit', submitChatMsg);

chatMsgBox.addEventListener('input', (event) => {
    console.log("rofiqhoihfoqih");
    if (chatMsgBox.checkValidity()) {
        chatSubmitButton.disabled = false;
    }
    else {
        chatSubmitButton.disabled = true;
    }
    
});


const userEditForm = document.getElementById('user-edit');
const userEditButton = document.getElementById('user-edit-button');

function userEditDisplay() {
    userEditButton.style.opacity = 0;

    userEditForm.style.visibility = "visible";
    setTimeout( () => {
        userEditButton.style.visibility = "hidden";
        userEditForm.style.opacity = 1;
    }, 350);
}
function userEditDisplayRevert() {
    userEditForm.style.opacity = 0;
    userEditButton.style.visibility = "visible";
    setTimeout( () => {
        userEditButton.style.opacity = 1;
        userEditForm.style.visibility = "hidden";
    }, 350);
}
userEditButton.addEventListener('click', userEditDisplay);

function submitUserEdit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    userName = formData.get("user-edit-name");
    userColour = formData.get("user-edit-colour");
    setLocalStorage();
    userEditDisplayRevert()
}
userEditForm.addEventListener('submit', submitUserEdit);

function cancelUserEdit(event) {
    event.preventDefault();
    getLocalStorage();
    userEditDisplayRevert()
}
userEditForm.addEventListener('reset', cancelUserEdit);


// run
getLocalStorage();
getChat();
//setInterval(()=> getChat(), 500);

