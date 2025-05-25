const clockController = new ClockController();
const backgroundController = new BackgroundController();
var w, h, minW;
var can = document.querySelector("#can");
var ctx = can.getContext("2d");
var param = {
  style: 1,
  r: 0.45,
  color: "rgba(255,255,255,0.8)",
  blurColor: "#ffcccc",
  range: 9,
  shadowBlur: 15,
  lineWidth: 3,
  showCircle: true,
  wavetransparency: 0.8,
  rotation: 0,
  rotationcopy: 0,
  offsetAngle: 0,
  waveArr: new Array(128).fill(0), // ¡CORREGIDO! Inicializar con ceros
  cX: 0.5,
  cY: 0.3,
  showSemiCircle: false,
  SemiCircledirection: 1,
  Polygon: 36, // Nombre original
  // NUEVO: Asegúrate de que 'param.direction' tenga un valor inicial válido.
  direction: 1, // Por ejemplo, 1, 2 o 3. (Añadir esta línea)
  SolidColorGradient: true,
  BlurColorGradient: true,
  ColorRhythm: true,
  ColorMode: 1,
  TagNow: 1,
  GradientRate: 0.5
};

function resize() {
  can.width = w = window.innerWidth;
  can.height = h = window.innerHeight;
  minW = Math.min(w, h);
  ctx.lineWidth = param.lineWidth;
  ctx.shadowBlur = param.shadowBlur;
  rainRad = Math.sqrt((Math.pow((h), 2) + Math.pow((w), 2)));
  setCan();
}

// document.addEventListener('DOMContentLoaded', function() {
//   if (can) {
//     ctx = can.getContext("2d");
//
//     // ... (establecer w, h, can.width, can.height) ...
//
//     window.onresize = function() {
//       // ... (redimensionar w, h, can.width, can.height) ...
//       drawSimpleShape(); // <-- Se llama aquí para redibujar al cambiar el tamaño
//     };
//
//     drawSimpleShape(); // <-- ¡Esta es la llamada inicial para dibujar la forma por primera vez!
//
//     console.log("Canvas inicializado y forma dibujada. W:", w, "H:", h);
//   } else {
//     console.error("No se encontró el elemento canvas con id 'can'.");
//   }
// });
//
// function drawSimpleShape() {
//   if (!ctx) {
//     console.error("Contexto del canvas no disponible para dibujar.");
//     return;
//   }
//
//   // Limpiar el canvas antes de dibujar para evitar superposiciones
//   ctx.clearRect(0, 0, w, h);
//
//   // Dibujar un cuadrado rojo en el centro
//   ctx.fillStyle = "red"; // Establecer el color de relleno a rojo
//   var squareSize = 100;  // Tamaño del cuadrado en píxeles
//   var startX = (w / 2) - (squareSize / 2); // Posición X para centrar
//   var startY = (h / 2) - (squareSize / 2); // Posición Y para centrar
//
//   ctx.fillRect(startX, startY, squareSize, squareSize); // Dibujar el cuadrado
//
//   // Opcional: Dibujar un círculo azul
//   ctx.beginPath(); // Iniciar un nuevo trazado
//   ctx.arc(w / 4, h / 4, 50, 0, Math.PI * 2); // Centro (w/4, h/4), radio 50, círculo completo
//   ctx.fillStyle = "blue"; // Color de relleno azul
//   ctx.fill(); // Rellenar el círculo
//
//   console.log("Forma simple redibujada.");
// }

resize();
window.onresize = resize;

