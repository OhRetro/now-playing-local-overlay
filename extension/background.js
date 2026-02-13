const SOURCE_PRIORITY = [
  // Top = high priority
  "applemusic",
  "spotify",
  "soundcloud",
  "ytmusic"
]

var currentTrack;
var extensionClient;

function detectSource(origin) {
  origin = origin.replace(/^(https?:\/\/)/, "")

  switch (origin) {
    case "music.youtube.com": return "ytmusic";
    case "soundcloud.com": return "soundcloud";
    case "music.apple.com": return "applemusic";
    case "open.spotify.com": return "spotify";
  }

  return origin;
}

function sourcePriority(source) {
  const index = SOURCE_PRIORITY.indexOf(source);
  return index === -1 ? Infinity : index;
}

function shouldReplaceCurrentTrack(newTrack) {
  if (!currentTrack) return true;
  else if (!newTrack) return true;
  else if (currentTrack.source === newTrack.source) return (
    currentTrack.playing !== newTrack.playing ||
    currentTrack.title !== newTrack.title ||
    currentTrack.artist !== newTrack.artist
  );
  else if (newTrack.playing && !currentTrack.playing) return true;
  else if (!newTrack.playing && currentTrack.playing) return false;

  return sourcePriority(newTrack.source) < sourcePriority(currentTrack.source);
}

function updateTrack(track) {
  extensionClient.send(JSON.stringify({
    type: "updateTrack",
    data: {
      track: track ?? null
    }
  }));
}

function connectExtensionClient() {
  extensionClient = new WebSocket("ws://127.0.0.1:49210/extensionClient");

  extensionClient.onopen = () => setTimeout(() => updateTrack(currentTrack), 1000);
  extensionClient.onclose = () => setTimeout(connectExtensionClient, 1000);
}

chrome.runtime.onMessage.addListener((message, sender) => {
  switch (message.type) {
    case "updateTrack":
      const newTrack = {
        ...message.data.track,
        source: detectSource(sender.origin)
      }

      if (!shouldReplaceCurrentTrack(newTrack)) return;

      currentTrack = newTrack

      if (extensionClient?.readyState === WebSocket.OPEN) updateTrack(newTrack);
      break;
  }
});

connectExtensionClient();

setInterval(() => {
  if (extensionClient?.readyState === WebSocket.OPEN) {
    extensionClient.send(JSON.stringify({ type: "ping" }));
  }
}, 20000);
