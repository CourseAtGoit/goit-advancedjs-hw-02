import iziToast from 'izitoast';

const ref = {
  form: document.querySelector('.form'),
};

const toastOptions = {
  icon: false,
  position: 'topRight',
};

const makePromise = (delay, state) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve({ message: `✅ Fulfilled promise in ${delay}ms` });
      } else {
        reject({ message: `❌ Rejected promise in ${delay}ms` });
      }
    }, delay);
  });
};

const handleSubmit = event => {
  event.preventDefault();
  const {
    elements: { delay, state },
  } = event.currentTarget;
  const delayValue = Number(delay.value);
  const stateValue = state.value;

  makePromise(delayValue, stateValue)
    .then(({ message }) => {
      iziToast.success({
        ...toastOptions,
        message: message,
      });
    })
    .catch(({ message }) => {
      iziToast.error({
        ...toastOptions,
        message: message,
      });
    });
  ref.form.reset();
};

ref.form.addEventListener('submit', handleSubmit);
