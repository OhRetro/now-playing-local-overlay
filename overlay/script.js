const trackEl = document.getElementById("track");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const artEl = document.getElementById("art");

let socket;
let lastId = "";

function connect() {
    socket = new WebSocket("ws://127.0.0.1:49210/ws");

    socket.onopen = () => {
        console.log("[overlay] connected");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (!data.playing) {
            trackEl.classList.remove("visible");
            return;
        }

        const id = `${data.title}-${data.artist}`;
        let isVisible = trackEl.classList.contains("visible");
        if (id !== lastId || (id === lastId && data.playing && !isVisible)) {
            if (isVisible) trackEl.classList.remove("visible");

            titleEl.textContent = data.title;
            artistEl.textContent = data.artist;
            artEl.src = data.artwork;
            lastId = id;

            setTimeout(() => {
                trackEl.classList.add("visible");
            }, 250);
        }
    };

    socket.onclose = () => {
        console.warn("[overlay] disconnected, retrying...");
        setTimeout(connect, 1000);
    };
}

connect();