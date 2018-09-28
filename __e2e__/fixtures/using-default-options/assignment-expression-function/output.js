const anonymousFnConst = function (a, b) {
  console.log("[using-default-options/assignment-expression-function/input.js:1:41]", "anonymousFnConst");
  return a + b;
};

const namedFnConst = function sumConst(a, b) {
  console.log("[using-default-options/assignment-expression-function/input.js:5:45]", "sumConst");
  return a + b;
};

let anonymousFnLet = function (a, b) {
  console.log("[using-default-options/assignment-expression-function/input.js:9:37]", "anonymousFnLet");
  return a + b;
};

let namedFnLet = function sumLet(a, b) {
  console.log("[using-default-options/assignment-expression-function/input.js:13:39]", "sumLet");
  return a + b;
};

var anonymousFnVar = function (a, b) {
  console.log("[using-default-options/assignment-expression-function/input.js:17:37]", "anonymousFnVar");
  return a + b;
};

var namedFnVar = function sumVar(a, b) {
  console.log("[using-default-options/assignment-expression-function/input.js:21:39]", "sumVar");
  return a + b;
};
