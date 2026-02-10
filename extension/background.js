chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "NOW_PLAYING_LOCAL_OVERLAY") return;

  fetch("http://127.0.0.1:49210/updateTrack", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg.payload)
  }).catch(err => console.error("Background update failed", err));
});
