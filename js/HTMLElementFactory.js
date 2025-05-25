/**
 * @class HTMLElementFactory
 * @description This class is responsible for creating HTML elements.
 * @version 1.0.0
 * @author Wesley Prado <wesleyprado.dev@gmail.com>
 * @date 2023-08-04
 */
class HTMLElementFactory {
  /**
   * Creates a video container element.
   * @returns {HTMLVideoElement} The video container element.
   * @static
   */
  static createVideoContainer() {
    const videoContainer = document.createElement("video");
    videoContainer.id = "video__container";
    videoContainer.autoplay = true;
    videoContainer.loop = true;
    videoContainer.muted = true;

    return videoContainer;
  }

  /**
   * Creates a video source element.
   * @returns {HTMLSourceElement} The video source element.
   * @static
   */
  static createVideoSource() {
    const videoSource = document.createElement("source");
    videoSource.id = "video__source";
    videoSource.type = "video/webm";

    return videoSource;
  }

  /**
   * Creates an image container element.
   * @returns {HTMLImageElement} The image container element.
   * @static
   */
  static createImageContainer() {
    const imageContainer = document.createElement("img");
    imageContainer.id = "image__container";
    imageContainer.className = "center";

    return imageContainer;
  }

  /**
   * Creates a date container element.
   * @returns {HTMLDivElement} The date container element.
   * @static
   */
  static createDateContainer() {
    const dateContainer = document.createElement("div");
    dateContainer.id = "date__container";

    return dateContainer;
  }

  /**
   * Creates a weekday element.
   * @returns {HTMLSpanElement} The weekday element.
   * @static
   */
  static createWeekdayElement() {
    const weekdayElement = document.createElement("span");
    weekdayElement.id = "date__weekday";

    return weekdayElement;
  }

  /**
   * Creates a time element.
   * @returns {HTMLSpanElement} The time element.
   * @static
   */
  static createTimeElement() {
    const timeElement = document.createElement("span");
    timeElement.id = "date__time";

    return timeElement;
  }
}
