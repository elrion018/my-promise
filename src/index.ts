import { MyPromise } from "./MyPromise.js";

const promise = new MyPromise((resolve, reject) => {
  console.log("excecutor 호출!!");

  reject("에러 발생!");
});
promise
  .then((value) => {
    console.log(value, "첫 번째 분기");
    return value;
  })
  .then()
  .then(
    (value) => {
      console.log(value, "첫 번째 분기 체이닝2");
      return value;
    },
    (error) => {
      console.error(error, "then의 2번째 콜백으로 에러 잡음!");
    }
  );

promise
  .then((value) => {
    console.log(value, "두 번째 분기");
    return value;
  })
  .then((value) => {
    console.log(value, "두 번째 분기 체이닝1");
  })
  .catch((error) => {
    console.error(error, "catch로 에러 잡음!");
  });

console.log("동기적 코드");
