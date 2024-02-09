## node-https-proxy

#### This is simple express proxy web server using https protocol.
Follow this guide and usage example for quick start.

1. Install package in your application
`
npm install node-https-proxy
`
2. Write code in your entry point code section

```javascript
const createProxy = require("node-https-proxy");
const fs = require("fs");

// https server security configuration
const  privateKey  =  ;
const  certificate  =  ;

// proxy setup configuration
const passphrase = 
const target = 
const whitelist = 

// create proxy server
const proxy = createProxy({
    target: 'https://google.com',                               //target address to serve
    whitelist: ['0.0.0.0', '95.180.41.194'],                    // ip list allowed access to proxy service
    passphrase: 'your custom password',                         //security key
    privateKey: fs.readFileSync('./secure/key.pem', 'utf-8'),   // https server private key
    certificate: fs.readFileSync('./secure/cert.pem', 'utf-8'), // https server certificate,
});

// host proxy
proxy.listen((port, host) => {
	console.log(`https proxy server is running on port ${port} and host ${host}`)
})

```
