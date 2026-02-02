setInterval(() => {
  const video = document.querySelector("video");
  const meta = navigator.mediaSession?.metadata;

  if (!video || !meta) return;

  chrome.runtime.sendMessage({
    type: "NOW_PLAYING",
    payload: {
      playing: !video.paused,
      title: meta.title,
      artist: meta.artist,
      artwork: meta.artwork?.[0]?.src ?? ""
    }
  });
}, 250);
