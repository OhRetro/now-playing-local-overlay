var lastPayload = null;

function resetState() {
  if (!lastPayload) return;

  lastPayload = null;

  chrome.runtime.sendMessage({
    type: "NOW_PLAYING_LOCAL_OVERLAY",
    payload: { playing: false }
  })
}

window.addEventListener("unload", resetState);

setInterval(() => {
  const video = document.querySelector("video");
  const meta = navigator.mediaSession?.metadata;

  if (!video || !meta) {
    if (lastPayload) resetState();

    return;
  }

  let payload = {
    playing: !video.paused,
    title: meta.title,
    artist: meta.artist,
    artwork: meta.artwork?.[0]?.src ?? ""
  }

  if (
    !lastPayload ||
    (
      payload.playing !== lastPayload.playing ||
      payload.title !== lastPayload.title ||
      payload.artist !== lastPayload.artist
    )
  ) {
    lastPayload = { ...payload };
  } else {
    return;
  }

  chrome.runtime.sendMessage({
    type: "NOW_PLAYING_LOCAL_OVERLAY",
    payload: payload
  });
}, 100);
