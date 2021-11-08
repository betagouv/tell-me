export type AuthContextState = {
  isAuthenticated: Common.Nullable<boolean>
  isLoading: boolean
  refreshToken: Common.Nullable<string>
  sessionToken: Common.Nullable<string>
}

export type AuthContextUser = {
  _id: string
  email: string
  role: Common.User.Role
}

export type AuthContext = {
  clearSessionToken: () => void
  logIn: (sessionToken: string, refreshToken?: Common.Nullable<string>) => Promise<void>
  logOut: () => void
  state: AuthContextState
  user: Common.Nullable<AuthContextUser>
}
