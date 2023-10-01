import { extendTheme, Button } from '@chakra-ui/react';

export const theme = extendTheme({
    colors: {
        brand: {
            custom: '#5553ff',
        },
    },
    borders: {
        brand: {
            custom: '1px solid #5553ff',
        },
    },
    shadows: {
        brand: {
            custom: '0 0 16px 0 #0078ff4d',
        },
    },
    components: {
        brand: {
            custom: (
                <Button
                    background="brand.custom"
                    opacity="0.5"
                    _hover={{
                        background: '#5553ff',
                        opacity: '1',
                    }}
                    boxShadow="brand.custom"
                />
            ),
        },
    },
});
