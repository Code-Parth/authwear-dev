// Import necessary dependencies and components
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from '@/components/Navbar'; // Your Navbar component
import { theme } from '@/utlis/theme'; // Your Chakra UI theme
import { StateContextProvider } from '@/context'; // Your custom state context provider

// Define the App component, which serves as the entry point for your application
export default function App({ Component, pageProps }) {
  return (
    // Wrap your entire application with the custom StateContextProvider
    <StateContextProvider>
      {/* Provide Chakra UI styles and theme to your application */}
      <ChakraProvider theme={theme}>
        {/* Include the Navbar component */}
        <Navbar />
        {/* Render the main component (Component) with its pageProps */}
        <Component {...pageProps} />
      </ChakraProvider>
    </StateContextProvider>
  );
}
