import data from './properties.json' assert {type: 'json'};

console.log(data)
data.innerText = JSON.stringify(data, null, 2);
let jsonData = JSON.parse(data.innerText)
const url = jsonData.parentUrl
const chatUrl = jsonData.chatUrl
const ameliaUrl = jsonData.ameliaUrl
const originUrl = jsonData.originUrl

document.addEventListener("load", createFrame());

document.getElementById('chatOverlayInputSubmit').addEventListener('click', function () {
    let iframeElem = document.getElementById('receiver');
    iframeElem.contentWindow.postMessage({
        'actionType': 'ameliaSay',
        'actionData': 'Hi there'
    }, chatUrl);
    console.log('Message posted')
});

document.getElementById('chatOverlayInputSubmit2').addEventListener('click', function () {
    let iframeElem = document.getElementById('receiver');
    iframeElem.contentWindow.postMessage({
        'actionType': 'ameliaBpn',
        'actionName': 'multi-select',
        'actionData': {
            'message': 'Test',
            'submission': {
                'shouldEcho': false
            }
        }
    }, chatUrl);
    console.log('Multi-select BPN action')
});

function createFrame() {
    console.log('Creating Frame')
    let x = document.createElement("iframe");
    x.setAttribute("id", "parentFrame");
    x.setAttribute("src", url);
    x.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:99;");
    document.body.appendChild(x);
}

function openChatOverlay(receiverElem, imgElemOpen, imgElemClose) {
    console.log('Opening chat overlay')
    document.getElementById('receiver').classList.add("open");
    document.getElementById('receiver').classList.remove("close");
    document.getElementsByClassName('chat-overlay')[0].classList.add("chat-overlay-open");
    document.getElementsByClassName('chat-overlay')[0].classList.remove("chat-overlay-closed");
    document.getElementsByClassName('chat-overlay-header-mobile')[0].classList.remove('close');
    imgElemClose.style.opacity = 1;
    imgElemOpen.style.opacity = 0;
    localStorage.setItem('chatOverlayOpen', true);
    document.getElementById('receiver').src = chatUrl
}

function closeChatOverlay(receiverElem, imgElemOpen, imgElemClose) {
    console.log('Closing chat overlay')
    document.getElementById('receiver').classList.add("close");
    document.getElementById('receiver').classList.remove("open");
    document.getElementsByClassName('chat-overlay')[0].classList.add("chat-overlay-closed");
    document.getElementsByClassName('chat-overlay')[0].classList.remove("chat-overlay-open");
    document.getElementsByClassName('chat-overlay-header-mobile')[0].classList.add('close');
    imgElemOpen.style.opacity = 1;
    imgElemClose.style.opacity = 0;
    localStorage.setItem('chatOverlayOpen', false);
    document.getElementById('receiver').src = chatUrl
}

function loadiFrame(url) {
    let x = document.createElement("IFRAME");
    x.setAttribute("src", url);
    x.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:99;");
    document.body.appendChild(x);
}

function toggleChatOverlay() {
    /**
     * Toggles opening and closing of the chatOverlay
     * @returns - no return
     */
    console.log('Chat overlay toggled')
    let chatOverlayHeaderImgElemOpen = document.getElementsByClassName('chat-overlay-header-img open')[0];
    let chatOverlayHeaderImgElemClose = document.getElementsByClassName('chat-overlay-header-img close')[0];
    let receiverElem = document.getElementById('receiver');
    if (receiverElem.classList.contains('close')) {
        openChatOverlay(receiverElem, chatOverlayHeaderImgElemOpen, chatOverlayHeaderImgElemClose);
    } else {
        closeChatOverlay(receiverElem, chatOverlayHeaderImgElemOpen, chatOverlayHeaderImgElemClose);
    }
}

function receiveMessage(e, data) {
    console.log('Received message ' + e.data.action)
    let action = e.data.action
    // if (e.origin !== originUrl)
    //     console.log('Hit return in receiveMesage')
    //     return;
    let actionUrl = jsonData.actions[action].url;
    loadiFrame(actionUrl);
    console.log('Sent URL to chat frame')
}

function sendMessage(data) {
    /**
     * Use data object and postMessage to URL provided (postMessage to child frame)
     * @param {Object} data - data to be sent to url provided of child frame
     * @returns - no return
     */
    console.log('Sending message')
    let receiverElem = document.getElementById('receiver').contentWindow;
    receiverElem.postMessage(data, ameliaUrl);
}

let chatOverlayHeaderElem = document.getElementsByClassName('chat-overlay-header')[0];
chatOverlayHeaderElem.addEventListener('click', toggleChatOverlay);
let chatOverlayHeaderElemMobile = document.getElementsByClassName('chat-overlay-header-mobile')[0];
chatOverlayHeaderElemMobile.addEventListener('click', toggleChatOverlay);

if (typeof (Storage) !== "undefined") {
    let chatOverlayOpen = localStorage.getItem('chatOverlayOpen');
    let chatOverlayDefaultStateClosed = true;
    let chatOverlayHeaderImgElemOpen = document.getElementsByClassName('chat-overlay-header-img open')[0];
    let chatOverlayHeaderImgElemClose = document.getElementsByClassName('chat-overlay-header-img close')[0];
    let receiverElem = document.getElementById('receiver');
    if (chatOverlayOpen && localStorage.getItem('chatOverlayOpen') !== "true") {
        console.log('Closing overlay');
        closeChatOverlay(receiverElem, chatOverlayHeaderImgElemOpen, chatOverlayHeaderImgElemClose);
    } else {
        console.log('Opening overlay');
        openChatOverlay(receiverElem, chatOverlayHeaderImgElemOpen, chatOverlayHeaderImgElemClose);
    }
} else {
    console.log('No localStorage support')
}

document.querySelector('iframe#receiver').onload = function () {
    console.log('this iframe', this);
    console.log('frame content', this.contentWindow);
};

window.addEventListener("message", (event) => {
    console.log('im in beginning of event', event.origin);
    if (event.origin !== ameliaUrl)
        return;

    console.log('event', event);
}, false);

window.addEventListener('message', receiveMessage);