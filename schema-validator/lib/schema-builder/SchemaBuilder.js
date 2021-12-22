"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./ISchemaBuilder"), exports);
class AppSchemaBuilder {
    constructor() {
        this.properties = {};
        this.required = [];
        this.number = (key) => this.pushProperty(key, 'number');
        this.boolean = (key) => this.pushProperty(key, 'boolean');
        this.date = (key) => this.pushProperty(key, 'date');
        this.hour = (key) => this.pushProperty(key, 'hour');
        this.array = (key) => this.pushProperty(key, 'array');
        this.json = (key) => this.pushProperty(key, 'json');
        this.cep = (key) => this.pushProperty(key, 'cep');
        this.uuid = (key) => this.pushProperty(key, 'uuid');
        this.string = (key) => this.pushProperty(key, 'string');
    }
    setSpecs(key) {
        const optional = () => {
            this.required.splice(this.required.indexOf(key), 1);
            return this.setSpecs(key);
        };
        const description = (value) => {
            this.properties[key] = { ...this.properties[key], description: value };
            return this.setSpecs(key);
        };
        const actions = { optional, description };
        /*         if(!this.required.includes(key)) delete actions.optional;
                if(this.properties?.[key]?.description) delete actions.description; */
        return actions;
    }
    pushProperty(key, type) {
        this.properties[key] = { type };
        this.required.push(key);
        return this.setSpecs(key);
    }
    getSchema() {
        return ({
            type: 'object',
            properties: this.properties,
            required: this.required
        });
    }
    static create(callback) {
        const instace = new AppSchemaBuilder();
        callback(instace);
        return instace.getSchema();
    }
}
exports.default = AppSchemaBuilder;
//# sourceMappingURL=SchemaBuilder.js.map