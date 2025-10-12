// Бібліотека для того щоб вибрати кінцеву дату і час
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// Бібліотека для відображення повідомлень користувачеві
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const btnStart = document.querySelector('[data-start]');
const btnStop = document.querySelector('[data-stop]');
const timer = document.querySelector('.timer');
let pickedDays = timer.querySelector('[data-days]');
let pickedHours = timer.querySelector('[data-hours]');
let pickedMinutes = timer.querySelector('[data-minutes]');
let pickedSeconds = timer.querySelector('[data-seconds]');

btnStart.addEventListener('click', handlerStart);
btnStop.addEventListener('click', handlerStop);

btnStart.disabled = true;
btnStop.disabled = true;
let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= new Date()) {
      iziToast.show({
        title: 'Please choose a date in the future',
        backgroundColor: '#ef4040',
        messageColor: '#fff',
        titleColor: '#fff',
        position: 'topRight',
      });
      btnStart.disabled = true;
    } else {
      btnStart.disabled = false;
    }
  },
};
flatpickr(input, options);

function handlerStart() {
  btnStart.disabled = true;
  input.disabled = true;
  btnStop.disabled = false;

  timerId = setInterval(() => {
    const now = Date.now();
    const difference = userSelectedDate - now;

    if (difference <= 0) {
      clearInterval(timerId);
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }

    const time = convertMs(difference);
    updateTimerUI(time);
  }, 1000);
}

function handlerStop() {
  input.disabled = false;
  btnStop.disabled = true;

  clearInterval(timerId);

  input.addEventListener('click', handlerClick);
}

function handlerClick() {
  updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerUI({ days, hours, minutes, seconds }) {
  pickedDays.textContent = addZero(days);
  pickedHours.textContent = addZero(hours);
  pickedMinutes.textContent = addZero(minutes);
  pickedSeconds.textContent = addZero(seconds);
}
