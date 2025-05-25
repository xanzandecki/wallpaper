const $weekday = document.getElementById("date__weekday");
const $time = document.getElementById("date__time");

const parameters = {
  weekdayElem: $weekday,
  timeElem: $time,
  locale: "en-US",
  option_hour12: false,
  hour: "numeric",
  minute: "numeric",
  weekday: "long",
};

window.wallpaperPropertyListener = {
  applyUserProperties: function ({
    option_hour12,
    hour,
    minute,
    locale,
    weekday,
  }) {
    if (option_hour12) parameters.option_hour12 = option_hour12.value;
    if (hour) parameters.hour = hour.value;
    if (minute) parameters.minute = minute.value;
    if (locale) parameters.locale = locale.value;
    if (weekday) parameters.weekday = weekday.value;
  },
};

function updateDatetime({
  weekdayElem,
  timeElem,
  locale,
  weekday,
  hour,
  minute,
  option_hour12,
}) {
  const date = new Date();
  const localeWeekday = date.toLocaleString(locale, {
    weekday,
  });
  const time = date.toLocaleString(locale, {
    hour,
    minute,
    hour12: option_hour12,
  });

  if (weekdayElem.innerHTML !== localeWeekday)
    weekdayElem.innerHTML = localeWeekday;
  timeElem.innerHTML = time;
}

updateDatetime(parameters);
setInterval(() => updateDatetime(parameters), 1000);
