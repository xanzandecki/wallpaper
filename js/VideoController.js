/**
 * @class VideoController
 * @description This file contains the VideoController class, which is responsible for setting the desktop background video.
 * @version 1.0.0
 * @author Wesley Prado <wesleyprado.dev@gmail.com>
 * @date 2023-08-04
 */
class VideoController {
  /**
   * @param {HTMLElement} container
   * @private
   */
  #container;
  /**
   * @type {HTMLVideoElement}
   * @private
   */
  #videoContainer;
  /**
   * @type {HTMLSourceElement}
   * @private
   */
  #videoSource;

  constructor(container) {
    this.#container = container;
    this.#videoContainer = HTMLElementFactory.createVideoContainer();
    this.#videoSource = HTMLElementFactory.createVideoSource();

    this.#videoContainer.appendChild(this.#videoSource);
    this.#container.appendChild(this.#videoContainer);
  }

  /**
   * Sets the video source.
   * @param {string} src - The path to the video file.
   * @throws {Error} - If the video type is not supported.
   */
  setVideo(src) {
    try {
      const videoType = this.#getVideoType(src);

      this.#videoSource.src = src;
      this.#videoSource.type = videoType;
      this.#videoContainer.load();
    } catch (e) {
      console.error(e);
      return;
    }
  }

  #getVideoType(src) {
    const extension = src.split(".").pop();
    switch (extension) {
      case "ogv":
        return "video/ogv";
      case "webm":
        return "video/webm";
      case "ogg":
        return "video/ogg";
      case "mp4":
        return "video/mp4";
      default:
        throw new Error("Unsupported video type.");
    }
  }

  /**
   * Sets the video playback rate.
   * @param {number} rate - The playback rate.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate
   */
  setPlaybackRate(rate) {
    if (rate < 0 || rate > 16) {
      return;
    }

    this.#videoContainer.playbackRate = rate;
  }

  async play() {
    await this.#videoContainer.play();
  }

  pause() {
    this.#videoContainer.pause();
  }

  show() {
    this.#videoContainer.style.display = "block";
  }

  hide() {
    this.#videoContainer.style.display = "none";
  }

  /**
   * Mutes the video.
   * @param {boolean} mute - Whether the video should be muted or not.
   */
  mute(mute) {
    this.#videoContainer.muted = mute;
  }

  /**
   * Sets the video volume.
   * @param {number} volume - The volume value.
   * @throws {Error} - If the volume value is invalid.
   */
  volume(volume) {
    if (typeof volume !== "number") throw new Error("Invalid volume value.");

    const vol = volume / 100;

    if (vol < 0 || vol > 1) {
      throw new Error("Invalid volume value.");
    }
    this.#videoContainer.volume = vol;
  }

  setVideoAlignment(position = "center") {
    this.#videoContainer.className = position;
  }
}
