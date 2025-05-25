/**
 * @class AudioVisualizerController
 * @description Draws audio-reactive visuals using Web Audio API.
 */
class AudioVisualizerController {
    /**
     * @param {HTMLElement} container
     */
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = 0;
        this.canvas.style.left = 0;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = 999; // on top
        this.container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 128;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        console.log('AudioContext state:', this.audioCtx.state); // Verifica el estado del AudioContext

        // Connect Wallpaper Engine audio
        if (typeof wallpaperAudioListener !== 'undefined') {
            console.log('wallpaperAudioListener is defined:', wallpaperAudioListener);
            wallpaperAudioListener.connect(this.audioCtx, this.analyser);
            console.log('Connected to wallpaperAudioListener');
        } else {
            console.error('wallpaperAudioListener is UNDEFINED. Visualizer will not work.');
        }

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.analyser.getByteFrequencyData(this.dataArray);
        const { width, height } = this.canvas;
        const barWidth = width / this.dataArray.length;

        this.ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < this.dataArray.length; i++) {
            const barHeight = this.dataArray[i];
            this.ctx.fillStyle = `rgb(${barHeight + 100}, 100, 200)`;
            this.ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
        }
    }

    show() {
        this.canvas.style.display = "block";
    }

    hide() {
        this.canvas.style.display = "none";
    }
}
