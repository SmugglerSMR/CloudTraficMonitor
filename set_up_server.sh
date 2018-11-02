#!/bin/bash
sudo apt update -y && sudo apt install -y \
    make \
    python \
    gcc \
    g++ \
    mc \
    curl \
    git


sudo curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install -y nodejs

npm install

sudo rm -R node_modules

npm isntall

sudo npm install -g pm2

sudo pm2 start npm -- start

sudo pm2 startup systemd

sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu