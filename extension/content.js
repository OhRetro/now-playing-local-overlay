var lastTrack = null;

function updateTrack(track) {
  if (!chrome.runtime) return;

  chrome.runtime.sendMessage({
    type: "updateTrack",
    data: {
      track
    }
  })
}

function resetState() {
  if (!lastTrack) return;

  lastTrack = null;
  updateTrack(null);
}

setInterval(() => {
  const meta = navigator.mediaSession?.metadata;

  if (!meta) {
    if (lastTrack) resetState();
    return;
  }

  const metaPlaying = navigator.mediaSession?.playbackState === "playing"

  let currentTrack = {
    playing: metaPlaying,
    title: meta.title,
    artist: meta.artist,
    artwork: meta.artwork?.at(-1)?.src ?? ""
  }

  // let changed = (
  //   !lastTrack ||
  //   (
  //     currentTrack.playing !== lastTrack.playing ||
  //     currentTrack.title !== lastTrack.title ||
  //     currentTrack.artist !== lastTrack.artist
  //   )
  // )

  // if (!changed) return;

  lastTrack = { ...currentTrack };
  updateTrack(currentTrack);
}, 500);