window.wallpaperPropertyListener = {
  applyUserProperties: function ({
    image,
    video,
    mute_video,
    video_volume,
    playback_rate,
    background_alignment,
    option_hour12,
    hour,
    minute,
    locale,
    weekday,
    top_position,
    left_position,
    clock_size_rem,
    clock_color,
    hide_clock,
    pwcircle_style,
    pwcircle_radius,
    pwcircle_range,
    pwcircle_color,
    pwcircle_blurColor,
    pwcircle_showCircle,
    pwcircle_lineWidth,
    pwcircle_transparency,
    PolygonAngle,
    circle_y,
  }) {
    if (image || video) {
      backgroundController.setImage(image?.value);
      backgroundController.setVideo(video?.value);

      backgroundController.setDesktopBackground();
    }

    if (mute_video) {
      backgroundController.muteVideo(mute_video.value);
    }

    if (video_volume) {
      backgroundController.setVideoVolume(video_volume.value);
    }

    if (playback_rate) {
      backgroundController.setVideoPlaybackRate(playback_rate.value);
    }

    if (background_alignment) {
      backgroundController.setAlignment(background_alignment.value);
    }

    if (option_hour12 || hour || minute || locale || weekday) {
      clockController.setOptionHour12(option_hour12?.value);
      clockController.setHour(hour?.value);
      clockController.setMinute(minute?.value);
      clockController.setLocale(locale?.value);
      clockController.setWeekday(weekday?.value);

      clockController.start();
    }

    if (top_position || left_position) {
      clockController.changeClockPosition(
        top_position?.value,
        left_position?.value
      );
    }

    if (clock_size_rem) {
      clockController.changeClockSize(clock_size_rem.value);
    }
    if(PolygonAngle){
      SetPolygonAngle(PolygonAngle.value);
    }

    if (clock_color) {
      clockController.color(clock_color.value);
    }

    if (circle_y){
      param.cY = circle_y.value / 100;
    }

    if (hide_clock) {
      clockController.hideClock(hide_clock.value);
    }
    if (pwcircle_style) {
      param.style = pwcircle_style.value;
    }
    if (pwcircle_radius) {
      param.r = pwcircle_radius.value / 100; // Asumiendo que viene de 0-100
    }
    if (pwcircle_range) {
      param.range = pwcircle_range.value / 5; // Ajustar a la escala de PWCircle.js
    }
    if (pwcircle_color) {
      // Convierte el color de "0 0 0" a "rgb(0,0,0)"
      const c = pwcircle_color.value.split(' ').map(val => Math.ceil(parseFloat(val) * 255));
      ctx.strokeStyle = param.color = `rgba(${c.join(',')},0.8)`;
    }
    if (pwcircle_blurColor) {
      const c = pwcircle_blurColor.value.split(' ').map(val => Math.ceil(parseFloat(val) * 255));
      ctx.shadowColor = param.blurColor = `rgb(${c.join(',')})`;
    }
    if (pwcircle_showCircle) {
      param.showCircle = pwcircle_showCircle.value;
    }
    if (pwcircle_lineWidth) {
      ctx.lineWidth = param.lineWidth = pwcircle_lineWidth.value;
    }
    if (pwcircle_transparency) {
      ctx.globalAlpha = param.wavetransparency = pwcircle_transparency.value / 100;
    }
    if (pwcircle_rotation) {
      param.rotation = pwcircle_rotation.value;
    }
    if (pwcircle_semicircle) {
      param.showSemiCircle = pwcircle_semicircle.value;
      if(param.showSemiCircle) {
        param.rotationcopy = param.rotation; // Guardar rotación para restaurar
        param.rotation = 0; // Desactivar rotación en modo semicírculo
        param.offsetAngle = 0;
      } else {
        param.rotation = param.rotationcopy; // Restaurar rotación
      }
    }
  },

  setPaused: async function (isPaused) {
    if (isPaused) {
      clockController.stop();
      backgroundController.pauseVideo();
    } else {
      clockController.start();
      await backgroundController.playVideo();
    }
  },
};

var SetPolygonAngle = function(mode){

  switch (mode){
    case 1:
      param.PolygonAngle = 1;
      param.Polygon = 295;
      break;
    case 2:
      param.PolygonAngle = 2;
      param.Polygon = 270;
      break;
    case 3:
      param.PolygonAngle = 4;
      param.Polygon = 245;
      break;
    case 4:
      param.PolygonAngle = 5;
      param.Polygon = 220;
      break;
    case 5:
      param.PolygonAngle = 7;
      param.Polygon = 195;
      break;
    case 6:
      param.PolygonAngle = 9;
      param.Polygon = 170;
      break;
    case 7:
      param.PolygonAngle = 10;
      param.Polygon = 145;
      break;
    case 8:
      param.PolygonAngle = 12;
      param.Polygon = 120;
      break;
    case 9:
      param.PolygonAngle = 30;
      param.Polygon = 95;
      break;
    case 10:
      param.PolygonAngle = 60;
      param.Polygon = 70;
      break;
    case 11:
      param.PolygonAngle = 90;
      param.Polygon = 45;
      break;
    case 12:
      param.PolygonAngle = 180;
      param.Polygon = 20;
      break;
    default:
  }

};

backgroundController.startMonitoring(5);