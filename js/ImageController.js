/**
 * @class ImageController
 * @description This file contains the ImageController class, which is responsible for setting the desktop background image.
 * @version 1.0.0
 * @author Wesley Prado <wesleyprado.dev@gmail.com>
 * @date 2023-08-04
 */

class ImageController {
  /**
   * @param {HTMLElement} container
   * @private
   */
  #container;

  /**
   * @type {HTMLImageElement}
   * @private
   */
  #imageContainer;

  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this.#container = container;

    this.#imageContainer = HTMLElementFactory.createImageContainer();

    this.#container.appendChild(this.#imageContainer);
  }

  /**
   * Sets the image source.
   * @param {string} src - The path to the image file.
   */
  setImage(src) {
    try {
      const imageType = this.#getImageType(src);

      this.#imageContainer.src = src;
      this.#imageContainer.type = imageType;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  /**
   * Sets the image positioning.
   * @param {string} position - The image positioning css class.
   */
  setImageAlignment(position = "center") {
    this.#imageContainer.className = position;
  }

  #getImageType(src) {
    const extension = src.split(".").pop();
    switch (extension) {
      case "jpeg":
      case "jpg":
        return "image/jpeg";
      case "png":
      case "pnga":
        return "image/png";
      case "bmp":
        return "image/bmp";
      case "gif":
        return "image/gif";
      case "svg":
        return "image/svg+xml";
      case "webp":
        return "image/webp";
      default:
        throw new Error("Unsupported image type.");
    }
  }

  show() {
    this.#imageContainer.style.display = "block";
  }

  hide() {
    this.#imageContainer.style.display = "none";
  }
}
