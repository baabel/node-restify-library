'use strict'
/*
 Abstraction of a REST api.  Handles the http protocol.
 Clients are passed objects from the request and
 return a payload and success indicator.

 Usage:

 var server = new RestApi(options);
 server.start();

*/

import Restify from 'restify';


class RestServer {


/*
Constructor.

options parameter:
Option			Type		Description
certificate		String		If you want to create an HTTPS server, pass in the path
							to PEM-encoded certificate and key
key				String		If you want to create an HTTPS server, pass in the path
							to PEM-encoded certificate and key
formatters		Object		Custom response formatters for res.send()
log				Object		You can optionally pass in a bunyan instance; not required
name			String		By default, this will be set in the Server response header,
							default is restify 
spdy			Object		Any options accepted by node-spdy
version			String|Array	A default version to set for all routes
handleUpgrades	Boolean		Hook the upgrade event from the node HTTP server, 
							pushing Connection: Upgrade requests through the regular request handling chain; defaults to false
httpsServerOptions	Object	Any options accepted by node-https Server.
							If provided the following restify server options will be ignored: spdy, ca, certificate, key, passphrase, rejectUnauthorized, requestCert and ciphers; however these can all be specified on httpsServerOptions.
authHandler		function 	A function that handles the authentication process.

*/
	constructor(options) {
		this.server = null;
		this.authHandler = options.authHandler;
		this._create(options);
	}

/*

	creates the rest server instance and optionally ataches authentication
	function.

*/
	_create(options) {
		this.server = restify.createServer(this.options);
		// auth handler hook
		if(typeof(this.authHandler) === "function") {
			this.server.use((req, res, next) => {
				let response = this.authHandler(req);
				if(!response.success) {
					res.send(403);
					return;
				}
				next();
			});
		}
	}

/*
start

Starts the rest server

*/
	start() {
		if(this.server == null) create();
		this.server.listen(config.port, () => () => console.log('%s listening at %s', server.name, server.url));
	}

/*
get
Adds a handler to GET requests for a give URL

*/
	get(url, callback) {
		
		server.get(url, (req, res, next) => {
			callback(req.body, (apiResponse) => {
				this._processResult(res, apiResponse);
				return next();
			});
		});
	}

/*
post
Adds a handler to POST for a give URL

*/
	post(url, callback) {
		server.post(url,(req, res, next) => {
			callback(req.body, (apiResponse) => {
				this._processResult(res, apiResponse);
				return next();
			});
		});
	}
/*
put
Adds a handler to PUT for a give URL

*/
	put(url, callback) {
		server.put(url, (req, res, next) => {
			callback(req.body, (apiResponse) => {
				this._processResult(res, apiResponse);
				return next();
			});
		});
	}

/*
del
Adds a handler to DELETE for a give URL

*/
	del(url, callback) {
		server.del(url, (req, res, next) => {
			callback(req.body, (apiResponse) => {
				this._processResult(res, apiResponse);
				return next();
			});
		});
	}

/*

	General processing of hanler responses
*/
	_processResult(httpRes, apiResponse) {

	}
}

export default RestServer;