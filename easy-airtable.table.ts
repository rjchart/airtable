import Airtable, { FieldSet, Record as AirtableRecord, Records, Table } from 'airtable';
import * as _ from 'lodash';
import { QueryParams } from 'airtable/lib/query_params';

import { IAirtableConfig, IAirtableRecord, IAirtableValue } from './easy-airtable';
import { AirtableFormulaPolicy } from './airtable.formula.policy';

export class EasyAirtableTable {
  private readonly table: Table<FieldSet>;
  private readonly policy = new AirtableFormulaPolicy();

  constructor(table: Table<FieldSet>) {
    this.table = table;
  }

  static fromConfig({ apiKey, baseId, tableId }: IAirtableConfig): EasyAirtableTable {
    const table = new Airtable({
      apiKey,
    }).base(baseId).table(tableId);
    return new EasyAirtableTable(table);
  }

  findOneById(id: string, usingFieldId = false): Promise<AirtableRecord<any>> {
    if (usingFieldId) {
      return this.table.select({
        filterByFormula: `RECORD_ID() = '${id}'`,
        returnFieldsByFieldId: true,
        maxRecords: 1,
      }).firstPage().then((data: Records<any>) => data?.[0]);
    }
    return this.table.find(id);
  }

  findBy(where: Record<string, IAirtableValue>, options?: Omit<QueryParams<FieldSet>, 'filterByFormula'>): Promise<Records<any>> {
    return this.table.select({
      filterByFormula: this.policy.mapJsonToFormula(where),
      ...options,
    }).all();
  }

  findAll(options?: QueryParams<FieldSet>): Promise<Records<any>> {
    return this.table.select({
      ...options,
    }).all();
  }

  async findOneBy(where: Record<string, IAirtableValue>, options?: QueryParams<FieldSet>): Promise<AirtableRecord<FieldSet> | void> {
    const records = await this.table.select({
      filterByFormula: this.policy.mapJsonToFormula(where),
      ...options,
    }).firstPage();
    return _.first(records);
  }

  async create(where: Record<string, IAirtableValue>): Promise<AirtableRecord<any>> {
    return this.table.create(where, { typecast: true });
  }

  async updateOne(id: string, where: Record<string, IAirtableValue>): Promise<AirtableRecord<any>> {
    return this.table.update(id, where, { typecast: true });
  }

  async update(entities: IAirtableRecord[]): Promise<Records<any>> {
    const records = entities.map(({ id, ...fields }) => ({
      id,
      fields,
    }));
    return this.table.update(records, { typecast: true });
  }

  async deleteById(id: string): Promise<AirtableRecord<any>> {
    return this.table.destroy(id);
  }

  async deleteByIds(ids: string[]) {
    await this.table.destroy(ids);
  }
}
