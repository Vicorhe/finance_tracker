import '../styles.scss'
import { useState } from 'react'
import { ChakraProvider, Container } from '@chakra-ui/react';
import { UserContext, PrimaryChartContext, SecondaryChartContext } from '../context'
import '../styles/date-picker.css'

function MyApp({ Component, pageProps }) {
  const [user, setUserState] = useState({})
  const [primaryChart, setPrimaryChartState] = useState({})
  const [secondaryChart, setSecondaryChartState] = useState({})

  function setPrimaryChart(p) {
    setPrimaryChartState(p);
  }

  function setUser(a) {
    setUserState(a)
  }

  function setSecondaryChart(s) {
    setSecondaryChartState(s)
  }

  return (
    <ChakraProvider>
      <UserContext.Provider value={{ user, setUser }}>
        <PrimaryChartContext.Provider value={{ primaryChart, setPrimaryChart }}>
          <SecondaryChartContext.Provider value={{ secondaryChart, setSecondaryChart }}>
            <Container maxW="container.lg" p="2rem">
              <Component {...pageProps} />
            </Container>
          </SecondaryChartContext.Provider>
        </PrimaryChartContext.Provider>
      </UserContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;