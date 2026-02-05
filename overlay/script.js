const trackElement = document.getElementById("track");
const titleElement = document.getElementById("title");
const artistElement = document.getElementById("artist");
const artElement = document.getElementById("art");

var socket;
var lastId = "";
var pendingTimeout = null;

function connectToServer() {
    socket = new WebSocket("ws://127.0.0.1:49210/ws");

    socket.onopen = () => {
        console.log("Connected to Local Server");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (!data.playing) {
            trackElement.classList.remove("visible");
            lastId = "";

            if (pendingTimeout) {
                clearTimeout(pendingTimeout);
                pendingTimeout = null;
            }

            return;
        }

        const id = `${data.title}-${data.artist}`;

        if (id !== lastId) {
            trackElement.classList.remove("visible");
            lastId = id;

            if (pendingTimeout) {
                clearTimeout(pendingTimeout);
                pendingTimeout = null;
            }

            setTimeout(() => {
                titleElement.textContent = data.title;
                artistElement.textContent = data.artist;
                artElement.src = data.artwork;
                trackElement.classList.add("visible");
            }, 300);
        }
    };

    socket.onclose = () => {
        console.warn("Disconnected, retrying...");
        pendingTimeout = setTimeout(connectToServer, 1000);
    };
}

connectToServer();