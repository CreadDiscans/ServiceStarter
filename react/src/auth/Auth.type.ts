export interface AuthState {
  isLoggedIn: boolean;
  token?: string;
  user?: AuthUser;
}

export interface AuthActions {
  signIn(username: string, password: string): Promise<[AuthUser, AuthToken]>;
  signUp(username: string, email: string, password: string): Promise<undefined>;
  signOut():void;
  setToken(token:string):void;
}

export interface AuthUser {
  username: string;
  email: string;
}

export interface AuthToken {
  token: string
}