import '../styles.scss'
import { useState } from 'react'
import { ChakraProvider, Container } from '@chakra-ui/react';
import { UserContext } from '../context'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState({})

  function signinUser(u) {
    setUser(u);
  }

  return (
    <ChakraProvider>
      <UserContext.Provider value={{user, signinUser}}>
        <Container maxW="container.lg" p="2rem">
          <Component {...pageProps} />
        </Container>
      </UserContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;