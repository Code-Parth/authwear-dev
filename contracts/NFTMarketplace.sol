// SPDX-License-Identifier: UNLICENSED
// Indicates the license type for the contract.
// SPDX-License-Identifier is a standardized way to specify licensing information.
pragma solidity ^ 0.8.9;
// Specifies the Solidity version that this contract is compatible with.

import "@openzeppelin/contracts/utils/Counters.sol";
// Import the Counters library from OpenZeppelin to handle counting operations.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// Import the ERC721URIStorage extension for ERC721 tokens from OpenZeppelin.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// Import the basic ERC721 functionality from OpenZeppelin.

import "hardhat/console.sol";
// Import the Hardhat console library for debugging purposes.

contract NFTMarketplace is ERC721URIStorage {
  // Define a new contract called NFTMarketplace that inherits from ERC721URIStorage.
  using Counters for Counters.Counter;
  // Create a Counters.Counter variable using the Counters library.

  Counters.Counter private _tokenIds;
  // Create a private counter for tracking token IDs.
  Counters.Counter private _itemsSold;
  // Create a private counter for tracking items sold.

  address payable owner;
  // Declare an address variable to store the owner's address.

  mapping(uint256 => MarketItem) private idToMarketItem;
  // Declare a mapping that associates token IDs with MarketItem structs.

  struct MarketItem {
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }
  // Define a struct called MarketItem to represent items listed on the marketplace.

  event MarketItemCreated(
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );
  // Define an event to log the creation of a marketplace item.

  constructor() ERC721("AuthWear", "AUTHWEAR") {
    // Constructor function that initializes the contract.
    owner = payable(msg.sender);
    // Set the contract owner as the sender of the deployment transaction.
  }

  /* Mints a token */
  function createToken(
    string memory tokenURI,
    uint256 price
  ) public payable returns(uint) {
    // Function to mint a new NFT token and list it for sale.
    _tokenIds.increment();
    // Increment the token ID counter.
    uint256 newTokenId = _tokenIds.current();
    // Get the current token ID.
    _mint(msg.sender, newTokenId);
    // Mint a new token with the provided URI and assign it to the sender.
    _setTokenURI(newTokenId, tokenURI);
    // Set the token URI for the newly minted token.
    listMarketItem(newTokenId, price);
    // List the new token on the marketplace with the specified price.
    return newTokenId;
    // Return the ID of the newly minted token.
  }

  /* Enable users to list their NFTs for sale with an asking price. */
  function listMarketItem(uint256 tokenId, uint256 price) private {
    // Function to list an NFT on the marketplace with a specified price.
    require(price > 0, "Price must be at least 1 wei");
    // Require that the price is greater than 0 wei.

    idToMarketItem[tokenId] = MarketItem(
      tokenId,
      payable(msg.sender),
      payable(address(this)),
      price,
      false
    );
    // Create a new MarketItem struct and store it in the mapping.

    _transfer(msg.sender, address(this), tokenId);
    // Transfer ownership of the NFT to the contract.
    emit MarketItemCreated(
      tokenId,
      msg.sender,
      address(this),
      price,
      false
    );
    // Emit an event to log the creation of the marketplace item.
  }

  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(uint256 tokenId) public payable {
    // Function to complete the sale of a marketplace item.
    uint price = idToMarketItem[tokenId].price;
    // Get the price of the item from the marketplace mapping.
    address seller = idToMarketItem[tokenId].seller;
    // Get the seller's address from the marketplace mapping.

    require(
      msg.value == price,
      "Please submit the asking price in order to complete the purchase"
    );
    // Require that the sent ether matches the item's price.

    idToMarketItem[tokenId].owner = payable(msg.sender);
    // Transfer ownership of the item to the buyer.
    idToMarketItem[tokenId].sold = true;
    // Mark the item as sold.
    idToMarketItem[tokenId].seller = payable(address(0));
    // Set the seller's address to address(0) to indicate it's no longer the seller.

    _itemsSold.increment();
    // Increment the counter for items sold.
    _transfer(address(this), msg.sender, tokenId);
    // Transfer the NFT from the contract to the buyer.
    payable(seller).transfer(msg.value);
    // Transfer the funds to the seller.
  }

  /* Returns all NFTs listed for sale (market items) */
  function fetchMarketItems() public view returns(MarketItem[] memory) {
    // Function to fetch all NFTs listed for sale in the marketplace.
    uint itemCount = _tokenIds.current();
    // Get the current total number of tokens.
    uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
    // Calculate the number of unsold items.
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    // Create an array to store the unsold marketplace items.

    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(this)) {
        // Check if the item is owned by the contract (listed for sale).
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
    // Return the array of unsold marketplace items.
  }

  /* Returns only NFTs that user has purchased */
  function fetchMyNFTs() public view returns(MarketItem[] memory) {
    // Function to fetch NFTs that the user has purchased.
    uint totalItemCount = _tokenIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        // Check if the item is owned by the caller (msg.sender).
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    // Create an array to store the user's purchased NFTs.

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
    // Return the array of the user's purchased NFTs.
  }

  /* Returns only NFTs that a user has listed */
  function fetchItemsListed() public view returns(MarketItem[] memory) {
    // Function to fetch NFTs that the user has listed for sale.
    uint totalItemCount = _tokenIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        // Check if the item is listed for sale by the caller (msg.sender).
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    // Create an array to store the user's listed items.

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
    // Return the array of the user's listed items.
  }
}
