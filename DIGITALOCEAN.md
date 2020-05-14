# Open-LMS-Blended

## Digital Ocean Setup

### Sign Up / Login

If you haven't done so already, please sign into the Digital Ocean Console at [https://cloud.digitalocean.com/login](https://cloud.digitalocean.com/login). If you don't have an account yet click the "Sign Up" button and follow the prompts.

If this is your first time signing up, then you will be asked to create a new project. Give the new project a proper name and select the proper technologies that we will be using (list can be found in the bottom of the [README.md](https://thomasmendez.github.io/open-lms-blended/) file).

After creating an account or successfully logging into your Digital Ocean account, please follow the following steps to start the web application live on the internet. 

### Create a new Ubuntu Server using a Digital Ocean Droplet

Before doing anything we need a server that we can work on, follow these steps to spin up a new Ubuntu 18.04.3 (LTS) x64 Droplet

1. Click "New Droplet" or select the Droplet tab on the left

2. Choose Image - Select "Ubuntu 18.04.3 (LTS) x64"

3. Choose a Plan - Select "Standard"

4. Choose a Plan - Select "$5/mo $0.007/hour" 

*NOTE: By default it is set to "$40/mo $0.060/hour", please DO NOT SELECT THIS OPTION for this tutorial. There are lower priced plans if you show the plans that are hidden to the left.*

5. Choose a Datacenter Region - Select a location where the server will be run, depending on your location you would want to select the one you are closest to. (My example will be using San Fransisco)

6. VPC Network - Select "default-sfo2"

7. Select Additional Options - Make sure "IPv6" and "Monitoring" are checked

8. Authentication - Choose "SSH Keys" and click on "New SSH Key". Follow the appropriate instructions to generate the SSH Key for your operating system. Instead of using an SSH key, there is also an option that uses a one-time password that is sent to your email (less secure).

9. Finalize and Create - Keep the hostname or rename it to something easier, and only one Droplet is nessesary

10. Select Project - Make sure the correct project is selected

11. Click Create Droplet

### Connect to Ubuntu Droplet via SSH

Once the Droplet reaches a running state you can connect to it via SSH using the private key downloaded in the previous step.

1. Open a terminal window (or use the same one that created the ssh key) 

2. Navigate to were your ssh key is located (skip this step if you selected email for verification)

3. Copy the ipv4 address (follows XXX.XXX.XXX.XXX pattern) from the Droplet, then connect to the Droplet by running the following command (if you are using your public key from Authentication step 8) ```ssh -i <path-to-key-file> root@<your-Droplet-ipv4-address>``` e.g ```ssh -i digital-ocean-mac1 root@157.245.170.223``` or if you are using the password you received from the email, use ```ssh root@157.245.170.223``` and you will be asked to enter the password for it.

4. Enter yes to the prompt "Are you sure you want to continue connecting (yes/no)?" to add the url to your list of known hosts.

*NOTE: If you're using Windows you can connect to your instance via SSH using the PuTTY SSH client, for instructions see [Connect Using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html?icmpid=docs_ec2_console) in the AWS docs.*

### Git Clone This Repository

1. Navigate to the home directory by using ```cd /home``` (by default you will be at the /root directory when you connect to the Droplet, we do not want to place our project here)

2. Make a new directory at the /home and call it ubuntu by using the following command ```mkdir ubuntu```

3. Use ```cd ubuntu``` to navigate to the newly created ubuntu folder

4. Git clone the project to the ubuntu folder 
```git clone https://github.com/thomasmendez/open-lms-blended.git```

### Setup Web Server with Node.js + MongoDB + NGINX

The below command executes a script to automatically setup and configure a production ready MERN Stack web server on Ubuntu that includes Node.js, MongoDB, PM2, NGINX and UFW.

While connected to the new Droplet in the terminal window, run the following command in the /home/ubuntu directory:
```sudo bash ./open-lms-blended/ubuntu_setup/shell/manual/install.sh```

### Setup Environment Variables

Navigate to the cloned directory ```cd open-lms-blended```

Setup the correct environment variables in the .env file for this directory. Run this command to edit the prod.env file using the nano editor and save it as the .env file.
```
sudo nano .prod.env
```

The following instructions will show the main ENV variables that would need to be configured to have the application run properly. 

*NOTE: To naviagate the file and make changes use the arrow keys*

#### Environment 

Setup the correct environment to run the applicaiton. The ENV variable can be set to 'development', 'staging', or 'production'. Since we are going to deploy our application live on the AWS EC2 Instance, we will set it to 'production' like so (since we are editing the .prod.env file this is already done for you).
```
ENV='production'
```

#### API Access

In order to make sure that our application can obtain the correct information needed you will have to make sure that the following environment variables are set correctly. 

* HTTP - Can be 'http' or 'https' depending on how whether or not the application is already set to be secured or not. Recommended default for this example is 'http'.

* DOMAIN_NAME - Is the domain name of where users can access the app. In development it is set to 'localhost' but in production we will use the ipv4 address you obtain from the Droplet. 

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
DOMAIN_NAME='157.245.170.223'
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

* Server will be listening to port 80 (defualt port for Droplet to allow users to access it)
* ```location /``` is the locaiton of the html files we will be using (it is going to be the final build)
* ```location /api/``` will be what NGINX will look for when fetch request are made and will send the request to our desired proxy server, which is where our node js server is running

*Note: If you ever made a mistake in following these steps or you edited some files from the default project, you can always run the following commands to update certain parts of the web application*

* ```sudo npm run build``` - to update any files that the front-end application uses (e.g, React Components, index.html, webpack)
* ```sudo pm2 stop ./src/server/bin/www``` / ```sudo pm2 start ./src/server/bin/www``` - to start / stop the Node.js server
* ```sudo systemctl restart nginx``` - To restart nginx (update changes to the /etc/nginx/sites-available/default file)

### Test Application 

Access the Droplet's ipv4 address on your browser by copying and pasting the link in your browser's address bar. Check to make sure all the functionallty that works on a dev environment works in the produciton environment (it should). The application should also be fully funcitonal on mobile browsers (fetch apis don't work well for mobile in development environments for security reasons but work in production).

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
prompt: Are you sure? (yes/no):  
```

## Unit Testing

Unit testing is done with the javascript framework Mocha and the Chai javascript assertion library. To test React components, the Enzyme library was used.

In terminal where lms-blended-app-private folder is located run```sudo npm test``` to view the test that the web application has. 

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
