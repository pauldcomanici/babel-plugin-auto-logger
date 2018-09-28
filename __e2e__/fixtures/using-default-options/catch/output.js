try {
  const x = 'here I would have some code for try block';
} catch (ex) {
  console.error("[using-default-options/catch/input.js:3:13]", "catchClause", ex);
}

function hasTry() {
  console.log("[using-default-options/catch/input.js:7:18]", "hasTry");

  try {
    const x = 'here I would have some code for try block';
  } catch (ex) {
    console.error("[using-default-options/catch/input.js:10:15]", "catchClause", ex);
  }
}

const myPromise = new Promise(() => {
  console.log("[using-default-options/catch/input.js:15:36]", "array-item-0");
});
myPromise.catch(reason => {
  console.error("[using-default-options/catch/input.js:17:26]", "memberExpressionCatch", reason);
  const x = 'here I would do something based on reason';
});
