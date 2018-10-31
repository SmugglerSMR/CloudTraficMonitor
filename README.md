# CAB432 Assignment 2 - Cloud Project

This Assignment contain second assignment for CAB432. Submission date set to *Monday, October 29 2018* with Weight *50%* of Unit. Task is Group bassed. For detail refer to CONTRIBUT

It requires to design a sophisticated mashup that draws upon a set of publicly  vailable services.

# Links usefull for this assignment
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-increase-availability.html



## Important Due Dates

* **Week11 - Proposal** -  - *Tuesday, October 9th* - Send One Page to Jacob Marks *marksj@qut.edu.au*

* **Week13 - Report Draft** -  - *Monday, October 22nd* - A more progressed version of draft.

* **Week14 - Final Submission** -  - *Monday, Octobeer 29th* - Completed report, code and tests, deployment and execution instructions.

## Getting Started

Project based of Week9 and Week10 exercises. This is separated repository from Report itself. It uses Overleaf environment. But pain from using JavaScript - uncomparable.

WARNING: It is crutial to update Vode to latest version, canvac will not work due to error accured week ago.
## Prerequisites
Node version:
```
~$: nvm install 8.12.0
~$: node -v
v8.12.0
```
npm version:
```
~$: npm -v
6.4.0
```
### Installation
sudo ./install-node_8.12.0.sh
```
git clone https://github.com/SmugglerSMR/CAB432-assgn2.git
cd CAB432-assgn2
npm install
```
## Deployment
Run project (app.js) and use browser to view Projects.
```
npm start
```

Run test script to visualise status of API
```
npm test
```

## Additional steps and instructions taken.

1) Creating an IAM role with ElasticLoadBalancing ROle.
2) Add permision to intaller script
3) Install make, python, gcc, g++
4) nvm: curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
4) npm install aws-sdk
5) Get API keys = 


# Instance working
Starting new instance.
Crete load Balancer
Autoscaling group


# Create Autoscaler Group
We created Instance, setp everything.
When created image and set a new configuration from it.

After performed all those steps before.

1) Add intances. ANd connect with PEM key.
Use Image for quich configuration launc.
In autoScalingGroup select Advanced Details and Load Balancing. Choose Target manually.

2)
sudo apt install curl python-software-properties
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install nodejs

# Create new Load balancer



## Connecting.
Project should be running now.
Check it on following adress:
```
127.0.0.1:3000
```







## Built With

* [GitHub](https://github.com/SmugglerSMR/CAB432-assgn2) - Storage Location for repository
* [Latex-Overleaf](https://www.overleaf.com/project/5bbaef9b5da0456215f7b261) - Report written using Latex

## Contributing

Please read [CONTRIBUTING.md](https://github.com/) too see how many my OS's girls participated in writing.

## Authors
* **Floyd Creevey** - *Student* - [Email](floyd.creevey@connect.qut.edu.au)

* **Marat Sadykov** - *Student* - [Email](marat.sadykov@connect.qut.edu.au)
## License

This project is licensed under the Eclipse License - see the [LICENSE](LICENSE) file for details

## Acknowledgments
* All regards to lecturer.