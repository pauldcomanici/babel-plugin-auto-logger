import myLogger from "path/to/file";

function sum(a, b) {
  myLogger.myLog("[custom-options/logger-method/input.js:1:19]", "sum");

  try {
    const myPromise = new Promise(() => {
      myLogger.myLog("[custom-options/logger-method/input.js:4:40]", "array-item-0");
    });
    myPromise.catch(reason => {
      myLogger.myInfo("[custom-options/logger-method/input.js:6:32]", "memberExpressionCatch", reason);
      const rejectHandler = 'some implementation';
    });
  } catch (ex) {
    myLogger.myDebug("[custom-options/logger-method/input.js:9:15]", "catchClause", ex);
    const catchBlock = 'demo purpose';
  }

  return a + b;
}
