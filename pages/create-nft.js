// Import necessary dependencies and components
import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { Button, Flex, chakra, Spinner } from '@chakra-ui/react';
import { Buffer } from 'buffer';

import { marketplaceAddress } from '../config';

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';

// Create an authentication token for IPFS
const auth =
    'Basic ' +
    Buffer.from(
        process.env.INFURA_IPFS_API_KEY + ':' + process.env.INFURA_IPFS_API_KEY_SECRET
    ).toString('base64');

// Create an IPFS client
const client = ipfsHttpClient({
    host: 'infura-ipfs.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

// Define the CreateItem component
export default function CreateItem() {
    // Initialize state variables
    const [isLoading, setIsLoading] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({
        price: '',
        name: '',
        description: '',
    });
    const router = useRouter();

    // Function to handle file input change (upload image to IPFS)
    async function onChange(e) {
        const file = e.target.files[0];
        try {
            const added = await client.add(file, {
                progress: (prog) => console.log(`received: ${prog}`),
            });
            const url = `https://authwear.infura-ipfs.io/ipfs/${added.path}`;
            setFileUrl(url);
        } catch (error) {
            console.log('Error uploading file: ', error);
        }
    }

    // Function to upload metadata to IPFS
    async function uploadToIPFS() {
        const { name, description, price } = formInput;
        if (!name || !description || !price || !fileUrl) return;

        // Create metadata as JSON
        const data = JSON.stringify({
            name,
            description,
            image: fileUrl,
        });

        try {
            setIsLoading(true);
            const added = await client.add(data);
            const url = `https://authwear.infura-ipfs.io/ipfs/${added.path}`;
            setIsLoading(false);
            return url; // Return the URL to use in the transaction
        } catch (error) {
            console.log('Error uploading file: ', error);
            setIsLoading(false);
        }
    }

    // Function to list an NFT for sale
    async function listNFTForSale() {
        const url = await uploadToIPFS();
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        // Create the NFT
        const price = ethers.utils.parseUnits(formInput.price, 'ether');
        let contract = new ethers.Contract(
            marketplaceAddress,
            NFTMarketplace.abi,
            signer
        );
        try {
            setIsLoading(true);
            let transaction = await contract.createToken(url, price);
            await transaction.wait();
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }

        router.push('/'); // Redirect to the main page after creating the NFT
    }

    // Render a loading spinner if the component is in loading state
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

    // Render the create item form
    return (
        <Flex justifyContent="center">
            <Flex w="50%" direction="column" pb={12}>
                {/* Input fields for asset name, description, price */}
                <chakra.input
                    mt="8"
                    border="brand.custom"
                    p={4}
                    borderRadius="0.24rem"
                    placeholder="Asset Name"
                    onChange={(e) =>
                        updateFormInput({ ...formInput, name: e.target.value })
                    }
                    required
                />
                <chakra.textarea
                    placeholder="Asset Description"
                    mt={2}
                    p={4}
                    border="brand.custom"
                    borderRadius="0.24rem"
                    onChange={(e) =>
                        updateFormInput({ ...formInput, description: e.target.value })
                    }
                />
                <chakra.input
                    placeholder="Asset Price in TXDC"
                    mt={2}
                    p={4}
                    border="brand.custom"
                    borderRadius="0.24rem"
                    onChange={(e) =>
                        updateFormInput({ ...formInput, price: e.target.value })
                    }
                    required
                    type="number"
                    min="0.00001"
                />
                {/* File input for asset image */}
                <chakra.input
                    type="file"
                    name="Asset"
                    my={4}
                    onChange={onChange}
                    required
                />
                {/* Display the uploaded image */}
                {fileUrl && (
                    <chakra.img
                        borderRadius="0.24rem"
                        mt={4}
                        width="350px"
                        src={fileUrl}
                    />
                )}
                {/* Button to create and list the NFT */}
                <Button
                    onClick={listNFTForSale}
                    fontWeight="bold"
                    bg="brand.custom"
                    mt={4}
                    p={4}
                    borderRadius="0.25rem"
                    boxShadow="brand.custom"
                    _hover={{
                        background: 'brand.custom',
                    }}
                    color="white"
                    // Disable the button if required fields are empty
                    isDisabled={!formInput.price || !formInput.name ? true : false}
                >
                    Create NFT
                </Button>
            </Flex>
        </Flex>
    );
}
