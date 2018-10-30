#!/bin/bash
export NODE_VERSION=8.12.0
export NODE_DOWNLOAD_URL=https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION.tar.gz

wget "$NODE_DOWNLOAD_URL" -O node.tar.gz
tar -zxvf node.tar.gz
cd node-v$NODE_VERSION
./configure
make -j `nproc`
sudo make -j `nproc` install

sudo chown ${USER} -R /usr/local/lib/node_modules
sudo chown ${USER} -R /usr/local/bin
sudo chown ${USER} -R /usr/local/share

cd ..
npm u -g npm
npm i -g npm

rm -rf node-v$NODE_VERSION
rm node.tar.gz

node --version
npm --verion
