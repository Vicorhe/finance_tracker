import { createContext } from 'react'
export const UserContext = createContext({
  user: {},
  setUser: () => {},
});

export const AreaContext = createContext({
  area: {},
  setArea: () => {},
});