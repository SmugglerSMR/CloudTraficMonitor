#!/bin/bash
sudo apt update -y && apt install -y \
    make \
    python \
    gcc \
    g++ \
    curl \
    git


curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install nodejs

npm install

sudo npm install -g pm2

pm2 start npm -- start

pm2 startup systemd

sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu