#!/bin/bash
sudo apt update -y && apt install \
    make \
    python \
    gcc \
    g++ \
    curl \
    git


curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install nodejs
