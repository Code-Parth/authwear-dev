import { ChakraProvider } from '@chakra-ui/react';
import Navbar from '@/components/Navbar';
import { theme } from '@/utlis/theme';
import { StateContextProvider } from '@/context';

export default function App({ Component, pageProps }) {
  return (
    <StateContextProvider>
      <ChakraProvider theme={theme}>
        <Navbar />
        <Component {...pageProps} />
      </ChakraProvider>
    </StateContextProvider>
  );
}
