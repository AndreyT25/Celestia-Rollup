To get started, create a new Foundry project:

      forge init GuessTheNumber
      cd GuessTheNumber
      
Copy the contents of the folders according to the directory that was created.
      
Running the test
We can now run our tests to make sure our contract is working properly:

      forge test -vv
      
Deploying to the Ethermint Sovereign Rollup

First, we will need to export the private key generated by the ethermint init.sh script:

      PRIVATE_KEY=$(ethermintd keys unsafe-export-eth-key mykey --keyring-backend test)
      
Now, we can start deploying the smart contract to our Ethermint chain.

To do so, run the following script in the celestia-dapp directory:

      forge script script/GuessTheNumber.s.sol:GuessTheNumberScript --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY --broadcast
      
 If everything was successful, you will receive the address of the contract and the ABI that can be found (your location /out/GuessTheNumber.sol) which we will need later, save them..
      
      
      
      
      
      
      
      
