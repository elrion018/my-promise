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
  callbacks: Array<Function>;

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
  (onFulfilled: Function, onRejected?: Function);
}

/** 프로미스 생성자가 파라미터로 갖는 excecutor 함수의 인터페이스 */
interface excecutor {
  (resolve, reject): void;
}

/** 프로미스 클래스 */
export class MyPromise implements CustomPromise {
  state: string;
  value: any;
  callbacks: Function[];

  constructor(excecutor: excecutor) {
    this.state = PromiseStates.PENDING;
    this.value = undefined;
    this.callbacks = [];

    // 비동기성을 보장하기 위해 setTimeout을 이용해 태스크 큐의 맨 뒤로 보내버리기
    setTimeout(
      function () {
        excecutor(this.resolve.bind(this), this.reject.bind(this));
      }.bind(this),
      0
    );
  }

  /** 프로미스 인스턴스를 이행(fulfilled) 상태로 귀결(settled) 시키는 메소드 */
  resolve(value: any) {
    // 프로미스 인스턴스가 이미 귀결 상태라면 무시해주기
    if (
      this.state === PromiseStates.FULFILLED ||
      this.state === PromiseStates.REJECTED
    )
      return;

    // 프로미스 인스턴스의 상태와 귀결값 설정
    this.state = PromiseStates.FULFILLED;
    this.value = value;

    this.callbacks.forEach((callback) => {
      callback(this.value);
    }, this);
  }

  /** 프로미스 인스턴스를 거절(rejected) 상태로 귀결시키는 메소드 */
  reject(value: any) {
    // 프로미스 인스턴스가 이미 귀결 상태라면 무시해주기
    if (
      this.state === PromiseStates.FULFILLED ||
      this.state === PromiseStates.REJECTED
    )
      return;

    // 프로미스 인스턴스의 상태와 귀결값 설정
    this.state = PromiseStates.REJECTED;
    this.value = value;
  }

  /** 프로미스 귀결 시 호출될 callback 들을 등록하는 메소드 */
  then(onFulfilled?: Function, onRejected?: Function) {
    this.callbacks = this.callbacks.concat([onFulfilled]);
  }
}
