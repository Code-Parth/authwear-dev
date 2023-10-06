import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { Button, Flex, chakra, Spinner } from '@chakra-ui/react';
import { Buffer } from 'buffer';

import { marketplaceAddress } from '../config';

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';

const auth =
    'Basic ' +
    Buffer.from(
        process.env.INFURA_IPFS_API_KEY + ':' + process.env.INFURA_IPFS_API_KEY_SECRET
    ).toString('base64');

const client = ipfsHttpClient({
    host: 'infura-ipfs.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

export default function CreateItem() {
    const [isLoading, setIsLoading] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({
        price: '',
        name: '',
        description: '',
    });
    const router = useRouter();

    async function onChange(e) {
        /* upload image to IPFS */
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
    async function uploadToIPFS() {
        const { name, description, price } = formInput;
        if (!name || !description || !price || !fileUrl) return;
        /* first, upload metadata to IPFS */
        const data = JSON.stringify({
            name,
            description,
            image: fileUrl,
        });
        try {
            setIsLoading(true);
            const added = await client.add(data);
            const url = `https://authwear.infura-ipfs.io/ipfs/${added.path}`;
            /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
            setIsLoading(false);
            return url;
        } catch (error) {
            console.log('Error uploading file: ', error);
            setIsLoading(false);
        }
    }

    async function listNFTForSale() {
        const url = await uploadToIPFS();
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        /* create the NFT */
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

        router.push('/');
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
            <Flex w="50%" direction="column" pb={12}>
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
                <chakra.input
                    type="file"
                    name="Asset"
                    my={4}
                    onChange={onChange}
                    required
                />
                {fileUrl && (
                    <chakra.img
                        borderRadius="0.24rem"
                        mt={4}
                        width="350px"
                        src={fileUrl}
                    />
                )}
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
                    isDisabled={!formInput.price || !formInput.name ? true : false}
                >
                    Create NFT
                </Button>
            </Flex>
        </Flex>
    );
}
