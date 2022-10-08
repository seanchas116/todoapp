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

  get status(): Status<T> {
    this.atom.reportObserved();
    return this._status;
  }

  get value(): T | undefined {
    const { status } = this;
    if (status.type !== "success") {
      return undefined;
    }
    return status.data;
  }

  private observe() {
    this._subscription = this.query.subscribe(
      (result) => {
        this._status = {
          type: "success",
          data: result.data,
        };
        this.atom.reportChanged();
      },
      (error) => {
        // reobserve
        this.query.resetLastResults();
        this._subscription?.unsubscribe();
        this.observe();

        this._status = {
          type: "error",
          error,
        };
        this.atom.reportChanged();
      }
    );
  }

  private unobserve() {
    this._subscription?.unsubscribe();
  }
}
