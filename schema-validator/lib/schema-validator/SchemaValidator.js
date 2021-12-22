"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  makeMissingMessage: true,
  makeInvalidMessage: true
};
exports.makeMissingMessage = exports.makeInvalidMessage = exports["default"] = void 0;

var _ISchemaValidator = require("./ISchemaValidator");

Object.keys(_ISchemaValidator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _ISchemaValidator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ISchemaValidator[key];
    }
  });
});

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var AppSchemaValidator = /*#__PURE__*/function () {
  function AppSchemaValidator() {
    _classCallCheck(this, AppSchemaValidator);
  }

  _createClass(AppSchemaValidator, [{
    key: "validate",
    value: function () {
      var _validate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(schema, body) {
        var _this = this;

        var params;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.sanitize(schema, body);
                params = {};
                _context2.next = 4;
                return Promise.all(Object.keys(schema.properties).map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(field) {
                    var _schema$properties$fi, type, description, value, IsTypeValid;

                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _schema$properties$fi = schema.properties[field], type = _schema$properties$fi.type, description = _schema$properties$fi.description;
                            value = body[field];

                            if (!(value === null)) {
                              _context.next = 6;
                              break;
                            }

                            if (schema.required.includes(field)) {
                              _context.next = 5;
                              break;
                            }

                            return _context.abrupt("return");

                          case 5:
                            return _context.abrupt("return", params[field] = makeMissingMessage(description || field));

                          case 6:
                            _context.next = 8;
                            return _this.checkType(value, type);

                          case 8:
                            IsTypeValid = _context.sent;

                            if (!(IsTypeValid === false)) {
                              _context.next = 11;
                              break;
                            }

                            return _context.abrupt("return", params[field] = makeInvalidMessage(description || field));

                          case 11:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x3) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 4:
                return _context2.abrupt("return", Object.keys(params).length > 0 ? params : null);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function validate(_x, _x2) {
        return _validate.apply(this, arguments);
      }

      return validate;
    }()
  }, {
    key: "sanitize",
    value: function sanitize(schema, body) {
      Object.keys(body).map(function (param) {
        if (!schema.properties[param]) {
          delete body[param];
        }
      });

      var initialBody = _objectSpread({}, body); // clone body


      Object.keys(schema.properties).forEach(function (field) {
        var value = initialBody[field];
        if (value === undefined || value === "" || value == null) return body[field] = null;
        var type = schema.properties[field].type;
        var final_value = value;

        switch (type) {
          case "cep":
            final_value = (value + "").replace(/[^\d]+/g, '');
            break;

          case "number":
            if (!isNaN(value)) {
              final_value = Number(value);
            }

            ;
            break;

          case "date":
            if (!isNaN(Date.parse(value))) {
              final_value = new Date(value);
            }

            ;
            break;

          case "boolean":
            try {
              final_value = JSON.parse(value);
            } catch (err) {
              final_value = value;
            }

            ;
            break;
        }

        return body[field] = final_value;
      });
    }
  }, {
    key: "checkType",
    value: function () {
      var _checkType = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(value, type) {
        var regexExp, _regex, regex;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.t0 = type;
                _context3.next = _context3.t0 === "uuid" ? 3 : _context3.t0 === "json" ? 8 : _context3.t0 === "cep" ? 17 : _context3.t0 === "date" ? 22 : _context3.t0 === "hour" ? 25 : _context3.t0 === "array" ? 29 : 32;
                break;

              case 3:
                regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

                if (regexExp.test(value)) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return", false);

              case 6:
                ;
                return _context3.abrupt("break", 35);

              case 8:
                _context3.prev = 8;
                JSON.parse(value);
                _context3.next = 15;
                break;

              case 12:
                _context3.prev = 12;
                _context3.t1 = _context3["catch"](8);
                return _context3.abrupt("return", false);

              case 15:
                ;
                return _context3.abrupt("break", 35);

              case 17:
                _regex = /\b\d{8}\b/;

                if (_regex.test(value)) {
                  _context3.next = 20;
                  break;
                }

                return _context3.abrupt("return", false);

              case 20:
                ;
                return _context3.abrupt("break", 35);

              case 22:
                if (value instanceof Date) {
                  _context3.next = 24;
                  break;
                }

                return _context3.abrupt("return", false);

              case 24:
                return _context3.abrupt("break", 35);

              case 25:
                regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;

                if (regex.test(value)) {
                  _context3.next = 28;
                  break;
                }

                return _context3.abrupt("return", false);

              case 28:
                return _context3.abrupt("break", 35);

              case 29:
                if (!(Array.isArray(value) === false)) {
                  _context3.next = 31;
                  break;
                }

                return _context3.abrupt("return", false);

              case 31:
                return _context3.abrupt("break", 35);

              case 32:
                if (!(type !== _typeof(value))) {
                  _context3.next = 34;
                  break;
                }

                return _context3.abrupt("return", false);

              case 34:
                return _context3.abrupt("break", 35);

              case 35:
                return _context3.abrupt("return", true);

              case 36:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[8, 12]]);
      }));

      function checkType(_x4, _x5) {
        return _checkType.apply(this, arguments);
      }

      return checkType;
    }()
  }]);

  return AppSchemaValidator;
}();
/* Conflicts */


exports["default"] = AppSchemaValidator;

var makeMissingMessage = function makeMissingMessage(field, missingMessage) {
  return missingMessage || "Campo '".concat(field, "' \xE9 obrigat\xF3rio");
};

exports.makeMissingMessage = makeMissingMessage;

var makeInvalidMessage = function makeInvalidMessage(field, invalidMessage) {
  return invalidMessage || "Campo '".concat(field, "' contem valor inv\xE1lido ");
};

exports.makeInvalidMessage = makeInvalidMessage;