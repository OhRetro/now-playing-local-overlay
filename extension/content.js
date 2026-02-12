var lastTrack = null;

function resetState() {
  if (!lastTrack) return;

  lastTrack = null;

  chrome.runtime.sendMessage({
    type: "updateTrack",
    track: null
  })
}

setInterval(() => {
  const meta = navigator.mediaSession?.metadata;

  if (!meta) {
    if (lastTrack) resetState();
    return;
  }

  const metaPlaying = navigator.mediaSession?.playbackState === "playing"

  let track = {
    playing: metaPlaying,
    title: meta.title,
    artist: meta.artist,
    artwork: meta.artwork?.at(-1)?.src ?? ""
  }

  let changed = (
    !lastTrack ||
    (
      track.playing !== lastTrack.playing ||
      track.title !== lastTrack.title ||
      track.artist !== lastTrack.artist
    )
  )

  if (!changed) return;

  lastTrack = { ...track };

  chrome.runtime.sendMessage({
    type: "updateTrack",
    track: track
  });
}, 500);
