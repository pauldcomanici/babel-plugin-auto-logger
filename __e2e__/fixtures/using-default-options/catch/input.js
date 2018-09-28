try {
  const x = 'here I would have some code for try block';
} catch (ex) {

}

function hasTry() {
  try {
    const x = 'here I would have some code for try block';
  } catch (ex) {

  }
}

const myPromise = new Promise(() => {});

myPromise.catch(reason => {
  const x = 'here I would do something based on reason';
});