chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "NOW_PLAYING") return;

  fetch("http://127.0.0.1:49210/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg.payload)
  }).catch(err => console.error("Background fetch failed", err));
});
