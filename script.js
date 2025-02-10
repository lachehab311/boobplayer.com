document.addEventListener('DOMContentLoaded', function () {
    // Function to refresh CAPTCHA (you can replace with your actual CAPTCHA API)
    function refreshCaptcha() {
        const captchaInput = document.getElementById('captcha');
        captchaInput.value = ''; // Clear the input field for the new CAPTCHA
        // Here you would usually fetch a new CAPTCHA image or string from your server
        alert('New CAPTCHA generated');
    }

    // Attach the click event listener to the "Refresh Captcha" button
    const refreshButton = document.querySelector('.refresh-captcha');
    refreshButton.addEventListener('click', refreshCaptcha);

    // Basic form validation before submission
    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        const macInput = document.getElementById('mac');
        const deviceKeyInput = document.getElementById('device-key');
        const captchaInput = document.getElementById('captcha');

        // Check if all required fields are filled
        if (macInput.value.trim() === '' || deviceKeyInput.value.trim() === '' || captchaInput.value.trim() === '') {
            e.preventDefault(); // Prevent form submission
            alert('Please fill in all required fields.');
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
  const videoPlayer = document.getElementById('my-video');
  const channelsContainer = document.getElementById('channelsList');
  const m3uUrl = "https://iptv-org.github.io/iptv/index.m3u"; // رابط M3U للقنوات

  // جلب ملف M3U
  fetch(m3uUrl)
    .then(response => response.text())
    .then(data => {
      // تحليل البيانات من M3U وعرض القنوات
      const channels = parseM3U(data);
      displayChannels(channels);
    })
    .catch(err => console.error('Error fetching M3U file:', err));

  // دالة لتحليل محتوى M3U واستخراج بيانات القناة
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

  // دالة لعرض القنوات على الصفحة
  function displayChannels(channels) {
    channels.forEach(channel => {
      const channelElement = document.createElement('div');
      channelElement.classList.add('channel');
      channelElement.innerHTML = `
        <button class="channel-button" onclick="loadChannel('${channel.url}')">${channel.name}</button>
      `;
      channelsContainer.appendChild(channelElement);
    });
  }

  // دالة لتحميل القناة في مشغل الفيديو
  window.loadChannel = function (url) {
    const videoSource = document.getElementById('videoSource');
    videoSource.src = url;
    videoPlayer.load(); // تحميل المصدر الجديد
    videoPlayer.play(); // تشغيل القناة
  };
});
