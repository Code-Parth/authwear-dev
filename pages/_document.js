// Import necessary elements from 'next/document'
import { Html, Head, Main, NextScript } from 'next/document';

// Define the custom Document component
export default function Document() {
  return (
    // The <Html> component defines the HTML structure of the document with the specified language attribute.
    <Html lang="en">
      {/* The <Head> component is typically used to include custom meta tags, CSS, and other head elements. */}
      <Head />
      <body>
        {/* The <Main> component represents the main content of your application. */}
        <Main />
        {/* The <NextScript> component includes scripts and assets that Next.js needs to function properly. */}
        <NextScript />
      </body>
    </Html>
  );
}
