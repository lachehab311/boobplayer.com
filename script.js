let currentPlaylist = [];

// Load M3U Playlist
function loadPlaylist() {
  const fileInput = document.getElementById('iptvPlaylist');
  const file = fileInput.files[0];
  if (!file) {
    alert('من فضلك اختر ملف M3U');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    currentPlaylist = parseM3U(event.target.result);
    displayChannels(currentPlaylist);
  };
  reader.readAsText(file);
}

// Parse M3U Playlist
function parseM3U(data) {
  const lines = data.split('\n');
  const channels = [];
  let channelName = '';
  let channelUrl = '';
  lines.forEach(line => {
    if (line.startsWith('#EXTINF:')) {
      const match = line.match(/,(.*)/);
      if (match) {
        channelName = match[1].trim();
      }
    }
    if (!line.startsWith('#') && line.trim()) {
      channelUrl = line.trim();
      if (channelName && channelUrl) {
        channels.push({ name: channelName, url: channelUrl });
        channelName = '';
        channelUrl = '';
      }
    }
  });
  return channels;
}

// Display Channels
function displayChannels(channels) {
  const channelsContainer = document.getElementById('channelsList');
  channelsContainer.innerHTML = '';
  if (channels.length === 0) {
    channelsContainer.innerHTML = '<p>لا توجد قنوات لعرضها</p>';
  }
  channels.forEach(channel => {
    const channelElement = document.createElement('div');
    channelElement.classList.add('channel');
    channelElement.innerHTML = `
      <button class="channel-button" onclick="playChannel('${channel.url}')">${channel.name}</button>
    `;
    channelsContainer.appendChild(channelElement);
  });
}

// Play Channel
function playChannel(url) {
  const videoSource = document.getElementById('videoSource');
  videoSource.src = url;
  const videoPlayer = document.getElementById('my-video');
  videoPlayer.load();
  videoPlayer.play();
}
