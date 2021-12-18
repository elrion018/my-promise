enum PromiseStates {
  PENDING = "PENDING",
  FULFILLED = "FULFILLED",
  REJECTED = "REJECTED",
}

// 프로미스 클래스
export class MyPromise {
  state: string;
  value: any;

  constructor(excecutor) {
    this.state = PromiseStates.PENDING;
    this.value = undefined;

    excecutor(this.resolve, this.reject);
  }

  // 프로미스를 fulfilled 상태로 settled 시키는 메소드
  resolve() {}

  // 프로미스를 rejected 상태로 settled 시키는 메소드
  reject() {}
}
