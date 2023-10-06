# AuthWear

AuthWear is the future of fashion—a blockchain-powered platform that ensures every merch you buy is authentic. Say goodbye to counterfeit worries and celebrate authentic merch and wearables. 

Authwear website link: https://authwear.vercel.app/

Authwear other reference links: https://docs.google.com/document/d/1ck_Ku7COy8VCfM2-O0hAsvHbtAKXjiqPgC4oCogqyLs/edit?usp=sharing

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](Installation)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)

## Introduction

In a world plagued by counterfeit fashion merchandise, AuthWear is a beacon of trust and authenticity. Our platform leverages blockchain technology to ensure that every fashion item you purchase is genuine and eco-conscious.

- **Verify Authenticity**: Instantly verify the authenticity of fashion merchandise using QR codes.

- **Celebrate Individual Style**: Trust your unique fashion expression, knowing it's genuine.

## Features

- **Blockchain Authentication**: Utilizes XinFin (XDC) blockchain for unforgeable authenticity verification.
- **QR Code Technology**: Seamlessly scan QR codes to access detailed product history.
- **Ownership Assurance**: Proves legitimate ownership and provenance of fashion items.

## Installation

To get started with AuthWear, follow these steps:

```bash
git clone https://github.com/Code-Parth/authwear-dev.git
cd authwear-dev
yarn
```

```bash
npx hardhat run scripts/deploy.js --network apothem
```

```bash
yarn run dev
```


## How It Works

![DIgital soln flow](https://github.com/Code-Parth/authwear-dev/assets/84669955/3692672a-dd4c-4845-bff8-982b78fc7c8a)

![Physical process flow new](https://github.com/Code-Parth/authwear-dev/assets/84669955/fc2054f1-69dc-42ea-b59c-10481a8d06c1)

- Merch collaborators release their merchandise on our platform and each product is assigned a UID and Qr code.
- During the purchase of the product, the generated UID(nft form) will be transferred to the customer’s address.
- Buyers and chain buyers can verify the authenticity of the product using the QR code that will be embedded on the product in a label or any feasible form.



1. **Blockchain Verification**: Each fashion item is associated with a unique NFT (Non-Fungible Token) on the XinFin blockchain, guaranteeing authenticity.

2. **QR Code Scanning**: Users can scan the QR code on fashion items to access official history linked to the product's owner, including authenticity checks and provenance.



## Technology Stack

- XinFin (XDC) Blockchain
- QR Code Generation and Scanning
- IPFS (InterPlanetary File System)
- Apothem
- Metamask
- Smart Contracts (Solidity)
- ChakraUI
- Next.JS
- Infura
- TXDC
- XRC721 Tokens
- HArdhat
- Yarn


## License

AuthWear is licensed under the [MIT License](LICENSE).
