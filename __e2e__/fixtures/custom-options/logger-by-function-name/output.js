import myLogger from "path/to/file";

function sum(a, b) {
  myLogger.myDebug("[custom-options/logger-by-function-name/input.js:1:19]", "sum");

  try {
    const myPromise = new Promise(() => {});
    myPromise.catch(reason => {
      myLogger.myError("[custom-options/logger-by-function-name/input.js:6:32]", "memberExpressionCatch", reason);
      const rejectHandler = 'some implementation for sum';
    });
  } catch (ex) {
    myLogger.myError("[custom-options/logger-by-function-name/input.js:9:15]", "catchClause", ex);
    const catchBlock = 'demo purpose for sum';
  }

  return a + b;
}

function sub(a, b) {
  myLogger.myInfo("[custom-options/logger-by-function-name/input.js:16:19]", "sub");

  try {
    const myPromise = new Promise(() => {});
    myPromise.catch(reason => {
      myLogger.myError("[custom-options/logger-by-function-name/input.js:21:32]", "memberExpressionCatch", reason);
      const rejectHandler = 'some implementation for sub';
    });
  } catch (ex) {
    myLogger.myError("[custom-options/logger-by-function-name/input.js:24:15]", "catchClause", ex);
    const catchBlock = 'demo purpose for sub';
  }

  return a - b;
}

function multiply(a, b) {
  myLogger.myWarn("[custom-options/logger-by-function-name/input.js:31:24]", "multiply");

  try {
    const myPromise = new Promise(() => {});
    myPromise.catch(reason => {
      myLogger.myError("[custom-options/logger-by-function-name/input.js:36:32]", "memberExpressionCatch", reason);
      const rejectHandler = 'some implementation for multiply';
    });
  } catch (ex) {
    myLogger.myError("[custom-options/logger-by-function-name/input.js:39:15]", "catchClause", ex);
    const catchBlock = 'demo purpose for multiply';
  }

  return a * b;
}

function division(a, b) {
  myLogger.myLog("[custom-options/logger-by-function-name/input.js:46:24]", "division");

  try {
    const myPromise = new Promise(() => {});
    myPromise.catch(reason => {
      myLogger.myError("[custom-options/logger-by-function-name/input.js:51:32]", "memberExpressionCatch", reason);
      const rejectHandler = 'some implementation for division';
    });
  } catch (ex) {
    myLogger.myError("[custom-options/logger-by-function-name/input.js:54:15]", "catchClause", ex);
    const catchBlock = 'demo purpose for division';
  }

  return a / b;
}
