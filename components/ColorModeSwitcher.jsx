import React from 'react';
import { useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

// Define the ColorModeSwitcher component
export const ColorModeSwitcher = (props) => {
    // Access Chakra UI's color mode functions
    const { toggleColorMode } = useColorMode();

    // Determine the text to display based on the current color mode
    const text = useColorModeValue('dark', 'light');

    // Determine the icon to display based on the current color mode
    const SwitchIcon = useColorModeValue(FaMoon, FaSun);

    return (
        // Render an IconButton that toggles the color mode
        <IconButton
            size="md"
            fontSize="lg"
            aria-label={`Switch to ${text} mode`}
            variant="ghost"
            color="current"
            marginLeft="2"
            onClick={toggleColorMode}
            icon={<SwitchIcon />} // Display either the moon or sun icon
            border={'brand.custom'}
            boxShadow="brand.custom"
            {...props}
        />
    );
};
