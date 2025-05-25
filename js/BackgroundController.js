/**
 * @class BackgroundController
 * @description A class that represents the desktop background. It is responsible for displaying the background image or video.
 * @version 1.0.0
 * @author Wesley Prado <wesleyprado.dev@gmail.com>
 * @date 2023-08-04
 */
const ASSETS_FOLDER = './assets/';
const VIDEO_CHOICES_BY_HOUR = {
  // Dia (08:00 - 20:59)
  day: [1, 2, 3],
  // Noche (21:00 - 07:59)
  night: [1, 4],
};
const API_KEY_OPENWEATHERMAP = '7b95f8efd5faa299e8c0cf3074831c0d';

function getRandomElementFromArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function getHourlyVideoPath() {
  const now = new Date();
  const currentHour = now.getHours();

  let videoChoices;

  if (currentHour >= 0 && currentHour < 8) {
    videoChoices = VIDEO_CHOICES_BY_HOUR.night;
  } else if (currentHour >= 8 && currentHour < 21) {
    videoChoices = VIDEO_CHOICES_BY_HOUR.day;
  } else { // 21:00 - 23:59
    videoChoices = VIDEO_CHOICES_BY_HOUR.night;
  }

  if (!videoChoices || videoChoices.length === 0) {
    console.warn("No se encontraron opciones de video para la hora actual. Usando videos por defecto.");
    videoChoices = VIDEO_CHOICES_BY_HOUR.default;
  }

  const selectedVideoNumber = getRandomElementFromArray(videoChoices);

  if (selectedVideoNumber === null) {
    console.error("No se pudo seleccionar un video aleatorio. Fallback a video por defecto.");
    return `${ASSETS_FOLDER}1.webm`;
  }

  return `${ASSETS_FOLDER}${selectedVideoNumber}.webm`;
}

function getCurrentHourRangeKey(hour) {
  if (hour >= 0 && hour < 8) {
    return 'night';
  } else if (hour >= 8 && hour < 21) {
    return 'day';
  } else {
    return 'night';
  }
}

class BackgroundController {
  /**
   * @type {string}
   * @private
   */
  #documentBody;

  /**
   * @type {VideoController}
   * @private
   */
  #videoController;

  /**
   * @type {ImageController}
   * @private
   */
  #imageController;

  /**
   * @type {string}
   * @private
   */
  #image;

  /**
   * @type {string}
   * @private
   */
  #video;

  /**
   * @type {string | null}
   * @private
   */
  #lastKnownHourRangeKey = null; // Para el monitoreo horario

  constructor() {
    this.#documentBody = document.body;
    this.#imageController = new ImageController(this.#documentBody);
    this.#videoController = new VideoController(this.#documentBody);
    this.checkAndSetHourlyWallpaper = this.checkAndSetHourlyWallpaper.bind(this);
  }

  /**
   * Sets the image and video properties.
   * @param {string} src - The path to the image file.
   */
  setImage(src) {
    this.#image = src ?? this.#image;
  }

  /**
   * Sets the image and video properties.
   * @param {string} src - The path to the image file.
   */
  setVideo(src) {
    this.#video = src ?? this.#video;

    if (!this.#video) {
      this.#videoController.pause();
    }
  }
  

  setDesktopBackground() {
    if (!!this.#video) {
      this.setVideoWallpaper(this.#fixFilePath(this.#video));
    } else if (!!this.#image) {
      this.setImageWallpaper(this.#fixFilePath(this.#image));
    } else {
      const now = new Date();
      const currentHour = now.getHours();
      const randomVideoPath = getHourlyVideoPath();
      this.#lastKnownHourRangeKey = getCurrentHourRangeKey(currentHour);
      console.log("Set wallpaper " + randomVideoPath);
      this.setVideoWallpaper(randomVideoPath); // Ya está "arreglada" la ruta si getRandomVideoPath devuelve la ruta completa
      // this.#setVideoWallpaper(this.#fixFilePath(randomVideoPath)); // Si #fixFilePath hace algo más que concatenar la ruta base
    }
  }

  #fixFilePath(filePath) {
    const decodedPath = decodeURIComponent(filePath);
    const fixedPath = decodedPath.replace(/\//g, "\\");

    return `file:///${fixedPath}`;
  }

  setVideoWallpaper(src) {
    // console.log(this.#videoController);
    this.#videoController.setVideo(src);
    this.#videoController.show();
    this.#videoController.play();

    this.#imageController.hide();
  }

  setImageWallpaper(src) {
    this.#imageController.setImage(src);
    this.#imageController.show();

    this.#videoController.hide();
  }

  /**
   * Sets the video playback rate.
   * @param {number} rate - The playback rate.
   */
  setVideoPlaybackRate(rate) {
    this.#videoController.setPlaybackRate(rate);
  }

  async playVideo() {
    await this.#videoController.play();
  }

  pauseVideo() {
    this.#videoController.pause();
  }

  /**
   * Sets the image alignment.
   * @param {string} position - The image alignment.
   */
  setAlignment(position) {
    this.#setImageAlignment(position);
    this.#setVideoAlignment(position);
  }

  #setImageAlignment(position) {
    this.#imageController.setImageAlignment(position);
  }

  #setVideoAlignment(position) {
    this.#videoController.setVideoAlignment(position);
  }

  muteVideo(mute) {
    this.#videoController.mute(mute);
  }

  setVideoVolume(volume) {
    this.#videoController.volume(volume);
  }
  
  checkAndSetHourlyWallpaper() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentHourRangeKey = getCurrentHourRangeKey(currentHour);
    console.log("Checking hour " + currentHourRangeKey);

    if (currentHourRangeKey !== this.#lastKnownHourRangeKey) {
      console.log(`Franja horaria ha cambiado de ${this.#lastKnownHourRangeKey} a ${currentHourRangeKey}. Cambiando fondo...`);
      const newVideoPath = getHourlyVideoPath();
      this.setDesktopBackground(newVideoPath); // Llama a setDesktopBackground con el path ya decidido
      this.#lastKnownHourRangeKey = currentHourRangeKey; // Actualiza la última franja conocida
    } else {
      // console.log(`La franja horaria sigue siendo ${currentHourRangeKey}. No hay cambio de fondo necesario.`);
    }
  }

  /**
   * Starts monitoring the time to change the wallpaper periodically.
   * @param {number} [checkIntervalMinutes=5] - The interval in minutes to check the time.
   */
  startMonitoring(checkIntervalMinutes = 5) {
    this.#lastKnownHourRangeKey = getCurrentHourRangeKey(new Date().getHours()); // Inicializa la clave de rango
    console.log("Monitoreo de wallpaper iniciado para la franja: " + this.#lastKnownHourRangeKey);

    const checkIntervalMilliseconds = checkIntervalMinutes * 60 * 1000;
    setInterval(this.checkAndSetHourlyWallpaper, checkIntervalMilliseconds);
  }
}


