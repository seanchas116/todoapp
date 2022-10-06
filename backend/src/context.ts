export interface CurrentUser {
  uid: string;
  name: string;
  email?: string;
}

export interface Context {
  currentUser?: CurrentUser;
}
