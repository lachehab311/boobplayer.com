document.getElementById('fileInput').addEventListener('change', handleFile);
const videoPlayer = document.getElementById('videoPlayer');
const channelList = document.getElementById('channelList');

function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        parseM3U(e.target.result);
    };
    reader.readAsText(file);
}

function parseM3U(content) {
    channelList.innerHTML = "";
    const lines = content.split("\n");
    let channels = [];

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#EXTINF")) {
            let name = lines[i].split(",")[1] || "قناة غير معروفة";
            let url = lines[i + 1] ? lines[i + 1].trim() : null;
            if (url) channels.push({ name, url });
        }
    }

    channels.forEach(channel => {
        let li = document.createElement("li");
        li.textContent = channel.name;
        li.onclick = () => playChannel(channel.url);
        channelList.appendChild(li);
    });
}

function playChannel(url) {
    videoPlayer.src = url;
    videoPlayer.play();
}
