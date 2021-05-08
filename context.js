import { createContext } from 'react'
export const UserContext = createContext({
  user: {},
  setUser: () => {},
});

export const PrimaryChartContext = createContext({
  primaryChart: {},
  setPrimaryChart: () => {},
});

export const SecondaryChartContext = createContext({
  secondaryChart: {},
  setSecondaryChart: () => {},
});