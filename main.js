// التهيئة العامة
const APP_CONFIG = {
    SECRET_KEY: 'your-256-bit-secret',
    ALLOWED_DOMAINS: ['trusted-cdn.com'],
    DEFAULT_QUALITY: 'auto'
};

class Player {
    constructor() {
        this.currentChannel = 0;
        this.favorites = this.loadEncryptedData('favorites') || [];
        this.language = localStorage.getItem('language') || 'ar';
        this.initPlayer();
        this.initServiceWorker();
    }

    initPlayer() {
        this.video = document.getElementById('mainPlayer');
        this.setupEventListeners();
        this.applyLanguage();
    }

    setupEventListeners() {
        this.video.addEventListener('error', (e) => this.handlePlayerError(e));
        this.video.addEventListener('waiting', () => this.showLoader());
        this.video.addEventListener('playing', () => this.hideLoader());
    }

    async playStream(url) {
        if (!this.validateStream(url)) {
            this.showError('invalid_source');
            return;
        }

        try {
            if (url.includes('.m3u8')) {
                this.playHLS(url);
            } else if (url.includes('.mpd')) {
                this.playDASH(url);
            } else {
                this.video.src = url;
            }
            await this.video.play();
        } catch (error) {
            this.handlePlayerError(error);
        }
    }

    playHLS(url) {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(this.video);
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            this.video.src = url;
        }
    }

    playDASH(url) {
        const dash = dashjs.MediaPlayer().create();
        dash.initialize(this.video, url, true);
    }
}

// الفئات المساعدة
class SecurityManager {
    static validateStream(url) {
        try {
            const urlObj = new URL(url);
            return APP_CONFIG.ALLOWED_DOMAINS.includes(urlObj.hostname);
        } catch {
            return false;
        }
    }

    static encryptData(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), APP_CONFIG.SECRET_KEY).toString();
    }

    static decryptData(ciphertext) {
        const bytes = CryptoJS.AES.decrypt(ciphertext, APP_CONFIG.SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
}

class EPGParser {
    static async loadEPG() {
        try {
            const response = await fetch('data/epg.xml');
            const xml = await response.text();
            return this.parseXML(xml);
        } catch (error) {
            console.error('EPG Error:', error);
        }
    }

    static parseXML(xml) {
        // تنفيذ تحليل XML هنا
    }
}

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    window.player = new Player();
    window.notifier = new Notifier();
    initProgressiveLoading();
    loadEPG();
    registerServiceWorker();
});
