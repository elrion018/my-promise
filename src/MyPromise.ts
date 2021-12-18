enum PromiseStates {
  PENDING = "PENDING",
  FULFILLED = "FULFILLED",
  REJECTED = "REJECTED",
}

/** 프로미스 클래스 */
export class MyPromise {
  state: string;
  value: any;

  constructor(excecutor) {
    this.state = PromiseStates.PENDING;
    this.value = undefined;

    excecutor(this.resolve, this.reject);
  }

  /** 프로미스 인스턴스를 이행(fulfilled) 상태로 귀결(settled) 시키는 메소드 */
  resolve(value: any) {
    // 프로미스 인스턴스가 이미 귀결 상태라면 무시해주기
    if (
      this.state === PromiseStates.FULFILLED ||
      this.state === PromiseStates.REJECTED
    )
      return;

    this.state = PromiseStates.FULFILLED;
    this.value = value;
  }

  /** 프로미스 인스턴스를 거절(rejected) 상태로 귀결시키는 메소드 */
  reject(value: any) {
    // 프로미스 인스턴스가 이미 귀결 상태라면 무시해주기
    if (
      this.state === PromiseStates.FULFILLED ||
      this.state === PromiseStates.REJECTED
    )
      return;

    this.state = PromiseStates.REJECTED;
    this.value = value;
  }

  /** 프로미스 귀결 시 호출될 callback 들을 등록하는 메소드 */
  then(onFulfilled, onRejected) {}
}
