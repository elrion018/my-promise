import { MyPromise } from "./MyPromise.js";

const promise = new MyPromise((resolve, reject) => {
  console.log("excecutor!");
  resolve("Hello!");
}).then((value) => {
  console.log(value);
});
