# HashVault

A dApp where users can store their documents in a decentralized way and verify their integrity. 

Steps to run:-

    1. Install Truffle.
        ```console
        npm install -g truffle
        ```
    
    2. Install all the required packages in the root folder '/' and the client folder '/client'.
        ```console
        npm install
        ```
        ```console
        cd client
        ```
        ```console
        npm install
        ```

    3. Install Ganache and run a local blockchain.
        ```console
        npm install -g ganache
        ```
        ```console
        ganache
        ```

    4. Login onto Metamask and add a couple of accounts using the private keys given in the Ganache local blockchain.

    5. Compile and deploy the contracts.
        ```console
        truffle compile
        ```
        ```console
        truffle migrate --network development
        ```

    6. Run the client.
        ```console
        cd client
        ```
        ```console
        npm run dev
        ```