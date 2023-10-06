// Importing necessary dependencies and components
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Box, Button, Flex, Grid, Spinner, chakra } from "@chakra-ui/react";
import axios from "axios";
import Web3Modal from "web3modal";

// Importing a configuration file
import { marketplaceAddress } from "../config";

// Importing the JSON representation of your smart contract
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { useStateContext } from "@/context";

// Defining the Home component
export default function Home() {
  // Initializing state variables
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [isLoading, setIsLoading] = useState(false);
  const { contract, fetchUnsoldListedNFTs } = useStateContext();

  // useEffect hook runs when the 'contract' variable changes
  useEffect(() => {
    if (contract) {
      loadNFTs(); // Load NFTs when 'contract' is available
    }
  }, [contract]);

  // Function to load unsold NFTs from the contract
  async function loadNFTs() {
    try {
      setIsLoading(true);
      const unsoldNFTs = await fetchUnsoldListedNFTs();
      setNfts(unsoldNFTs); // Set the NFTs in state
      setLoadingState("loaded");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  // Function to buy an NFT
  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    try {
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      await transaction.wait();
    } catch (error) {
      console.error(error);
    }
    loadNFTs(); // Reload NFTs after a purchase
  }

  // Render the component based on the loading state and NFTs data
  if (loadingState === "loaded" && !nfts.length)
    return (
      <chakra.h1 px={12} py={10} fontSize="1.25rem" lineHeight="2.25rem">
        No items in the marketplace
      </chakra.h1>
    );

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

  // Render NFTs as a grid of boxes with their details
  return (
    <Flex justifyContent="center">
      <Box px="2" maxW="80%">
        <Grid templateColumns="1fr 1fr 1fr 1fr" gap={4} pt={4}>
          {nfts.map((nft, i) => (
            <Box
              key={i}
              border={"brand.custom"}
              overflow="hidden"
              boxShadow="brand.custom"
              borderRadius="0.75rem"
            >
              <chakra.img src={nft.image} width={"100%"} height={"300px"} />
              <Box p={4}>
                <chakra.p
                  style={{ height: "64px" }}
                  fontWeight="semibold"
                  fontSize="1.5rem"
                  lineHeight="2rem"
                >
                  {nft.name}
                </chakra.p>
                <Box h="70px" overflow="hidden">
                  <chakra.p color={"gray.400"}>{nft.description}</chakra.p>
                </Box>
              </Box>
              <Box p={4} bg={"black"}>
                <chakra.p
                  color="white"
                  fontWeight="bold"
                  mb={4}
                  fontSize="1.5rem"
                  lineHeight="2rem"
                >
                  {nft.price} TXDC
                </chakra.p>
                <Button
                  bg="brand.custom"
                  fontWeight="bold"
                  py={2}
                  px={12}
                  borderRadius="0.25rem"
                  w="full"
                  onClick={() => buyNft(nft)}
                  _hover={{
                    background: "brand.custom",
                  }}
                >
                  Buy
                </Button>
              </Box>
            </Box>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
}
