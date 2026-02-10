from better_profanity import profanity
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import List

profanity.load_censor_words()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

clients: List[WebSocket] = []
current_track = { "playing": False }

@app.get("/")
async def root():
    return {
        "status": "ok",
        "current_track": current_track
    }
    
@app.websocket("/receiveTrack")
async def receive_track(ws: WebSocket):
    await ws.accept()
    clients.append(ws)

    if current_track:
        await ws.send_json(current_track)

    try:
        while True:
            await ws.receive_text()
    except:
        clients.remove(ws)


@app.post("/updateTrack")
async def update_track(data: dict):
    global current_track
    
    data = data.copy()

    if "title" in data:
        data["title"] = profanity.censor(data["title"])

    if "artist" in data:
        data["artist"] = profanity.censor(data["artist"])

    if data == current_track:
        return
    
    current_track = data

    print("UPDATE RECEIVED:", data)

    for ws in clients[:]:
        try:
            await ws.send_json(data)
        except:
            clients.remove(ws)

    return {"status": "ok"}
