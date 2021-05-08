import '../styles.scss'
import { useState } from 'react'
import { ChakraProvider, Container } from '@chakra-ui/react';
import { UserContext, AreaContext } from '../context'
import '../styles/date-picker.css'

function MyApp({ Component, pageProps }) {
  const [user, setUserState] = useState({})
  const [area, setAreaState] = useState('')

  function setUser(u) {
    setUserState(u);
  }

  function setArea(a) {
    setAreaState(a)
  }

  return (
    <ChakraProvider>
      <UserContext.Provider value={{ user, setUser }}>
        <AreaContext.Provider value={{ area, setArea }}>
          <Container maxW="container.lg" p="2rem">
            <Component {...pageProps} />
          </Container>
        </AreaContext.Provider>
      </UserContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;