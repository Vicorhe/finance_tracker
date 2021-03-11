import '../styles.scss'
import { useState } from 'react'
import { ChakraProvider, Container } from '@chakra-ui/react';
import { UserContext } from '../context'

function MyApp({ Component, pageProps }) {
  const [user, setUserState] = useState({})

  function setUser(u) {
    setUserState(u);
  }

  return (
    <ChakraProvider>
      <UserContext.Provider value={{user, setUser}}>
        <Container maxW="container.lg" p="2rem">
          <Component {...pageProps} />
        </Container>
      </UserContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;