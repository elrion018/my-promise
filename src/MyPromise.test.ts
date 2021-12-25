import { MyPromise } from "./MyPromise";

test("MyPromise 인스턴스가 생성된다.", () => {
  const promise = new MyPromise((resolve, reject) => {});
  expect(MyPromise.prototype.isPrototypeOf(promise)).toBeTruthy();
});

test("프로미스 인스턴스는 최초 단 한 번만 귀결된다.", (done) => {
  const promise = new MyPromise((resolve, reject) => {
    let value = 0;

    const timerId = setInterval(() => {
      value++;

      if (value === 2) clearInterval(timerId);
      resolve(value);
    }, 1000);
  });

  setTimeout(() => {
    promise.then((value) => {
      try {
        expect(value).toBe(1);
        done();
      } catch (error) {
        done(error);
      }
    });
  }, 2000);
});

test("excecutor에서 원시 값을 귀결시키면 원시 값 그대로 귀결된다(resolve).", (done) => {
  const promise = new MyPromise((resolve, reject) => {
    resolve(4);
  });

  promise.then((value) => {
    try {
      expect(value).toBe(4);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test("excecutor에서 원시 값을 귀결시키면 원시 값 그대로 귀결된다(reject).", (done) => {
  const promise = new MyPromise((resolve, reject) => {
    reject(4);
  });

  promise.then(null, (e) => {
    try {
      expect(e).toBe(4);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test("excecutor에서 프로미스 인스턴스를 귀결시키려 하면 먼저 프로미스 인스턴스를 내부적으로 귀결시킨 후 귀결된다(resolve).", (done) => {
  const promise = new MyPromise((resolve, reject) => {
    resolve(
      new MyPromise((resolve, reject) => {
        resolve(4);
      })
    );
  });

  promise.then((value) => {
    try {
      expect(value).toBe(4);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test("excecutor에서 프로미스 인스턴스를 귀결시키려 하면 먼저 프로미스 인스턴스를 내부적으로 귀결시킨 후 귀결된다(reject).", (done) => {
  const promise = new MyPromise((resolve, reject) => {
    reject(
      new MyPromise((resolve, reject) => {
        reject(4);
      })
    );
  });

  promise.then(null, (error) => {
    try {
      expect(error).toBe(4);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test("then 메서드를 체이닝하면 then 메서드의 콜백이 등록된다.", () => {
  const promise = new MyPromise((resolve, reject) => {});
  const prevLength = promise.getCallbacks().length;
  const onFulfilled = function (value) {};

  promise.then(onFulfilled);

  const nowLength = promise.getCallbacks().length;

  expect(
    prevLength + 1 === nowLength &&
      typeof promise.getCallbacks()[nowLength - 1]["onFulfilled"] === "function"
  ).toBeTruthy();
});

test("then 메서드의 첫 번째 인자로 들어간 콜백은 항상 비동기적으로 호출된다.", (done) => {
  let a = 0;

  new MyPromise((resolve, reject) => {
    resolve(4);
  }).then(() => {
    try {
      expect(a).toBe(1);
      done();
    } catch (error) {
      done(error);
    }
  });

  a++;
});

test("then 메서드의 두 번째 인자로 들어간 콜백은 항상 비동기적으로 호출된다.", (done) => {
  let a = 0;

  new MyPromise((resolve, reject) => {
    reject(4);
  }).then(null, () => {
    try {
      expect(a).toBe(1);
      done();
    } catch (error) {
      done(error);
    }
  });

  a++;
});

test("catch 메서드를 체이닝하면 에러 발생 시 예외처리할 수 있다.", (done) => {
  const promise = new MyPromise((resolve, reject) => {
    throw new Error("에러 발생!");
  });

  promise.catch((error) => {
    try {
      expect(error).toEqual(new Error("에러 발생!"));
      done();
    } catch (error) {
      done(error);
    }
  });
});

test("catch 메서드를 체이닝하면 거부로 귀결 시 예외처리할 수 있다.", (done) => {
  // reject 하는 경우
  const promise = new MyPromise((resolve, reject) => {
    reject("거부");
  });

  promise.catch((error) => {
    try {
      expect(error).toBe("거부");
      done();
    } catch (error) {
      done(error);
    }
  });
});

test("finally 메서드를 체이닝하면 콜백 내 로직은 무조건 실행된다.", (done) => {
  const promise = new MyPromise((resolve, reject) => {
    throw new Error("에러 발생!");
  });

  promise.finally(() => {
    try {
      expect(2 + 2).toBe(4);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test("Promise.resolve 정적 메서드는 원시 값이 주어질 경우 주어진 값으로 이행된 프로미스 인스턴스를 반환한다.", (done) => {
  const promise = MyPromise.resolve(4);

  promise.then((value) => {
    try {
      expect(value).toBe(4);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test("Promise.resolve 정적 메서드는 프로미스 인스턴스가 값으로 주어질 경우 주어진 프로미스 인스턴스를 이행시키고 그 이행 값을 가진 프로미스 인스턴스를 반환한다.", (done) => {
  const promise = MyPromise.resolve(MyPromise.resolve(4));

  promise.then((value) => {
    try {
      expect(value).toBe(4);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test("Promise.reject 정적 메서드는 원시 값이 주어질 경우 주어진 값으로 거부된 프로미스 인스턴스를 반환한다.", (done) => {
  const promise = MyPromise.reject(4);

  promise.then(null, (error) => {
    try {
      expect(error).toBe(4);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test("Promise.resolve 정적 메서드는 프로미스 인스턴스가 값으로 주어질 경우 주어진 프로미스 인스턴스를 거부시키고 그 거부 값을 가진 프로미스 인스턴스를 반환한다.", (done) => {
  const promise = MyPromise.reject(MyPromise.reject(4));

  promise.then(null, (value) => {
    try {
      expect(value).toBe(4);
      done();
    } catch (error) {
      done(error);
    }
  });
});
