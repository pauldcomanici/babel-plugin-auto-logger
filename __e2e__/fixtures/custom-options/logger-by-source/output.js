import myLogger from "path/to/file";

function sum(a, b) {
  myLogger.myDebug("[custom-options/logger-by-source/input.js:1:19]", "sum");

  try {
    const myPromise = new Promise(() => {
      myLogger.myDebug("[custom-options/logger-by-source/input.js:4:40]", "array-item-0");
    });
    myPromise.catch(reason => {
      myLogger.myError("[custom-options/logger-by-source/input.js:6:32]", "memberExpressionCatch", reason);
      const rejectHandler = 'some implementation';
    });
  } catch (ex) {
    myLogger.myError("[custom-options/logger-by-source/input.js:9:15]", "catchClause", ex);
    const catchBlock = 'demo purpose';
  }

  return a + b;
}
