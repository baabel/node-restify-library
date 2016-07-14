'use strict';
/**
 Abstraction of a REST api.  Handles the http protocol.
 Clients are passed objects from the request and
 return a payload and success indicator.

 Usage:

 var server = new RestApi(options);
 server.start();

*/

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorTypes = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
RestServer
*/

var RestServer = function () {

  /*
  Constructor.
  
  options parameter:
  Option          Type      Description
  certificate         String        If you want to create an HTTPS server, pass in the path
                                    to PEM-encoded certificate and key
  key                 String        If you want to create an HTTPS server, pass in the path
                                    to PEM-encoded certificate and key
  formatters          Object        Custom response formatters for res.send()
  log                 Object        You can optionally pass in a bunyan instance; not required
  name                String        By default, this will be set in the Server response header,
                                    default is restify 
  spdy                Object        Any options accepted by node-spdy
  version             String|Array  A default version to set for all routes
  handleUpgrades      Boolean       Hook the upgrade event from the node HTTP server, 
                                    pushing Connection: Upgrade requests through the regular request handling chain; defaults to false
  httpsServerOptions  Object        Any options accepted by node-https Server.
                                    If provided the following restify server options will be ignored: spdy, ca, certificate, key, passphrase, rejectUnauthorized, requestCert and ciphers; however these can all be specified on httpsServerOptions.
  authHandler         function      A function that handles the authentication process.
  routes              array         Array of routes for the rest interface
  
  */

  function RestServer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? { port: 3000, name: 'restapi' } : arguments[0];

    _classCallCheck(this, RestServer);

    this.server = null;
    this.authHandler = options.authHandler;
    this._create(options);
    if (options.routes) {
      this._setRoutes(options.routes);
    }
  }

  /*
  
    creates the rest server instance and optionally ataches authentication
    function.
  
  */


  _createClass(RestServer, [{
    key: '_create',
    value: function _create(options) {
      var _this = this;

      this.port = options.port;
      this.server = _restify2.default.createServer(this.options);
      server.use(restify.queryParser());
      // auth handler hook
      if (typeof this.authHandler === "function") {
        this.server.use(function (req, res, next) {
          var response = _this.authHandler(req);
          if (!response.success) {
            res.send(403);
            return;
          }
          next();
        });
      }
    }
    /**
      sets routes from a given array of routes
     */

  }, {
    key: '_setRoutes',
    value: function _setRoutes(routes) {
      var _this2 = this;

      if (!Array.isArray(routes)) throw new Error('illegal argument routes.');

      routes.map(function (route) {

        if (!_typeof(route.handler) === 'function') return;
        if (!_typeof(route.type) === 'string') return;
        switch (route.type) {
          case 'GET':
            _this2.get(route.url, route.handler);
            break;
          case 'POST':
            _this2.post(route.url, route.handler);
            break;
          case 'DELETE':
            _this2.del(route.url, route.handler);
            break;
          case 'PUT':
            _this2.put(router.url, route.handler);
            break;
        }
      });
    }

    /*
    start
    
    Starts the rest server
    
    */

  }, {
    key: 'start',
    value: function start() {

      this.server.listen(this.port, function () {
        return function () {
          return console.log('%s listening at %s', server.name, server.url);
        };
      });
    }

    /*
    get
    Adds a handler to GET requests for a give URL
    
    */

  }, {
    key: 'get',
    value: function get(url, callback) {
      var _this3 = this;

      this.server.get(url, function (req, res, next) {
        callback(Object.assign(req.params, req.query), function (error, apiResponse) {
          _this3._processResult(error, res, apiResponse);
          return next();
        });
      });
    }

    /*
    post
    Adds a handler to POST for a give URL
    
    */

  }, {
    key: 'post',
    value: function post(url, callback) {
      var _this4 = this;

      this.server.post(url, function (req, res, next) {
        callback(req.body, function (error, apiResponse) {
          _this4._processResult(res, error, apiResponse);
          return next();
        });
      });
    }
    /*
    put
    Adds a handler to PUT for a give URL
    
    */

  }, {
    key: 'put',
    value: function put(url, callback) {
      var _this5 = this;

      this.server.put(url, function (req, res, next) {
        callback(req.body, function (error, apiResponse) {
          _this5._processResult(res, error, apiResponse);
          return next();
        });
      });
    }

    /*
    del
    Adds a handler to DELETE for a give URL
    
    */

  }, {
    key: 'del',
    value: function del(url, callback) {
      var _this6 = this;

      this.server.del(url, function (req, res, next) {
        callback(req.body, function (error, apiResponse) {
          _this6._processResult(res, error, apiResponse);
          return next();
        });
      });
    }

    /*
    
      General processing of hanler responses
    */

  }, {
    key: '_processResult',
    value: function _processResult(httpRes, error, apiResponse) {
      if (error) {
        httpRes.send(500, error.message);
      } else httpRes.send(apiResponse);
    }
  }]);

  return RestServer;
}();

exports.default = RestServer;
var ErrorTypes = exports.ErrorTypes = {
  Authorization: Symbol("REST:Authorization"),
  Server: Symbol("REST:Server")
};