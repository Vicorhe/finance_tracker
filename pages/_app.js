import '../styles.scss'
import { useState } from 'react'
import { ChakraProvider, Container } from '@chakra-ui/react';
import { UserContext } from '../context'
import '../styles/date-picker.css'

function MyApp({ Component, pageProps }) {
  const [user, setUserState] = useState({})

  function setUser(a) {
    setUserState(a)
  }

  return (
    <ChakraProvider>
      <UserContext.Provider value={{ user, setUser }}>
        <Container maxW={{ base: "container.lg", "2xl": "96rem" }} p="2rem">
          <Component {...pageProps} />
        </Container>
      </UserContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;