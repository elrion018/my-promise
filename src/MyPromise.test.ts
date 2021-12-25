import { MyPromise } from "./MyPromise";

function contain<T extends string>(
  array: ReadonlyArray<any>,
  value: any
): value is T {
  return array.some((item) => item === value);
}

test("MyPromise 인스턴스가 생성된다.", () => {
  const promise = new MyPromise((resolve, reject) => {});
  expect(MyPromise.prototype.isPrototypeOf(promise)).toBeTruthy();
});

test("then 메서드를 체이닝하면 then 메서드의 콜백이 등록된다.", () => {
  const promise = new MyPromise((resolve, reject) => {});
  const onFulfilled = function (value) {};

  promise.then(onFulfilled);
});
