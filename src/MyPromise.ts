/** 프로미스 인스턴스들의 상태를 관리하는 enum */
enum PromiseStates {
  PENDING = "PENDING",
  FULFILLED = "FULFILLED",
  REJECTED = "REJECTED",
}

/** 커스텀 프로미스를 구현하기 위한 인터페이스 */
interface CustomPromise {
  state: string;
  value: any;
  fulfilledCallbacks: Array<Function>;
  rejectedCallbacks: Array<Function>;

  resolve: resolve;
  reject: reject;
  then: then;
}

/** resolve 메소드 인터페이스 */
interface resolve {
  (value: any);
}

/** reject 메소드 인터페이스 */
interface reject {
  (value: any);
}

/** then 메소드 인터페이스 */
interface then {
  (onFulfilled?: Function, onRejected?: Function);
}

/** 프로미스 생성자가 파라미터로 갖는 excecutor 함수의 인터페이스 */
interface excecutor {
  (resolve, reject): void;
}

/** 프로미스 클래스 */
export class MyPromise implements CustomPromise {
  state: string;
  value: any;
  fulfilledCallbacks: Array<Function>;
  rejectedCallbacks: Array<Function>;

  constructor(excecutor: excecutor) {
    this.state = PromiseStates.PENDING;
    this.value = undefined;
    this.fulfilledCallbacks = [];
    this.rejectedCallbacks = [];

    excecutor(this.resolve.bind(this), this.reject.bind(this));
  }
  /** 프로미스 인스턴스를 이행(fulfilled) 상태로 귀결(settled) 시키는 메소드 */
  resolve(value: any) {
    setTimeout(
      function () {
        // 프로미스 인스턴스가 이미 귀결 상태라면 무시해주기
        if (this.state !== PromiseStates.PENDING) return;

        // 프로미스 인스턴스의 상태와 귀결값 설정
        this.state = PromiseStates.FULFILLED;
        this.value = value;

        // then으로 등록된 콜백들을 실행시킨다.
        this.fulfilledCallbacks.forEach((callback) => {
          callback(this.value);
        }, this);
      }.bind(this),
      0
    );
  }

  /** 프로미스 인스턴스를 거절(rejected) 상태로 귀결시키는 메소드 */
  reject(value: any) {
    // 프로미스 인스턴스가 이미 귀결 상태라면 무시해주기
    if (this.state !== PromiseStates.PENDING) return;

    // 프로미스 인스턴스의 상태와 귀결값 설정
    this.state = PromiseStates.REJECTED;
    this.value = value;

    // then으로 등록된 콜백들을 실행시킨다.
    this.rejectedCallbacks.forEach((callback) => {
      callback(this.value);
    }, this);
  }

  /** 프로미스 귀결 시 호출될 callback 들을 등록하는 메소드 */
  /** 체이닝을 위해 프로미스 인스턴스를 반환해야한다. */
  /** 등록된 콜백의 결과값은 반환된 프로미스가 또 다시 귀결시킨다. */
  then(onFulfilled?: Function, onRejected?: Function) {
    return new MyPromise(
      function (resolve, reject) {
        this.fulfilledCallbacks.push(() => {
          try {
            // 이행 콜백의 결과값 구하기
            const value = onFulfilled(this.value);

            // value가 프로미스 객체라면
            if (MyPromise.prototype.isPrototypeOf(value)) {
              value.then(resolve, reject);

              return;
            }

            resolve(value);
          } catch (error) {
            reject(error);
          }
        });

        this.rejectedCallbacks.push(() => {
          try {
            // 거절 콜백의 결과값 구하기
            const value = onRejected(this.value);

            // value가 프로미스 객체라면
            if (MyPromise.prototype.isPrototypeOf(value)) {
              value.then(resolve, reject);

              return;
            }

            reject();
          } catch (error) {
            reject(error);
          }
        });
      }.bind(this)
    );
  }
}
