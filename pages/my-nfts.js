import { useEffect, useState } from 'react';
import { Box, Grid, chakra, Flex, Spinner } from '@chakra-ui/react';
import { useStateContext } from '@/context';

export default function MyNFTs() {
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    const [isLoading, setIsLoading] = useState(false);

    const { fetchUserOwnedNFTs } = useStateContext();

    useEffect(() => {
        loadNFTs();
    }, []);

    async function loadNFTs() {
        try {
            setIsLoading(true);
            const userOwnedNFTs = await fetchUserOwnedNFTs();
            setNfts(userOwnedNFTs);
            setLoadingState('loaded');
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    if (loadingState === 'loaded' && !nfts.length) {
        return (
            <chakra.h1 px={12} py={10} fontSize="1.25rem" lineHeight="2.25rem">
                No NFTs owned
            </chakra.h1>
        );
    }
    if (isLoading) {
        return (
            <Flex justifyContent="center" alignItems="center" height="80vh">
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="brand.custom"
                    size="xl"
                />
            </Flex>
        );
    }
    return (
        <Flex justifyContent="center">
            <Box p={4}>
                <chakra.h2 py={2} fontSize="1.5rem" lineHeight="2rem">
                    My NFTs
                </chakra.h2>
                <Grid templateColumns="1fr 1fr 1fr 1fr" gap={6} pt={4}>
                    {nfts.map((nft, i) => (
                        <Box
                            key={i}
                            border={'brand.custom'}
                            overflow="hidden"
                            boxShadow="brand.custom"
                            borderRadius="0.75rem"
                            width={'350px'}
                        >
                            <chakra.img src={nft.image} borderRadius="0.25rem" />
                            <Box p={4} bg={'black'}>
                                <chakra.p
                                    color="white"
                                    fontWeight="bold"
                                    fontSize="1.5rem"
                                    lineHeight="2rem"
                                >
                                    Price - {nft.price} TXDC
                                </chakra.p>
                            </Box>
                        </Box>
                    ))}
                </Grid>
            </Box>
        </Flex>
    );
}
