import { MyPromise } from "./MyPromise.js";

const promise = new MyPromise((resolve, reject) => {
  console.log("excecutor 호출!!");

  resolve(
    new MyPromise((resolve, reject) => {
      resolve(4);
    })
  );
});
promise
  .then((value) => {
    console.log(value, "첫 번째 분기");
    return value;
  })
  .then((value) => {
    console.log(value, "첫 번째 분기 체이닝2");
    return value;
  });

promise.then((value) => {
  console.log(value, "두 번째 분기");
});

console.log("동기적 코드");
