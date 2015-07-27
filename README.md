The Docker-Node-React-Demo-Webapp Project
-----------------------------------------

A demo webapp using ReactJS frontend and Nodejs backend. The short name is DNRDW.

This webapp is packaged into docker container and then deployed to AWS.


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