'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('next/node_modules/babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('next/node_modules/babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('next/node_modules/babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('next/node_modules/babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('next/node_modules/babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('next/node_modules/babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('next/node_modules/babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authApi = function authApi(method, url, csrf, data) {
  return (0, _axios2.default)({
    baseURL: '/api/auth',
    headers: { 'X-CSRF-TOKEN': csrf },
    method: method,
    url: url,
    data: data
  });
};
/**
 * A class to handle signing in and out and caching session data in sessionStore
 *
 * Note: We use XMLHttpRequest() here rather than fetch because fetch() uses
 * Service Workers and they cannot share cookies with the browser session
 * yet (!) so if we tried to get or pass the CSRF token it would mismatch.
 */

var Session = function () {
  function Session() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        req = _ref.req;

    (0, _classCallCheck3.default)(this, Session);

    this.session = {};
    try {
      if (req) {
        // If running on server we can access the server side environment
        this.session = {
          csrfToken: req.connection._httpMessage.locals._csrf
        };
        if (req.user) {
          this.session.user = req.user;
        }
        if (req.authToken) {
          this.session.authToken = req.authToken;
        }
      } else {
        // If running on client, attempt to load session from localStorage
        this.session = this.getLocalStore('session');
      }
    } catch (err) {
      console.log(err);
    }
  }

  (0, _createClass3.default)(Session, [{
    key: 'getSession',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(forceUpdate) {
        var _this = this;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(typeof window === 'undefined')) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', new _promise2.default(function (resolve) {
                  resolve(_this.session);
                }));

              case 2:

                if (forceUpdate === true) {
                  this.session = {};
                  this.removeLocalStore('session');
                }

                this.session = this.getLocalStore('session');

                if (!(this.session && (0, _keys2.default)(this.session).length > 0 && this.session.expires && this.session.expires > Date.now())) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return', new _promise2.default(function (resolve) {
                  resolve(_this.session);
                }));

              case 6:
                return _context.abrupt('return', new _promise2.default(function (resolve, reject) {
                  authApi('get', '/session').then(function (response) {
                    _this.session = response.data;
                    _this.session.expires = Date.now() + _this.session.clientMaxAge;
                    _this.saveLocalStore('session', _this.session);
                    resolve(_this.session);
                  }).catch(function (error) {
                    return reject(Error('XMLHttpRequest failed: Unable to get session'));
                  });
                }));

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getSession(_x2) {
        return _ref2.apply(this, arguments);
      }

      return getSession;
    }()
  }, {
    key: 'signin',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(username, password) {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt('return', new _promise2.default(function () {
                  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(resolve, reject) {
                    var csrf;
                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!(typeof window === 'undefined')) {
                              _context3.next = 2;
                              break;
                            }

                            return _context3.abrupt('return', reject(Error('This method should only be called on the client')));

                          case 2:
                            _context3.next = 4;
                            return Session.getCsrfToken();

                          case 4:
                            csrf = _context3.sent;

                            authApi('post', '/login', csrf, { username: username, password: password }).then(function () {
                              var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(response) {
                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                  while (1) {
                                    switch (_context2.prev = _context2.next) {
                                      case 0:
                                        if (!(response.status !== 200)) {
                                          _context2.next = 2;
                                          break;
                                        }

                                        return _context2.abrupt('return', reject(Error('XMLHttpRequest error: Unable to login')));

                                      case 2:
                                        _context2.next = 4;
                                        return _this2.getSession(true);

                                      case 4:
                                        _this2.session = _context2.sent;

                                        resolve(true);

                                      case 6:
                                      case 'end':
                                        return _context2.stop();
                                    }
                                  }
                                }, _callee2, _this2);
                              }));

                              return function (_x7) {
                                return _ref5.apply(this, arguments);
                              };
                            }()).catch(function (error) {
                              return reject(Error('Incorrect username or password.'));
                            });

                          case 6:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, _callee3, _this2);
                  }));

                  return function (_x5, _x6) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function signin(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return signin;
    }()
  }, {
    key: 'signout',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        var _this3 = this;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt('return', new _promise2.default(function () {
                  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(resolve, reject) {
                    return _regenerator2.default.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            if (!(typeof window === 'undefined')) {
                              _context5.next = 2;
                              break;
                            }

                            return _context5.abrupt('return', reject(Error('This method should only be called on the client')));

                          case 2:
                            _context5.next = 4;
                            return authApi('post', '/logout', _this3.session.csrfToken);

                          case 4:
                            _context5.next = 6;
                            return _this3.getSession(true);

                          case 6:
                            _this3.session = _context5.sent;

                            resolve(true);

                          case 8:
                          case 'end':
                            return _context5.stop();
                        }
                      }
                    }, _callee5, _this3);
                  }));

                  return function (_x8, _x9) {
                    return _ref7.apply(this, arguments);
                  };
                }()));

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function signout() {
        return _ref6.apply(this, arguments);
      }

      return signout;
    }()

    // The Web Storage API is widely supported, but not always available (e.g.
    // it can be restricted in private browsing mode, triggering an exception).
    // We handle that silently by just returning null here.

  }, {
    key: 'getLocalStore',
    value: function getLocalStore(name) {
      try {
        return JSON.parse(localStorage.getItem(name));
      } catch (err) {
        return null;
      }
    }
  }, {
    key: 'saveLocalStore',
    value: function saveLocalStore(name, data) {
      try {
        localStorage.setItem(name, (0, _stringify2.default)(data));
        return true;
      } catch (err) {
        return false;
      }
    }
  }, {
    key: 'removeLocalStore',
    value: function removeLocalStore(name) {
      try {
        localStorage.removeItem(name);
        return true;
      } catch (err) {
        return false;
      }
    }
  }], [{
    key: 'getCsrfToken',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt('return', new _promise2.default(function (resolve, reject) {
                  if (typeof window === 'undefined') {
                    return reject(Error('This method should only be called on the client'));
                  }

                  authApi('get', '/csrf').then(function (response) {
                    return resolve(response.data.csrfToken);
                  }).catch(function (error) {
                    return reject(Error('Unexpected response when trying to get CSRF token'));
                  });
                }));

              case 1:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getCsrfToken() {
        return _ref8.apply(this, arguments);
      }

      return getCsrfToken;
    }()
  }]);

  return Session;
}();

exports.default = Session;