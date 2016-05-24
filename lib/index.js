'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _events2 = require('events');

var _events3 = _interopRequireDefault(_events2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_events) {
  _inherits(_class, _events);

  function _class(url, model, id) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));

    _this.url = url;
    _this.model = model;
    _this.id = id;
    _this.connected = false;
    _this.socket = (0, _socket2.default)(url);
    _this.socket.on('connect', function () {
      _this.identify().then(function () {
        _this.connected = true;
        _this.emit('connect');
      }).catch(function (err) {
        _this.emit('error', 'Identification error');
      });
    });
    _this.socket.on('disconnect', function () {
      _this.connected = false;
      _this.emit('disconnect');
    });
    _this.socket.on('update', function (req) {
      _this.update(req);
    });
    return _this;
  }

  _createClass(_class, [{
    key: 'identify',
    value: function identify() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var params = { model: _this2.model, id: _this2.id };
        console.log(params);
        _this2.socket.emit('identify', params);
        _this2.socket.once('identify', function (msg) {
          console.log(msg);
          if (!msg.error) {
            if (msg.new) {
              _this2.id = msg.id;
              _this2.emit('id', _this2.id);
            }
            resolve();
          } else {
            reject();
          }
        });
      });
    }
  }, {
    key: 'send',
    value: function send(e, d, to) {
      var params = { e: e, d: d, to: to };
      this.socket.emit('update', params);
    }
  }, {
    key: 'open',
    value: function open(pin) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.socket.emit('open', pin);
        _this3.socket.once('open', function (res) {
          if (res == true) {
            resolve();
          } else {
            reject();
          }
        });
      });
    }
  }, {
    key: 'link',
    value: function link(pin) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        if (_this4.connected) {
          _this4.socket.emit('link', pin);
          _this4.socket.once('link', function (res) {
            if (res) {
              resolve(res);
            } else {
              reject(res);
            }
          });
        } else {
          reject();
        }
      });
    }
  }, {
    key: 'update',
    value: function update(params) {
      this.emit(params.e, params.d);
    }
  }]);

  return _class;
}(_events3.default);

exports.default = _class;