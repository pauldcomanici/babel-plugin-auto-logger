function sum(a, b) {

  try {
    const myPromise = new Promise(() => {});

    myPromise.catch((reason) => {
      const rejectHandler = 'some implementation';
    })
  } catch (ex) {
    const catchBlock = 'demo purpose';
  }

  return a + b;
}