import 'simplebar';
import 'simplebar/dist/simplebar.css';
import ResizeObserver from 'resize-observer-polyfill';
import SimpleBar from 'simplebar';
window.ResizeObserver = ResizeObserver;
let initialPageLoad = true;

const serverURL = "http://localhost:8080";

let userName = "Anon";
let userColour = "#FFFFFF";

function getLocalStorage() {
    if (localStorage.getItem("userName")) {
        userName = localStorage.getItem("userName");
        document.getElementById('user-edit-name').value = userName;
    }
    if (localStorage.getItem("userColour")) {
        userColour = localStorage.getItem("userColour");
        document.getElementById('user-edit-colour').value = userColour;
    }
}
function setLocalStorage() {
    localStorage.setItem("userName", userName);
    localStorage.setItem("userColour", userColour);
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
        

        const chatMsgTime = document.createElement('time');
        chatMsgTime.classList.add("time");
        chatMsgTime.title = msg.msg_timestamp; // convert these to correct format later
        chatMsgTime.textContent = msg.msg_timestamp;
        chatMsgDiv.appendChild(chatMsgTime);

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

