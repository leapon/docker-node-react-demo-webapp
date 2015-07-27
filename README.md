docker-node-react-demo-webapp
-----------------------------

A demo webapp using ReactJS frontend and Nodejs backend.

This webapp is packaged into docker container and then deployed to AWS.


Get Started
-----------

```
npm install 
npm start
```

Visit website at  http://localhost:8080


Setting
-------

The web server setting is controlled via environment variables.
For more information, see site/support/install.txt.

The setting can be specified by a site/setting.js file as well.
An example file is available at site/support/setting.js.

```
export LEAPBASE_HTTP_PORT=8050
```