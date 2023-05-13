# Celestia-Rollup

In this tutorial, I'll show you how to create a simple guessing game...

First of all we need to create our network on Celestia Rullkit, official documentation can be seen [here](https://rollkit.dev/docs/tutorials/ethermint/)

First we will install Rollkit

       git clone https://github.com/celestiaorg/ethermint.git
       cd ethermint
       make install

You can check if ethermintd is installed by running the following command:

       ethermintd
      
Run a Celestia light node
You can do this by following this tutorial [here](https://rollkit.dev/docs/tutorials/ethermint/)
      
In the ethermint directory we have a useful bash script that allows you to instantiate a local sovereign build of Ethermint on Celestia.

       bash init.sh

Save the data that will be after the bash init command, we will still need it.
      
We need to set some environment variables.

       NAMESPACE_ID=$(openssl rand -hex 8)
       DA_BLOCK_HEIGHT=$(curl https://rpc-blockspacerace.pops.one/block | jq -r '.result.block.header.height')

With this setup complete, we can now start our Ethermint Rollup: I recommend running in nohup this will keep your network running 24/7 but remember this program will not restart your process after server restart.. after any server restart you need to run again..

       nohup ethermintd start --rollkit.aggregator true --rollkit.da_layer celestia --rollkit.da_config='{"base_url":"http://localhost:26659","timeout":60000000000,"gas_limit":6000000," fee":6000}' --rollkit.namespace_id $NAMESPACE_ID --rollkit.da_start_height $DA_BLOCK_HEIGHT > ethermintd.log 2>&1 &

To confirm that the process is running in the background, you can use the ps command:

       ps -ef | grep ethermintd
To view the logs, you can use the tail command:

       tail -f ethermintd.log

I congratulate you, you have launched your own network on Celestia/

To make the Guess the Number game, follow the instructions below:

# Create and run a smart contract on your network [here](https://github.com/AndreyT25/Celestia-Rollup/tree/main/Contract)

# Create Claim Free Tokens if needed [here](https://github.com/AndreyT25/Celestia-Rollup/tree/main/Backend)

# Create a visualizer of your game [here](https://github.com/AndreyT25/Celestia-Rollup/tree/main/Frontend)


# The demo version can be viewed [here](http://207.244.225.191:8080/)
