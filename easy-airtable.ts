import Airtable from 'airtable';
import { EasyAirtableBase } from './easy-airtable.base';
import { EasyAirtableTable } from './easy-airtable.table';

export interface IAirtableConfig {
  apiKey: string;
  baseId: string;
  tableId: string;
}

export type IAirtableRecord = Record<string, IAirtableValue> & { id: string };

export type IAirtableValue = string | number | string[] | boolean | any;

export class EasyAirtable {
  private readonly airtable: Airtable;

  constructor(options: { apiKey?: string, endpointUrl?: string }) {
    this.airtable = new Airtable(options);
  }

  getBase(baseId: string): EasyAirtableBase {
    const base = this.airtable.base(baseId);
    return new EasyAirtableBase(base);
  }

  getTable(options: { baseId: string; tableId: string }): EasyAirtableTable {
    const table = this.airtable.base(options.baseId).table(options.tableId);
    return new EasyAirtableTable(table);
  }
}


