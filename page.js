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
    let selector = document.querySelector("#tempiFrame")
    if (selector !== null){
        console.log("found it")
        selector.parentNode.removeChild(selector);

    }
    else{
        console.log("did not find it")
        document.querySelector("#parentFrame").style.opacity = 0;
    }
    let x = document.createElement("IFRAME");
    x.setAttribute("src", url);
    x.setAttribute("id", "tempiFrame");
    x.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:99;");
    document.body.appendChild(x);
}

function loadImage(img) {
    let x = document.createElement("img");
    x.setAttribute("src", img);
    x.setAttribute("style", "margin:0; padding:0; display: grid; height: 100%; z-index: 99; position: fixed; top: 0px; left: 0px");
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

function getElementByXpath(path) {
  console.log('In getElementByXPath')
  console.log(document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function receiveMessage(e, data) {
    console.log('Received message ' + e.data.action);
    let action = e.data.action;
    // if (e.origin !== originUrl)
    //     console.log('Hit return in receiveMesage')
    //     return;
    if (action.includes("nav")) {
        console.log("Loading navigation element");
        let actionUrl = jsonData.actions[action].url;
        loadiFrame(actionUrl);
        console.log('Sent URL to chat frame');
    }
    else if (action.includes("img")) {
        console.log("Inserting image");
        let actionUrl = jsonData.actions[action].url;
        loadImage(actionUrl);
        console.log('Sent image');
    }
    else if (action.includes("insert")) {
        console.log("Inserting element");
//         console.log(document.querySelectorAll('*[id]'))
//         var text = document.getElementById('email');
        var targetPath = '/html/body/div[1]/div/div/div[2]/div/article/div/form/div[1]/div/input';
        var target = getElementByXpath(targetPath);
        console.log(target);
        target.value += 'derrick@steele.com';
    }
    else {
        console.log("No action found");
    }
}

function sendMessage(data) {
    /**
     * Use data object and postMessage to URL provided (postMessage to child frame)
     * @param {Object} data - data to be sent to url provided of child frame
     * @returns - no return
     */
    console.log('Sending message')
    let receiverElem = document.getElementById('receiver').contentWindow;
    //receiverElem.postMessage(data, ameliaUrl);
    window.location.replace(ameliaUrl)
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
