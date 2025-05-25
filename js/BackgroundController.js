/**
 * @class BackgroundController
 * @description A class that represents the desktop background. It is responsible for displaying the background image or video.
 * @version 1.0.0
 * @author Wesley Prado <wesleyprado.dev@gmail.com>
 * @date 2023-08-04
 */
const VIDEO_CHOICES_BY_TIME_AND_WEATHER = {
  day: {
    clear: [3, 4, 10, 20], // Ej: Día soleado
    clouds: [1, 4, 11, 14, 19], // Ej: Día nublado
    rain: [1, 9, 15, 17],   // Ej: Día lluvioso
    snow: [9],   // Ej: Día lluvioso
    default: [1, 2, 3], // Día por defecto si el clima no coincide
  },
  night: {
    clear: [4, 5, 7, 13, 21], // Ej: Noche despejada
    clouds: [5, 14, 18, 21], // Ej: Noche nublada
    rain: [6, 8, 12, 16, 18],   // Ej: Noche lluviosa
    snow: [21],   // Ej: Día lluvioso
    default: [4, 5, 6], // Noche por defecto si el clima no coincide
  },
};
const ASSETS_FOLDER = './assets/';
const API_KEY_OPENWEATHERMAP = '7b95f8efd5faa299e8c0cf3074831c0d';

async function getWeather() {
  const latitude = 39.4667; // Latitud de Torrent, Spain
  const longitude = -0.4667; // Longitud de Torrent, Spain
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY_OPENWEATHERMAP}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener datos del clima:", error);
    return null;
  }
}

function getWeatherCategory(weatherData) {
  if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
    return 'default';
  }

  const weatherMain = weatherData.weather[0].main.toLowerCase();

  if (weatherMain === 'clear') {
    return 'clear';
  } else if (weatherMain === 'clouds') {
    return 'clouds';
  } else if (weatherMain === 'rain' || weatherMain === 'drizzle' || weatherMain === 'thunderstorm') {
    return 'rain';
  } else if (weatherMain === 'snow') {
    return 'snow'; // Puedes añadir una categoría para nieve si tienes videos
  } else {
    // Si no coincide con las categorías principales, puede ser default o puedes añadir más
    return 'default';
  }
}

function getRandomElementFromArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
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

async function getCombinedWallpaperPath() {
  const now = new Date();
  const currentHour = now.getHours();
  const hourRangeKey = getCurrentHourRangeKey(currentHour);

  let videoChoices;
  let weatherCategory = 'default'; // Por defecto

  const weatherData = await getWeather();
  if (weatherData) {
    weatherCategory = getWeatherCategory(weatherData);
    console.log(`Clima detectado: ${weatherCategory}`);
  } else {
    console.warn("No se pudo obtener datos del clima. Usando categoría de clima por defecto.");
  }

  // Intentar obtener videos para la combinación específica (ej. day.clear)
  if (VIDEO_CHOICES_BY_TIME_AND_WEATHER[hourRangeKey] && VIDEO_CHOICES_BY_TIME_AND_WEATHER[hourRangeKey][weatherCategory]) {
    videoChoices = VIDEO_CHOICES_BY_TIME_AND_WEATHER[hourRangeKey][weatherCategory];
    console.log(`Seleccionando video para: ${hourRangeKey} - ${weatherCategory}`);
  } else {
    // Si no hay una combinación específica, usar los videos por defecto de la franja horaria
    console.warn(`No se encontraron videos para la combinación ${hourRangeKey} - ${weatherCategory}. Usando videos por defecto para ${hourRangeKey}.`);
    videoChoices = VIDEO_CHOICES_BY_TIME_AND_WEATHER[hourRangeKey]?.default;
  }

  // Si aún no hay videos, usar un fallback general
  if (!videoChoices || videoChoices.length === 0) {
    console.error("No se encontraron opciones de video. Usando un video de fallback general.");
    return `${ASSETS_FOLDER}1.webm`; // Video de fallback general
  }

  const selectedVideoNumber = getRandomElementFromArray(videoChoices);

  if (selectedVideoNumber === null) {
    console.error("No se pudo seleccionar un video aleatorio de las opciones disponibles. Fallback a video por defecto.");
    return `${ASSETS_FOLDER}1.webm`;
  }

  return `${ASSETS_FOLDER}${selectedVideoNumber}.webm`;
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
  #lastKnownWallpaperPath = null; // Para monitorear si el video realmente ha cambiado

  constructor() {
    this.#documentBody = document.body;
    this.#imageController = new ImageController(this.#documentBody);
    this.#videoController = new VideoController(this.#documentBody);
    this.checkAndSetWallpaper = this.checkAndSetWallpaper.bind(this);
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
  
  async setDesktopBackground() {
    if (!!this.#video) {
      this.setVideoWallpaper(this.#fixFilePath(this.#video));
    } else if (!!this.#image) {
      this.setImageWallpaper(this.#fixFilePath(this.#image));
    } else {
      const newVideoPath = await getCombinedWallpaperPath(); // Llama a la nueva función combinada

      if (this.#lastKnownWallpaperPath !== newVideoPath) {
        console.log("Cambiando fondo a: " + newVideoPath);
        this.setVideoWallpaper(newVideoPath);
        this.#lastKnownWallpaperPath = newVideoPath;
      } else {
        // console.log("El fondo sigue siendo el mismo. No hay cambio necesario.");
      }
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
  
  async checkAndSetWallpaper() {
    console.log("Comprobando hora y clima para el fondo de pantalla...");
    await this.setDesktopBackground(); // Llama a la función asíncrona principal
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


