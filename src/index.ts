import { MyPromise } from "./MyPromise.js";

const promise = new MyPromise((resolve, reject) => {
  console.log("excecutor 호출!!");

  resolve("value");
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
      console.error(error);
    }
  );

promise
  .then((value) => {
    console.log(value, "두 번째 분기");

    return value;
  })
  .then((value) => {
    console.log(value, "두 번째 분기 체이닝1");
  });

console.log("동기적 코드");
