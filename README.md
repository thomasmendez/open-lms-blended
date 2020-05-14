# Open-LMS-Blended

An open source learning management system intended for K-12 educational institutions

## Overview

This web application was developed to simplify the sharing of educational resources
between teachers, students, and parents for both inside and outside of classroom environments. 

Teachers are able to create an account in the application and create courses that 
viewers can see on their webpage. The layout and navigation is simple enough for 
all age groups, and the courses have the following pre-made sections that teachers 
can view and edit:

* Syllabus
* Schedule
* Assignments
* Lecture Notes
* Class Notes
* Other Notes

Teachers can set the semester they are teaching, create multiple courses if needed, and archive
the courses at the end of the semester to preserve all of their previous course information 
for future reference if needed. 

## Setup

In order to create this application and get it running on the internet, you would first need to 
create an account with one of the following cloud service providers if you haven't already and follow the appropriate instructions for it.

This table breaks down important information that would be needed in order to understand which
cloud service provider would be ideal to fit your needs. 

<table>
    <tr>
        <th>Cloud Service Provider</th>
        <th>vCPUs</th>
        <th>Memory (GiB)</th>
        <th>Price</th>
        <th>Setup Tutorial</th>
    </tr>
    <tr>
        <td><a href="https://signin.aws.amazon.com/signin?redirect_uri=https%3A%2F%2Fconsole.aws.amazon.com%2Fconsole%2Fhome%3Fstate%3DhashArgs%2523%26isauthcode%3Dtrue&client_id=arn%3Aaws%3Aiam%3A%3A015428540659%3Auser%2Fhomepage&forceMobileApp=0&code_challenge=7iU1T0eFK1lmkw7bTsE53WiCGqGc4hStzuACzMDOd-k&code_challenge_method=SHA-256">Amazon Web Services (AWS)</a></td>
        <td>1</td>
        <td>1</td>
        <td><a href="https://aws.amazon.com/ec2/instance-types/t2/">$0.0116/hr</a></td>
        <td><a href="https://github.com/thomasmendez/open-lms-blended/blob/master/AWS.md">AWS Setup</a></td>
    </tr>
    <tr>
        <td><a href="https://www.digitalocean.com/">Digital Ocean</a></td>
        <td>1</td>
        <td>1</td>
        <td><a href="https://www.digitalocean.com/pricing/">$5/mo or $0.007/hr</a></td>
        <td><a href="https://github.com/thomasmendez/open-lms-blended/blob/master/DIGITALOCEAN.md">Digital Ocean Setup</a></td>
    </tr>
</table>

*Note: Date information was updated 5/4/2020*

*Note: Some cloud service providers offer promotional offers when signing up and can help reduce the cost of running this application. The cheapest and most affordable services are used in the building and maintainance of this application. Anything else that could be used in the application (e.g domain name, 
SSL certificates) is not included here.*

Once you have setup an account with the desired cloud service provider, click on the corresponding tutorial link to get started on deploying the application live. 

## Built With

Open-LMS-Blended was created using the MERN (MongoDB-Express-React.js-Node.js) stack, a free and open-source JavaScript software stack for creating single page applications. 

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

Open-LMS-Blended is provided freely as open source software, under the GNU General Public License - see the [GNU General Public
License](https://github.com/thomasmendez/open-lms-blended/blob/master/LICENSE) file for details
