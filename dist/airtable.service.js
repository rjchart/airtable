"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirtableService = void 0;
const airtable_1 = __importDefault(require("airtable"));
const _ = __importStar(require("lodash"));
const airtable_formula_policy_1 = require("./airtable.formula.policy");
class AirtableService {
    constructor({ apiKey, baseId, tableId }) {
        this.policy = new airtable_formula_policy_1.AirtableFormulaPolicy();
        this.airtableBase = new airtable_1.default({
            apiKey,
        }).base(baseId);
        this.defaultTableId = tableId;
    }
    tableId(tableId) {
        this.defaultTableId = tableId;
        return this;
    }
    getTable() {
        return this.airtableBase.table(this.defaultTableId);
    }
    findOneById(id, usingFieldId = false) {
        if (usingFieldId) {
            return this.getTable().select({
                filterByFormula: `RECORD_ID() = '${id}'`,
                returnFieldsByFieldId: true,
                maxRecords: 1,
            }).firstPage().then((data) => data === null || data === void 0 ? void 0 : data[0]);
        }
        return this.getTable().find(id);
    }
    findBy(where, options) {
        return this.getTable().select(Object.assign({ filterByFormula: this.policy.mapJsonToFormula(where) }, options)).all();
    }
    findAll(options) {
        return this.getTable().select(Object.assign({}, options)).all();
    }
    async findOneBy(where, options) {
        const records = await this.getTable().select(Object.assign({ filterByFormula: this.policy.mapJsonToFormula(where) }, options)).firstPage();
        return _.first(records);
    }
    async create(where) {
        return this.getTable().create(where, { typecast: true });
    }
    async updateOne(id, where) {
        return this.getTable().update(id, where, { typecast: true });
    }
    async update(entities) {
        const records = entities.map((_a) => {
            var { id } = _a, fields = __rest(_a, ["id"]);
            return ({
                id,
                fields,
            });
        });
        return this.getTable().update(records, { typecast: true });
    }
    async deleteById(id) {
        return this.getTable().destroy(id);
    }
    async deleteByIds(ids) {
        await this.getTable().destroy(ids);
    }
}
exports.AirtableService = AirtableService;
