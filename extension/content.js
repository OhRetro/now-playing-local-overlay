var lastTrack = null;

function detectPlaying() {
  switch (window.location.hostname) {
    case "music.apple.com":
      const appleMusicButton = document.querySelector(
        "button.playback-play__play[aria-hidden=\"true\"]"
      );
      return appleMusicButton ? true : false;

    case "open.spotify.com":
      const spotifyButton = document.querySelector(
        "button[data-testid=\"control-button-playpause\"]"
      );

      if (!spotifyButton) return false;

      const spotifyButtonLabel = spotifyButton.getAttribute("aria-label")?.toLowerCase();
      return spotifyButtonLabel?.includes("pause");

    default:
      return navigator.mediaSession?.playbackState === "playing";
  }
}

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

  let currentTrack = {
    playing: detectPlaying(),
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
