export interface CurrentUser {
  uid: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Context {
  currentUser?: CurrentUser;
}
