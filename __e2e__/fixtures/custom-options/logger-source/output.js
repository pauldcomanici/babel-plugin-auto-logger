import myLogger from "path/to/file";

function sum(a, b) {
  myLogger.log("[custom-options/logger-source/input.js:1:19]", "sum");

  try {
    const myPromise = new Promise(() => {
      myLogger.log("[custom-options/logger-source/input.js:4:40]", "array-item-0");
    });
    myPromise.catch(reason => {
      myLogger.error("[custom-options/logger-source/input.js:6:32]", "memberExpressionCatch", reason);
      const rejectHandler = 'some implementation';
    });
  } catch (ex) {
    myLogger.error("[custom-options/logger-source/input.js:9:15]", "catchClause", ex);
    const catchBlock = 'demo purpose';
  }

  return a + b;
}
