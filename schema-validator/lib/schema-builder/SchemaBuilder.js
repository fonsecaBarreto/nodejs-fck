"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports["default"] = void 0;

var _ISchemaBuilder = require("./ISchemaBuilder");

Object.keys(_ISchemaBuilder).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _ISchemaBuilder[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ISchemaBuilder[key];
    }
  });
});

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AppSchemaBuilder = /*#__PURE__*/function () {
  function AppSchemaBuilder() {
    var _this = this;

    _classCallCheck(this, AppSchemaBuilder);

    _defineProperty(this, "properties", {});

    _defineProperty(this, "required", []);

    _defineProperty(this, "number", function (key) {
      return _this.pushProperty(key, 'number');
    });

    _defineProperty(this, "boolean", function (key) {
      return _this.pushProperty(key, 'boolean');
    });

    _defineProperty(this, "date", function (key) {
      return _this.pushProperty(key, 'date');
    });

    _defineProperty(this, "hour", function (key) {
      return _this.pushProperty(key, 'hour');
    });

    _defineProperty(this, "array", function (key) {
      return _this.pushProperty(key, 'array');
    });

    _defineProperty(this, "json", function (key) {
      return _this.pushProperty(key, 'json');
    });

    _defineProperty(this, "cep", function (key) {
      return _this.pushProperty(key, 'cep');
    });

    _defineProperty(this, "uuid", function (key) {
      return _this.pushProperty(key, 'uuid');
    });

    _defineProperty(this, "string", function (key) {
      return _this.pushProperty(key, 'string');
    });
  }

  _createClass(AppSchemaBuilder, [{
    key: "setSpecs",
    value: function setSpecs(key) {
      var _this2 = this;

      var optional = function optional() {
        _this2.required.splice(_this2.required.indexOf(key), 1);

        return _this2.setSpecs(key);
      };

      var description = function description(value) {
        _this2.properties[key] = _objectSpread(_objectSpread({}, _this2.properties[key]), {}, {
          description: value
        });
        return _this2.setSpecs(key);
      };

      var actions = {
        optional: optional,
        description: description
      };
      /*         if(!this.required.includes(key)) delete actions.optional;
              if(this.properties?.[key]?.description) delete actions.description; */

      return actions;
    }
  }, {
    key: "pushProperty",
    value: function pushProperty(key, type) {
      this.properties[key] = {
        type: type
      };
      this.required.push(key);
      return this.setSpecs(key);
    }
  }, {
    key: "getSchema",
    value: function getSchema() {
      return {
        type: 'object',
        properties: this.properties,
        required: this.required
      };
    }
  }], [{
    key: "create",
    value: function create(callback) {
      var instace = new AppSchemaBuilder();
      callback(instace);
      return instace.getSchema();
    }
  }]);

  return AppSchemaBuilder;
}();

exports["default"] = AppSchemaBuilder;