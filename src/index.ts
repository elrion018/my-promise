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
    throw new Error("에러발생!");
    // return value;
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    console.log("finally니까 실행은 되어야 해.");
  });

promise.then((value) => {
  console.log(value, "두 번째 분기");
});

console.log("동기적 코드");
