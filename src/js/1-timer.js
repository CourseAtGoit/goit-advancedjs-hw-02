import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  daysField: document.querySelector('[data-days]'),
  hoursField: document.querySelector('[data-hours]'),
  minutesField: document.querySelector('[data-minutes]'),
  secondsField: document.querySelector('[data-seconds]'),
};

let userSelectedDate;

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const addLeadingZero = value => {
  const stringValue = value.toString();
  if (stringValue.length < 2) {
    return stringValue.padStart(2, '0');
  }
  return value;
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= Date.now()) {
      refs.startBtn.setAttribute('disabled', true);
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        progressBarColor: '#b51b1b',
        backgroundColor: '#ef4040',
        titleColor: '#ffffff',
        messageColor: '#ffffff',
        iconUrl: './img/error.svg',
      });
    } else {
      refs.startBtn.removeAttribute('disabled');
      userSelectedDate = selectedDates[0];
    }
  },
};

const timer = {
  intervalId: null,
  start() {
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const timeDifference = userSelectedDate - currentTime;
      if (timeDifference <= 0) {
        clearInterval(this.intervalId);
        refs.input.removeAttribute('disabled');
        return;
      }
      const { days, hours, minutes, seconds } = convertMs(timeDifference);
      refs.daysField.textContent = addLeadingZero(days);
      refs.hoursField.textContent = addLeadingZero(hours);
      refs.minutesField.textContent = addLeadingZero(minutes);
      refs.secondsField.textContent = addLeadingZero(seconds);
    }, 1000);
  },
};

flatpickr('#datetime-picker', options);

refs.startBtn.addEventListener('click', () => {
  timer.start();
  refs.startBtn.setAttribute('disabled', true);
  refs.input.setAttribute('disabled', true);
});
