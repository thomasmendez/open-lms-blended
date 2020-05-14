# Open-LMS-Blended 

## AWS Setup

### Sign Up / Login

If you haven't done so already, please sign into the AWS Management Console at [https://aws.amazon.com/console/](https://aws.amazon.com/console/). If you don't have an account yet click the "Create a Free Account" button and follow the prompts.

After creating an account or successfully logging into your AWS account, please follow the following steps to start the web application live on the internet.

### Create a new Ubuntu Server on AWS EC2

Before doing anything we need a server that we can work on, follow these steps to spin up a new Ubuntu 18.04 server instance on AWS EC2.

1. Go to the EC2 Service section.

2. Click the "Launch Instance" button.

3. Choose AMI - Check the "Free tier only" checkbox, enter "Ubuntu" in search box and press enter, then select the "Ubuntu Server 18.04" Amazon Machine Image (AMI).

4. Choose Instance Type - Select the "t2.micro" (Free tier eligible) instance type and click "Configure Security Group" in the top menu.

5. Configure Security Group - Add a new rule to allow HTTP traffic then click "Review and Launch".

6. Review - Click Launch

7. Select "Create a new key pair", enter a name for the key pair (e.g. "my-aws-key") and click "Download"

8. Key Pair" to download the private key, you will use this to connect to the server via SSH.

9. Click "Launch Instances", then scroll to the bottom of the page and click "View Instances" to see details of the new Ubuntu EC2 instance that is launching.

### Connect to Ubuntu EC2 Instance via SSH

Once the EC2 instance reaches a running state you can connect to it via SSH using the private key downloaded in the previous step.

1. Open a terminal window and update the permissions of the private key file with the command ```chmod 400 <path-to-key-file>``` e.g. ```chmod 400 ~/Downloads/my-aws-key.pem```, the key must not be publicly viewable for SSH to work.
2. Copy the "Public DNS (IPv4)" property from the instance description tab in the AWS Console, then connect to the instance from the terminal window with the command ```ssh -i <path-to-key-file> ubuntu@<domain name>``` e.g. ```ssh -i ~/Downloads/my-aws-key.pem ubuntu@ec2-52-221-185-40.ap-southeast-2.compute.amazonaws.com```
3. Enter yes to the prompt "Are you sure you want to continue connecting (yes/no)?" to add the url to your list of known hosts.

*NOTE: If you're using Windows you can connect to your instance via SSH using the PuTTY SSH client, for instructions see [Connect Using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html?icmpid=docs_ec2_console) in the AWS docs.*

### Git Clone This Repository

Git clone the project to the instance 
```git clone https://github.com/thomasmendez/open-lms-blended.git```

### Setup Web Server with Node.js + MongoDB + NGINX

The below command executes a script to automatically setup and configure a production ready MERN Stack web server on Ubuntu that includes Node.js, MongoDB, PM2, NGINX and UFW.

While connected to the new AWS EC2 instance in the terminal window, run the following command:
```sudo bash ./open-lms-blended/ubuntu_setup/shell/manual/install.sh```

### Setup Environment Variables

Navigate to the cloned directory ```cd open-lms-blended```

Setup the correct environment variables in the .env file for this directory. Run this command to edit the prod.env file using the nano editor and save it as the .env file.
```
sudo nano .prod.env
```

The following instructions will show the main ENV variables that would need to be configured to have the application run properly. 

*NOTE: To naviagate the file and make changes use the arrow keys *

#### Environment 

Setup the correct environment to run the applicaiton. The ENV variable can be set to 'development', 'staging', or 'production'. Since we are going to deploy our application live on the AWS EC2 Instance, we will set it to 'production' like so (since we are editing the .prod.env file this is already done for you).
```
ENV='production'
```

#### API Access

In order to make sure that our application can obtain the correct information needed you will have to make sure that the following environment variables are set correctly. 

* HTTP - Can be 'http' or 'https' depending on how whether or not the application is already set to be secured or not. Recommended default for this example is 'http'.

* DOMAIN_NAME - Is the domain name of where users can access the app. In development it is set to 'localhost' but in production we will use the Public DNS (IPv4) address you obtain from the EC2 Instance. 

* INSTITUTION_NAME - Name for the school or institution 

