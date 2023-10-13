#!/bin/bash

### For clean mac machine ###

### Install Library ###
sudo apt-get update

### Install nodejs 18.0.0 LTS ###
WORKDIR=$(pwd)
NODE_VERSION="v18.0.0"
NODE_FILENAME="node-$NODE_VERSION-linux-x64"
PARENT_LOCATION="/opt/nodejs"

### Download NodeJS ###
cd /usr/local/src
sudo wget -nc http://nodejs.org/dist/$NODE_VERSION/$NODE_FILENAME.tar.gz
#wget -E -H -k -K -p http:///
sudo tar zxvf $NODE_FILENAME.tar.gz
rm -f $NODE_FILENAME.tar.gz
sudo mkdir -p $PARENT_LOCATION
sudo mv $NODE_FILENAME $PARENT_LOCATION/

### Link binary files ###
rm -f /usr/local/bin/node
rm -f /usr/local/bin/npm
sudo ln -s $PARENT_LOCATION/$NODE_FILENAME/bin/node /usr/local/bin
sudo ln -s $PARENT_LOCATION/$NODE_FILENAME/bin/npm /usr/local/bin

### assign 80 & 443 port ###
sudo setcap 'cap_net_bind_service=+ep' $PARENT_LOCATION/$NODE_FILENAME/bin/node

### chage to intergration-test folder ###
cd WORKDIR

### Install npm packages ###
npm install

### Install playwright browser ###
npx playwright install --with-deps chromium

### Install metamask ###
wget https://github.com/MetaMask/metamask-extension/releases/download/v11.0.0/metamask-chrome-11.0.0.zip && unzip metamask-chrome-11.0.0.zip -d metamask-chrome-11.0.0 && rm -rf metamask-chrome-11.0.0.zip