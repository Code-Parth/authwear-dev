import React from 'react';
import { Button, Flex, chakra } from '@chakra-ui/react';
import { ethers } from 'ethers';
import Link from 'next/link';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { truncateAddress } from '@/utlis/helpers';

function Navbar() {
    const [account, setAccount] = React.useState();
    const connectHandler = async () => {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            const account = ethers.utils.getAddress(accounts[0]);
            setAccount(account);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <chakra.nav borderBottomWidth="1px" p="1.5rem 3rem">
            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <chakra.p fontSize="2.25rem" lineHeight="2.5rem" fontWeight="bold">
                    AuthWear
                </chakra.p>
                <chakra.p fontSize="1rem" lineHeight="2.5rem" fontStyle="italic">
                    **Please make sure you have metamask installed and you are on XDC Apothem Testnet
                </chakra.p>
                <Flex>
                    {account ? (
                        <Button
                            bg="brand.custom"
                            p={4}
                            borderRadius="0.25rem"
                            boxShadow="brand.custom"
                            _hover={{
                                background: 'brand.custom',
                            }}
                            color="white"
                        >
                            {truncateAddress(account)}
                        </Button>
                    ) : (
                        <Button
                            bg="brand.custom"
                            p={4}
                            borderRadius="0.25rem"
                            boxShadow="brand.custom"
                            _hover={{
                                background: 'brand.custom',
                            }}
                            color="white"
                            onClick={connectHandler}
                        >
                            Connect
                        </Button>
                    )}
                    <ColorModeSwitcher />
                </Flex>
            </Flex>

            <Flex
                mt="4"
                color={'#5553ff'}
                fontWeight="semibold"
                alignItems="center"
                justifyContent="space-between"
            >
                <Flex>
                    <Link href="/">
                        <chakra.p mr="1.5rem">Home</chakra.p>
                    </Link>
                    <Link href="/create-nft">
                        <chakra.p mr="1.5rem">Mint & List NFT</chakra.p>
                    </Link>
                    <Link href="/my-nfts">
                        <chakra.p mr="1.5rem">My NFTs</chakra.p>
                    </Link>
                    <Link href="/dashboard">
                        <chakra.p mr="1.5rem">Dashboard</chakra.p>
                    </Link>
                </Flex>
            </Flex>
        </chakra.nav>
    );
}

export default Navbar;