* PORTS (NODE_PORT/REACT_APP_PORT) - Modify the ```NODE_PORT``` and ```REACT_APP_PORT``` if needed.

* NODE_API_URL - Set the api url that will be used to retrieve information from the node server. It can be practically anything, but for simplicity it is currently set to ```NODE_API_URL='/api'```.

* NODE_EMAIL_SERVICE - Is the email service that will be used in order to send emails to user accounts. Some examples of email services include ```Gmail```, ```Yahoo```, ```iCloud```. The full list of valid email service providers can be found [here](https://nodemailer.com/smtp/well-known/). 
*Note: This uses the [Nodemailer](https://nodemailer.com/about/) npm package to send email through Node.js*

* NODE_EMAIL_USERNAME - Your username for your email (recommended to use a no-reply email)

* NODE_EMAIL_PASSWORD - Your password for your email username (please take proper precaution in keeping this secured)

* NODE_MONGODB_URI - Set the correct connection to access the MongoDB database if needed. The current default is ```'mongodb://localhost:27017/open-lms-blended'```.

#### Security

Change the ```NODE_SESSION_SECRET="YOUR SESSION SECRET"``` and ```NODE_COOKIE_SECRET="YOUR COOKIE SECRET"``` to something like ```NODE_SESSION_SECRET="574hh4@#198jrh18941!#$1"``` and ```NODE_COOKIE_SECRET="3271fh1he!^@!"``` (Please do not copy and paste these! Type your own random strings!) since these will be used to create a hash and secure a user's session and cookies so that their data cannot be easily exposed. Please maintain these in the .env file or in a much secure location and do not allow anyone to easily access these. 

#### Save 

Your final .env file should look something similar to this

```
# common
ENV='production'
HTTP_TYPE='http'
DOMAIN_NAME='ec2-3-19-246-200.us-east-2.compute.amazonaws.com/'
INSTITUTION_NAME='Open LMS Blended School'

# node.js
NODE_PORT=3001

NODE_SESSION_SECRET="574hh4@#198jrh18941!#$1"
NODE_COOKIE_SECRET="fjafjoiewufovoajfasjdf"

NODE_API_URL='/api'

NODE_EMAIL_SERVICE='gmail'
NODE_EMAIL_USERNAME='username@gmail.com'
NODE_EMAIL_PASSWORD='password'

MONGODB_URI='mongodb://localhost:27017/open-lms-blended'

# react.js 
REACT_APP_PORT=3000
```

To save in nano press control+X, press Y to save, and change the file name from .prod.env to .env

### Set Tab Name for Application

#### Modify index.html

In order to make sure that the name of the website will be displayed correctly as a tab, change the index.html file located in the src/public directory like so
```sudo nano src/public/index.html```

The only section that you need to change in the file is this
```<title>Open LMS Blended</title>```

In between the ```<title>  </title>``` tags, write down the name that you wish to be displayed when a user looks at the tab and save the updated file.

### Build React App & Start the Server

1. Build the react app. 

```
sudo npm run build
```

2. Start the node server using pm2

```
sudo pm2 start ./src/server/bin/www
```

### Configure NGINX to serve the Node.js API and React front-end

Configure NGINX to serve the React on the front-end and the Node.js API on the backend. Modify the default configuration by deleting the old configuration with ```sudo rm /etc/nginx/sites-available/default``` and creating a new one ```sudo nano /etc/nginx/sites-available/default```

Depending on the environment variables used in NODE_PORT and NODE_API_URL your configuration might be slighly different, but if we follow the defaults for this application the configuraiton would look like this. 

```
server {
  listen 80 default_server;
  server_name _;

  # react app & front-end files
  location / {
    root /home/ubuntu/open-lms-blended/dist;
    try_files $uri /index.html;
  }

  # node api reverse proxy
  location /api/ {
    proxy_pass http://localhost:3001/;
  }
}
```

Make sure you save the file in the correct directory and keep the filename as default like so ```/etc/nginx/sites-available/default```

Restart NGINX since we modified the default config file with ```sudo systemctl restart nginx``` to apply the changes. 

Quick breakdown of the NGINX configuration file:

* Server will be listening to port 80 (defualt port for EC2 Instance to allow users to access it)
* ```location /``` is the locaiton of the html files we will be using (it is going to be the final build)
* ```location /api/``` will be what NGINX will look for when fetch request are made and will send the request to our desired proxy server, which is where our node js server is running

*Note: If you ever made a mistake in following these steps or you edited some files from the default project, you can always run the following commands to update certain parts of the web application*

* ```sudo npm run build``` - to update any files that the front-end application uses (e.g, React Components, index.html, webpack)
* ```sudo pm2 stop ./src/server/bin/www``` / ```sudo pm2 start ./src/server/bin/www``` - to start / stop the Node.js server
* ```sudo systemctl restart nginx``` - To restart nginx (update changes to the /etc/nginx/sites-available/default file)

### Test Application 

Access the Instance's Public DNS (IPv4) on your browser by copying and pasting the link in your browser's address bar. Check to make sure all the functionallty that works on a dev environment works in the produciton environment (it should). The application should also be fully funcitonal on mobile browsers (fetch apis don't work well for mobile in development environments for security reasons but work in production).

## Unit Testing

Unit testing is done with the javascript framework Mocha and the Chai javascript assertion library. To test React components, the Enzyme library was used.

In terminal where lms-blended-app-private folder is located run```sudo npm test``` to view the test that the web application has. 

#### Inviting Users

If you want to invite users to the application, they would need to obtain a code in order to sign up. In order to generate one and send it to an email address run ```sudo npm run inviteUser``` in the ```/home/ubuntu/open-lms-blended``` directory (if you are not in that directory, use ```cd /home/ubuntu/open-lms-blended```). The following prompt should show up. 

```
prompt: Email of user you wish to invite to sign up:
```

Simply enter the email address you wish to send it to and they should receive it within a couple of seconds. 

```
prompt: Email of user you wish to invite to sign up: invitedUser@gmail.com
email invitation was sent to invitedUser@gmail.com!
```

#### Deleting Users

If for any reason, you believe that a user should be completly removed from the application (uninvited users or uses who break your organizations rules). You are able to easily remove them by running ```sudo npm run deleteUser``` in the ```/home/ubuntu/open-lms-blended``` directory (if you are not in that directory, use ```cd /home/ubuntu/open-lms-blended```). The following prompt should show up. 

```
prompt: Username of user you wish to delete:
```

You will have to confirm you want to delete the user by typing and entering "Yes", "yes", "Y", or "y". Leaving it blank or entering "No", "no", "N", or "n" would cancel the attempted deletion. 

```
prompt: Username of user you wish to delete: userToDelete
prompt: Are you sure? (yes/no): yes
Successfully deleted user
```

## Built With

Open-LMS-Blended was created using the MERN (MongoDB-Express-React-Node.js) stack, a free and open-source JavaScript software stack for creating single page applications. 

Backend

* [Node.JS](https://nodejs.org/en/) - Back End Scripting Language
* [Express](https://expressjs.com/en/api.html) - Web Application Framework for Node.js
* [Passport](http://www.passportjs.org/) - Authentication Middleware for Node.js.

* [MongoDB](https://www.mongodb.com/) - NoSQL Database
* [Mongoose](https://mongoosejs.com/docs/) - Object Data Modeling (ODM) library for MongoDB and Node.js

Frontend

* [React.js](https://reactjs.org/) - Javascript Library 
* [React Bootstrap](https://react-bootstrap.github.io/) - Bootstrap (CSS Library/Framework) for React.js

Others

* [Babel](https://babeljs.io/docs/en/) - Javascript Compiler
* [Webpack](https://webpack.js.org/concepts/) - Static Module Bundler

Unit Testing

* [Mocha](https://mochajs.org/) - JavaScript Test Framework
* [Chai](https://www.chaijs.com/) -  BDD / TDD Assertion Library
* [Enzyme](https://enzymejs.github.io/enzyme/) - JavaScript Testing Utility for React

Ubuntu Server Software

* [PM2](https://pm2.keymetrics.io/) - Production Process Manager for Node.js
* [NGINIX](https://www.nginx.com/) - Web Server
* [UFW](https://help.ubuntu.com/community/UFW) - Program for Managing a Netfilter Firewall 

## Authors

* **Thomas Antonio Mendez** - *Initial work* 

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/thomasmendez/lms-app/blob/master/LICENSE) file for details
