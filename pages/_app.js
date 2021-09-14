import '../styles.scss'
import { ChakraProvider, Container } from '@chakra-ui/react';
import '../styles/date-picker.css'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Container maxW={{ base: "container.lg", "2xl": "96rem" }} p="2rem">
        <Component {...pageProps} />
      </Container>
    </ChakraProvider>
  );
}

export default MyApp;