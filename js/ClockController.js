/**
 * @class ClockController
 * @description A class that represents a clock. It is responsible for displaying the current time and date.
 * @version 1.0.0
 * @author Wesley Prado <wesleyprado.dev@gmail.com>
 * @date 2023-08-04
 */
class ClockController {
  /**
   *@type {HTMLBodyElement}
   *@private
   */
  #documentBody;

  /**
   * @type {HTMLDivElement}
   * @private
   */
  #dateContainer;

  /**
   * @type {HTMLSpanElement}
   * @private
   */
  #weekdayElem;
  /**
   * The time element that displays the current time.
   * @type {HTMLElement}
   * @private
   */
  #timeElem;

  /**
   * The locale used to format the time and date.
   * @type {string}
   * @private
   */
  #locale;

  /**
   * The current weekday.
   * @type {number}
   * @private
   */
  #weekday;

  /**
   * The current hour.
   * @type {number}
   * @private
   */
  #hour;

  /**
   * The current minute.
   * @type {number}
   * @private
   */
  #minute;

  /**
   * Whether to use a 12-hour or 24-hour clock.
   * @type {boolean}
   * @private
   */
  #option_hour12;

  constructor() {
    this.#createClock();
    this.#setDefaultProperties();
  }

  #createClock() {
    this.#documentBody = document.body;
    this.#dateContainer = HTMLElementFactory.createDateContainer();
    this.#weekdayElem = HTMLElementFactory.createWeekdayElement();
    this.#timeElem = HTMLElementFactory.createTimeElement();

    this.#dateContainer.appendChild(this.#weekdayElem);
    this.#dateContainer.appendChild(this.#timeElem);
    this.#documentBody.appendChild(this.#dateContainer);
  }

  #setDefaultProperties() {
    this.#locale = "en-US";
    this.#weekday = "long";
    this.#hour = "numeric";
    this.#minute = "numeric";
    this.#option_hour12 = false;
  }

  /**
   * Sets the locale used to format the date and time.
   * @param {string} value - The locale used to format the date and time.
   */
  setLocale(value) {
    this.#locale = value ?? this.#locale;
  }

  /**
   * Sets the weekday format used to format the weekday.
   * @param {string} value - The weekday format used to format the weekday.
   */
  setWeekday(value) {
    this.#weekday = value ?? this.#weekday;
  }

  /**
   * Sets the hour format used to format the time.
   * @param {string} value - The hour format used to format the time.
   */
  setHour(value) {
    this.#hour = value ?? this.#hour;
  }

  /**
   * Sets the minute format used to format the time.
   * @param {string} value - The minute format used to format the time.
   */
  setMinute(value) {
    this.#minute = value ?? this.#minute;
  }

  /**
   * Sets whether the clock should use 12-hour format or not.
   * @param {boolean} value - Whether the clock should use 12-hour format or not.
   */
  setOptionHour12(value) {
    this.#option_hour12 = value ?? this.#option_hour12;
  }

  #update() {
    const date = new Date();
    const weekday = this.#getWeekday(date);
    const time = this.#getTime(date);

    if (this.#weekdayElem.innerHTML !== weekday)
      this.#weekdayElem.innerHTML = weekday;

    this.#timeElem.innerHTML = time;
  }

  #getWeekday(date) {
    return date.toLocaleString(this.#locale, {
      weekday: this.#weekday,
    });
  }

  #getTime(date) {
    return date.toLocaleString(this.#locale, {
      hour: this.#hour,
      minute: this.#minute,
      hour12: this.#option_hour12,
    });
  }

  start() {
    if (this.interval) clearInterval(this.interval);

    this.#update();
    this.interval = setInterval(() => this.#update(), 1000);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  /**
   * Changes the position of the clock container.
   * @param {number} top - The percentage value of the top position of the clock container.
   * @param {number} left - The percentage value of the left position of the clock container.
   */
  changeClockPosition(top, left) {
    if (top) this.#dateContainer.style.top = `${top}%`;
    if (left) this.#dateContainer.style.left = `${left}%`;
  }

  /**
   * Changes the size of the clock container.
   * @param {number} remSize - The new rem size of the clock container.
   */
  changeClockSize(remSize) {
    this.#saveOriginalFontSizeForReference();

    const weekdayFontSize = this.#calculateFontSize(
      this.originalWeekdayFontSize,
      remSize
    );
    this.#weekdayElem.style.fontSize = `${weekdayFontSize}rem`;

    const timeFontSize = this.#calculateFontSize(
      this.originalTimeFontSize,
      remSize
    );
    this.#timeElem.style.fontSize = `${timeFontSize}rem`;
  }

  #saveOriginalFontSizeForReference() {
    if (!this.originalWeekdayFontSize || !this.originalTimeFontSize) {
      const width = window.innerWidth;

      this.originalWeekdayFontSize =
        CLOCK_REM_SIZE_BY_SCREEN_WIDTH[width]?.weekday ??
        CLOCK_REM_SIZE_BY_SCREEN_WIDTH.default.weekday;

      this.originalTimeFontSize =
        CLOCK_REM_SIZE_BY_SCREEN_WIDTH[width]?.time ??
        CLOCK_REM_SIZE_BY_SCREEN_WIDTH.default.time;
    }
  }

  #calculateFontSize(originalFontSize = 0, remSize = 0) {
    return originalFontSize + remSize;
  }

  /**
   * Changes the color of the clock container.
   * @param {string} color - The new color of the clock container. from 0 to 1.
   * @example
   * "0 0 0" // black
   * "1 1 1" // white
   * "0.5 0 0.5" // purple
   * @see https://docs.wallpaperengine.io/en/web/customization/properties.html#color-property
   */
  color(color = "0 0 0") {
    const hex = this.#convertColorToHex(color);
    this.#applyHexColor(hex);
  }

  #applyHexColor(hex) {
    this.#weekdayElem.style.color = hex;
    this.#timeElem.style.color = hex;

    const textShadow = `${DEFAULT__CLOCK_TEXT_SHADOW_OFFSET} ${hex}`;
    this.#weekdayElem.style.textShadow = textShadow;
    this.#timeElem.style.textShadow = textShadow;
  }

  #getRGBColor(color = "0 0 0") {
    const colorArr = color.split(" ");

    return colorArr.map(function (c) {
      return Math.ceil(c * 255);
    });
  }

  #convertColorToHex(color) {
    const [r, g, b] = this.#getRGBColor(color);

    const hex = ((r << 16) | (g << 8) | b).toString(16);

    return "#" + hex.padStart(6, "0");
  }

  hideClock(hide = false) {
    this.#dateContainer.style.display = hide ? "none" : "flex";
  }
}
