
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "updateTrack") {
    fetch("http://127.0.0.1:49210/updateTrack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: request.track ? JSON.stringify(request.track) : null
    }).catch(err => console.error("Background update failed", err));
  }
});
