import { produce } from 'immer'
import jwtDecode from 'jwt-decode'
import * as ls from 'local-storage'
import { createReducer } from 'typesafe-actions'
import { USER_KEY } from '../../../config'
import {
  createAdmin,
  createUser,
  deleteUser,
  getAllUsers,
  hasAdmin,
  login,
  logout,
  setAuthError,
  setUser,
  updateUser,
  updateUserNetworks,
} from './actions'
import { LocalStorageUserKeyValue, User } from './types'

const initialValues = ls.get<LocalStorageUserKeyValue | undefined>(USER_KEY)

export const reducer = createReducer({
  token: initialValues?.token,
  user: initialValues?.user,
  isLoggingIn: false,
  hasAdmin: false,
  isCreating: false,
  users: [] as User[],
  networkError: false,
  authError: false,
})
  .handleAction(setUser, (state, action) =>
    produce(state, (draftState) => {
      draftState.user = action.payload
    })
  )
  .handleAction(login['request'], (state, action) =>
    produce(state, (draftState) => {
      draftState.isLoggingIn = true
    })
  )
  .handleAction(login['success'], (state, action) =>
    produce(state, (draftState) => {
      draftState.token = action.payload.token
      draftState.isLoggingIn = false
      draftState.networkError = false
      const decoded: {
        IsAdmin: boolean
        UserName: string
        Networks: Array<string>
        exp: number
      } = jwtDecode(action.payload.token)
      draftState.user = {
        isAdmin: decoded.IsAdmin,
        name: decoded.UserName,
        networks: decoded.Networks,
        exp: decoded.exp,
      }
      draftState.authError = false
      ls.set<LocalStorageUserKeyValue>(USER_KEY, {
        token: action.payload.token,
        user: draftState.user,
      })
    })
  )
  .handleAction(login['failure'], (state, action) =>
    produce(state, (draftState) => {
      draftState.user = undefined
      draftState.token = undefined
      draftState.isLoggingIn = false

      ls.set<void>(USER_KEY, undefined)
    })
  )
  .handleAction(logout, (state, _) =>
    produce(state, (draftState) => {
      if (!!draftState.user && Date.now() / 1000 > draftState.user.exp) {
        draftState.authError = true
      }

      draftState.user = undefined
      draftState.token = undefined

      ls.set<void>(USER_KEY, undefined)
    })
  )
  .handleAction(hasAdmin['success'], (state, result) =>
    produce(state, (draftState) => {
      draftState.hasAdmin = result.payload
    })
  )
  .handleAction(hasAdmin['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.hasAdmin = false
    })
  )
  .handleAction(createAdmin['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isCreating = true
    })
  )
  .handleAction(createAdmin['success'], (state, _) =>
    produce(state, (draftState) => {
      draftState.hasAdmin = true
      draftState.isCreating = false
      draftState.networkError = false
    })
  )
  .handleAction(createAdmin['failure'], (state, action) =>
    produce(state, (draftState) => {
      draftState.isCreating = false
      if (action.payload.message.includes('Network Error')) {
        draftState.networkError = true
      }
    })
  )
  .handleAction(getAllUsers['success'], (state, action) =>
    produce(state, (draftState) => {
      if (!!action.payload && action.payload.length) {
        draftState.users = action.payload.map((user: any) => ({
          isAdmin: user.isadmin,
          name: user.username,
          networks: user.networks,
          exp: 0,
        }))
      } else {
        draftState.users = []
      }
    })
  )
  .handleAction(createUser['success'], (state, { payload }) =>
    produce(state, (draftState) => {
      draftState.users.push({
        isAdmin: payload.isadmin,
        name: payload.username,
        exp: 0,
        networks: payload.networks,
      })
    })
  )
  .handleAction(deleteUser['success'], (state, { payload }) =>
    produce(state, (draftState) => {
      draftState.users = draftState.users.filter(
        (user) => user.name !== payload.username
      )
    })
  )
  .handleAction(updateUserNetworks['success'], (state, { payload }) =>
    produce(state, (draftState) => {
      const index = draftState.users.findIndex(user => user.name === payload.username)
      if (~index) {
        draftState.users[index] = {
          name: payload.username,
          isAdmin: payload.isadmin,
          networks: payload.networks,
          exp: draftState.users[index].exp
        }
      }
    })
  )
  .handleAction(updateUser['success'], (state, { payload }) =>
  produce(state, (draftState) => {
    const index = draftState.users.findIndex(user => user.name === payload.name)
    if (~index) {
      draftState.users[index] = payload
    }
  })
)
.handleAction(setAuthError, (state, { payload }) =>
  produce(state, (draftState) => {
    draftState.authError = payload
  })
)
