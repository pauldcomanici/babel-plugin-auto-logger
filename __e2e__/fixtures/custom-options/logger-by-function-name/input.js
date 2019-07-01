function sum(a, b) {

  try {
    const myPromise = new Promise(() => {});

    myPromise.catch((reason) => {
      const rejectHandler = 'some implementation for sum';
    })
  } catch (ex) {
    const catchBlock = 'demo purpose for sum';
  }

  return a + b;
}

function sub(a, b) {

  try {
    const myPromise = new Promise(() => {});

    myPromise.catch((reason) => {
      const rejectHandler = 'some implementation for sub';
    })
  } catch (ex) {
    const catchBlock = 'demo purpose for sub';
  }

  return a - b;
}

function multiply(a, b) {

  try {
    const myPromise = new Promise(() => {});

    myPromise.catch((reason) => {
      const rejectHandler = 'some implementation for multiply';
    })
  } catch (ex) {
    const catchBlock = 'demo purpose for multiply';
  }

  return a * b;
}

function division(a, b) {

  try {
    const myPromise = new Promise(() => {});

    myPromise.catch((reason) => {
      const rejectHandler = 'some implementation for division';
    })
  } catch (ex) {
    const catchBlock = 'demo purpose for division';
  }

  return a / b;
}
