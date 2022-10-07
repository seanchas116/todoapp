import { ObservableQuery } from "@apollo/client";
import { createAtom, IAtom } from "mobx";
import { Subscription, Observable } from "zen-observable-ts";

type Status<T> =
  | {
      type: "loading";
    }
  | {
      type: "error";
      error: Error;
    }
  | {
      type: "success";
      data: T;
    };

export class MobxQuery<T> {
  constructor(query: ObservableQuery<T>) {
    this.query = query;
    this.atom = createAtom(
      "MobxQuery",
      () => this.observe(),
      () => this.unobserve()
    );
  }

  readonly query: ObservableQuery<T>;
  private readonly atom: IAtom;
  private _subscription: Subscription | undefined;
  private _status: Status<T> = {
    type: "loading",
  };

  get value(): T | undefined {
    this.atom.reportObserved();
    if (this._status.type !== "success") {
      return undefined;
    }
    return this._status.data;
  }

  private observe() {
    this._subscription = this.query.subscribe(
      (result) => {
        this.atom.reportChanged();
        this._status = {
          type: "success",
          data: result.data,
        };
      },
      (error) => {
        // reobserve
        this.query.resetLastResults();
        this._subscription?.unsubscribe();
        this.observe();

        this.atom.reportChanged();
        this._status = {
          type: "error",
          error,
        };
      }
    );
  }

  private unobserve() {
    this._subscription?.unsubscribe();
  }
}
