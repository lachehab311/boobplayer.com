// تحميل ملف M3U محليًا
function loadM3U() {
    const fileInput = document.getElementById("m3uFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("يرجى اختيار ملف M3U.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        parseM3U(event.target.result);
    };
    reader.readAsText(file);
}

// تحميل قائمة M3U من رابط خارجي
function loadM3UFromURL() {
    const urlInput = document.getElementById("m3uURL").value.trim();

    if (!urlInput) {
        alert("يرجى إدخال رابط M3U صحيح.");
        return;
    }

    fetch(urlInput)
        .then(response => response.text())
        .then(data => parseM3U(data))
        .catch(error => alert("خطأ في تحميل الملف: " + error));
}

// تحليل ملف M3U وإضافة القنوات إلى القائمة
function parseM3U(data) {
    const lines = data.split("\n");
    const channelList = document.getElementById("channelList");
    channelList.innerHTML = '<option value="">اختر قناة...</option>';

    let lastChannelName = "";

    lines.forEach(line => {
        if (line.startsWith("#EXTINF")) {
            lastChannelName = line.split(",")[1]?.trim() || "قناة غير معروفة";
        } else if (line.startsWith("http") || line.startsWith("rtmp")) {
            const option = document.createElement("option");
            option.value = line.trim();
            option.textContent = lastChannelName;
            channelList.appendChild(option);
        }
    });
}

// تشغيل القناة المختارة
function playChannel() {
    const videoPlayer = document.getElementById("videoPlayer");
    const channelList = document.getElementById("channelList");
    const selectedURL = channelList.value;

    if (selectedURL) {
        videoPlayer.src = selectedURL;
        videoPlayer.play();
    }
}
