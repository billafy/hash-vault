# HashVault

A dApp where users can store their documents in a decentralized way and verify their integrity. 

Steps to run:-

    1. Install Truffle.
        `npm install -g truffle`
    
    2. Install all the required packages in the root folder '/' and the client folder '/client'.
        `npm install
        `cd client`
        `npm install`

    3. Install Ganache and run a local blockchain.
        `npm install -g ganache`
        `ganache`

    4. Login onto Metamask and add a couple of accounts using the private keys given in the Ganache local blockchain.

    5. Compile and deploy the contracts.
        `truffle compile`
        `truffle migrate --network development`

    6. Run the client.
        `cd client`
        `npm run dev`