import { MyPromise } from "./MyPromise";

const promise = new MyPromise((resolve, reject) => {
  reject(
    new MyPromise((resolve, reject) => {
      reject(4);
    })
  );
});

promise.then(null, (error) => {
  console.log(error);
});
