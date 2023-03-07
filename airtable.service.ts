import Airtable, { Base, FieldSet, Record as AirtableRecord, Records } from 'airtable';
import { QueryParams } from 'airtable/lib/query_params';
import * as _ from 'lodash';

import { AirtableFormulaPolicy } from './airtable.formula.policy';

export interface IAirtableConfig {
  apiKey: string;
  baseId: string;
  tableId: string;
}

export type IAirtableRecord = Record<string, IAirtableValue> & { id: string };

export type IAirtableValue = string | number | string[] | boolean | any;

export class AirtableService {
  private readonly airtableBase: Base;
  private defaultTableId: string;
  private readonly policy = new AirtableFormulaPolicy();

  constructor({ apiKey, baseId, tableId }: IAirtableConfig) {
    this.airtableBase = new Airtable({
      apiKey,
    }).base(baseId);
    this.defaultTableId = tableId;
  }

  tableId(tableId: string): this {
    this.defaultTableId = tableId;
    return this;
  }

  getTable() {
    return this.airtableBase.table(this.defaultTableId);
  }

  findOneById(id: string, usingFieldId = false): Promise<AirtableRecord<any>> {
    if (usingFieldId) {
      return this.getTable().select({
        filterByFormula: `RECORD_ID() = '${id}'`,
        returnFieldsByFieldId: true,
        maxRecords: 1,
      }).firstPage().then((data: Records<any>) => data?.[0]);
    }
    return this.getTable().find(id);
  }

  findBy(where: Record<string, IAirtableValue>, options?: QueryParams<FieldSet>): Promise<Records<any>> {
    return this.getTable().select({
      filterByFormula: this.policy.mapJsonToFormula(where),
      ...options,
    }).all();
  }

  findAll(options?: QueryParams<FieldSet>): Promise<Records<any>> {
    return this.getTable().select({
      ...options,
    }).all();
  }

  async findOneBy(where: Record<string, IAirtableValue>, options?: QueryParams<FieldSet>): Promise<AirtableRecord<FieldSet> | void> {
    const records = await this.getTable().select({
      filterByFormula: this.policy.mapJsonToFormula(where),
      ...options,
    }).firstPage();
    return _.first(records);
  }

  async create(where: Record<string, IAirtableValue>): Promise<AirtableRecord<any>> {
    return this.getTable().create(where, { typecast: true });
  }

  async updateOne(id: string, where: Record<string, IAirtableValue>): Promise<AirtableRecord<any>> {
    return this.getTable().update(id, where, { typecast: true });
  }

  async update(entities: IAirtableRecord[]): Promise<Records<any>> {
    const records = entities.map(({ id, ...fields }) => ({
      id,
      fields,
    }));
    return this.getTable().update(records, { typecast: true });
  }

  async deleteById(id: string): Promise<AirtableRecord<any>> {
    return this.getTable().destroy(id);
  }

  async deleteByIds(ids: string[]) {
    await this.getTable().destroy(ids);
  }
}


