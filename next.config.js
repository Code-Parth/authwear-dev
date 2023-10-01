/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    INFURA_IPFS_API_KEY: process.env.INFURA_IPFS_API_KEY,
    INFURA_IPFS_API_KEY_SECRET: process.env.INFURA_IPFS_API_KEY_SECRET,
    RPC_URL: process.env.RPC_URL
  },
}

module.exports = nextConfig
