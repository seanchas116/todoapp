import { ObservableQuery } from "@apollo/client";
import { createAtom, IAtom } from "mobx";
import { Subscription, Observable } from "zen-observable-ts";

export class QueryMobxView<T> {
  constructor(
    query: ObservableQuery,
    mapper: (result: any) => T,
    initialValue: T
  ) {
    this._value = initialValue;
    this.query = query;
    this.mapper = mapper;
    this.atom = createAtom(
      "MobxQuery",
      () => this.observe(),
      () => this.unobserve()
    );
  }

  readonly query: ObservableQuery;
  readonly mapper: (result: any) => T;
  readonly atom: IAtom;
  private _subscription: Subscription | undefined;
  private _value: T;

  get value(): T {
    this.atom.reportObserved();
    return this._value;
  }

  private observe() {
    this._subscription = this.query.subscribe(
      (result) => {
        this.atom.reportChanged();
        this._value = this.mapper(result);
      },
      (error) => {
        // reobserve
        this.query.resetLastResults();
        this._subscription?.unsubscribe();
        this.observe();
      }
    );
  }

  private unobserve() {
    this._subscription?.unsubscribe();
  }
}
