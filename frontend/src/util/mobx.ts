import { createAtom, IAtom } from "mobx";
import { Subscription, Observable } from "zen-observable-ts";

export class ZenMobxBridge<T> {
  constructor(query: Observable<T>, initialValue: T) {
    this._value = initialValue;
    this.query = query;
    this.atom = createAtom(
      "MobxQuery",
      () => {
        this._subscription = this.query.subscribe((result) => {
          this.atom.reportChanged();
          this._value = result;
        });
      },
      () => {
        this._subscription?.unsubscribe();
      }
    );
  }

  readonly query: Observable<T>;
  readonly atom: IAtom;
  private _subscription: Subscription | undefined;
  private _value: T;

  get value(): T {
    this.atom.reportObserved();
    return this._value;
  }
}
