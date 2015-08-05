The DNRDW Project
-----------------

This is a small web application that uses Bootstrap/ReactJS for frontend and Nodejs for backend. It serves as a starting point for make web application with similar structure.

On deployment, this webapp can be packaged into docker containers and then deployed to AWS. The docker build information is in the build folder.


Get Started
-----------

```
npm install 
npm start
```

Visit website at  http://localhost:8080


WebApp Setting
--------------

The web server setting is controlled via environment variables.
For more information, see site/support/install.txt.

The setting can be specified by a site/setting.js file as well.
An example file is available at site/support/setting.js.

The following command changes website port number from default 8080 to 8050:

```
export LEAPBASE_HTTP_PORT=8050
```
