import logging
from better_profanity import profanity
from json import dumps as json_dumps
from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict


logger = logging.getLogger("uvicorn")

profanity.load_censor_words()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

extension_client: WebSocket | None = None
overlay_clients: List[WebSocket] = []
current_track = None


def update_track(data: Dict | None) -> bool:
    global current_track

    if data is not None:
        data = data.copy()

        if "title" in data:
            data["title"] = profanity.censor(
                data["title"])

        if "artist" in data:
            data["artist"] = profanity.censor(
                data["artist"])

    if data == current_track:
        return False

    current_track = data
    logger.info(f"UPDATE RECEIVED: {json_dumps(data, indent=4)}")

    return True


@app.websocket("/overlayClient")
async def overlay_client_websocket(ws: WebSocket):
    await ws.accept()
    overlay_clients.append(ws)

    if current_track:
        await ws.send_json(current_track)

    try:
        while True:
            await ws.receive_text()
    except:
        overlay_clients.remove(ws)


@app.websocket("/extensionClient")
async def extension_client_websocket(ws: WebSocket):
    global extension_client

    if extension_client is not None:
        await ws.close(code=1008)
        return

    await ws.accept()
    extension_client = ws

    nothingDict = {}

    try:
        while True:
            message: Dict = await ws.receive_json()
            data: Dict = message.get("data", nothingDict)

            match message.get("type"):
                case "ping":
                    continue

                case "updateTrack":
                    newTrack = data.get("track")

                    updated = update_track(newTrack)

                    if not updated:
                        continue

                    for overlay_client in overlay_clients[:]:
                        try:
                            await overlay_client.send_json(newTrack)
                        except:
                            overlay_clients.remove(overlay_client)

    except:
        extension_client = None

app.mount("/overlay", StaticFiles(directory="overlay", html=True), name="overlay")
