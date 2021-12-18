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
  callbacks: Array<thenCallbacks>;

  resolve: resolve;
  reject: reject;
  then: then;
  catch: myCatch;
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

interface thenCallbacks {
  onFulfilled: Function;
  onRejected: Function;
}

/** catch 메소드 인터페이스
 *  인터페이스로 catch라는 이름을 사용할 수 없어 myCatch로 명명
 */
interface myCatch {
  (onRejected?: Function);
}

/** 프로미스 생성자가 파라미터로 갖는 excecutor 함수의 인터페이스 */
interface excecutor {
  (resolve, reject): void;
}

/** 프로미스 클래스 */
export class MyPromise implements CustomPromise {
  state: string;
  value: any;
  callbacks: Array<thenCallbacks>;

  constructor(excecutor: excecutor) {
    this.state = PromiseStates.PENDING;
    this.value = undefined;
    this.callbacks = [];

    try {
      excecutor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  /** 프로미스 인스턴스를 이행(fulfilled) 상태로 귀결(settled) 시키는 메소드 */
  resolve(value: any) {
    this.updateData(value, PromiseStates.FULFILLED);
  }

  /** 프로미스 인스턴스를 거절(rejected) 상태로 귀결시키는 메소드 */
  reject(value: any) {
    this.updateData(value, PromiseStates.REJECTED);
  }

  updateData(value, state) {
    // setTimeout으로 설정하여 지연시켜주기
    // 그렇지 않으면 동기적으로 then 체이닝이 끝날 때까지 재귀적으로 연계된다.
    // 이 경우 같은 프로미스 인스턴스에 대한 분기를 사용할 수 없게 됨.
    setTimeout(
      function () {
        // 프로미스 인스턴스가 이미 귀결 상태라면 무시해주기
        if (this.state !== PromiseStates.PENDING) return;

        // value가 프로미스 인스턴스라면 이들을 먼저 귀결할 것
        if (MyPromise.prototype.isPrototypeOf(value)) {
          return value.then(this.resolve.bind(this), this.reject.bind(this));
        }

        // 프로미스 인스턴스의 상태와 귀결값 설정
        this.value = value;
        this.state = state;

        this.executeCallbacks.call(this);
      }.bind(this),
      0
    );
  }

  /** then으로 등록된 콜백을 실행시켜주는 메소드
   *  비동기적으로 실행되므로 이미 동기적으로 then의 콜백들이 등록된 상태
   */
  executeCallbacks() {
    // 아직 대기 상태라면 끝낸다
    if (this.state === PromiseStates.PENDING) return;

    // then으로 등록된 callback들을 실행시켜준다.
    this.callbacks.forEach((callback) => {
      if (this.state === PromiseStates.FULFILLED) {
        return callback.onFulfilled(this.value);
      }

      return callback.onRejected(this.value);
    });

    // 사용한 콜백들을 비워준다.
    this.callbacks = [];
  }

  /** 프로미스 귀결 시 호출될 callback 들을 등록하는 메소드
   * 체이닝을 위해 프로미스 인스턴스를 반환해야한다.
   * 등록된 콜백의 결과값은 반환된 프로미스가 또 다시 귀결시킨다.
   */
  then(onFulfilled?: Function, onRejected?: Function) {
    return new MyPromise(
      function (resolve, reject) {
        // 이 콜백 배열은 지금 생성되는 프로미스 인스턴스의 것이 아니라 이전 프로미스 인스턴스의 것
        // 여기 추가되는 콜백들은 이전 프로미스 인스턴스가 귀결될 때 작동한다.
        this.callbacks.push({
          onFulfilled: function (value) {
            try {
              // onFulfilled 콜백이 주입되지 않더라도 귀결된 결과 다음 체이닝에 전달
              // 즉, 다음 프로미스를 귀결시킨다.

              if (!onFulfilled) {
                return resolve(value);
              }

              // 이행 콜백의 결과값 구하기

              return resolve(onFulfilled(value));
            } catch (error) {
              reject(error);
            }
          },

          onRejected: function (value) {
            try {
              // onRejected 콜백이 주입되지 않더라도 귀결된 결과 다음 체이닝에 전달
              if (!onRejected) {
                return reject(value);
              }

              return reject(onRejected(value));
            } catch (error) {
              return reject(error);
            }
          },
        });

        this.executeCallbacks.call(this);
      }.bind(this)
    );
  }

  /** 프로미스 체이닝 중 발생한 rejected 및 에러를 처리하는 메소드
   *  내부적으로 then 메소드를 호출한다.
   */
  catch(onRejected: Function) {
    this.then(null, onRejected);
  }
}
