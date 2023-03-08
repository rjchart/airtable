import Airtable, { Base } from 'airtable';

import { EasyAirtableTable } from './easy-airtable.table';

export class EasyAirtableBase {
  private readonly base: Base;

  constructor(base: Base) {
    this.base = base;
  }

  static fromConfig({ apiKey, baseId }: { apiKey: string, baseId: string }): EasyAirtableBase {
    const base = new Airtable({
      apiKey,
    }).base(baseId);
    return new EasyAirtableBase(base);
  }

  getTable(tableId: string): EasyAirtableTable {
    const table = this.base.table(tableId);
    return new EasyAirtableTable(table);
  }
}
