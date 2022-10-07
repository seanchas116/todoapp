import { ObservableQuery } from "@apollo/client";
import { createAtom, IAtom } from "mobx";
import { Subscription, Observable } from "zen-observable-ts";

type Status =
  | {
      type: "loading";
    }
  | {
      type: "error";
      error: Error;
    }
  | {
      type: "success";
      data: any;
    };

export class MobxQuery<T> {
  constructor(query: ObservableQuery, mapper: (result: any) => T) {
    this.query = query;
    this.mapper = mapper;
    this.atom = createAtom(
      "MobxQuery",
      () => this.observe(),
      () => this.unobserve()
    );
  }

  readonly query: ObservableQuery;
  private readonly mapper: (result: any) => T;
  private readonly atom: IAtom;
  private _subscription: Subscription | undefined;
  private _status: Status = {
    type: "loading",
  };

  get value(): T | undefined {
    this.atom.reportObserved();
    if (this._status.type !== "success") {
      return undefined;
    }
    return this.mapper(this._status.data);
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
