import { FieldSet, Record as AirtableRecord, Records } from 'airtable';
import { QueryParams } from 'airtable/lib/query_params';
export interface IAirtableConfig {
    apiKey: string;
    baseId: string;
    tableId: string;
}
export type IAirtableRecord = Record<string, IAirtableValue> & {
    id: string;
};
export type IAirtableValue = string | number | string[] | boolean | any;
export declare class AirtableService {
    private readonly airtableBase;
    private defaultTableId;
    private readonly policy;
    constructor({ apiKey, baseId, tableId }: IAirtableConfig);
    tableId(tableId: string): this;
    getTable(): import("airtable/lib/table")<import("airtable/lib/field_set").FieldSet>;
    findOneById(id: string, usingFieldId?: boolean): Promise<AirtableRecord<any>>;
    findBy(where: Record<string, IAirtableValue>, options?: QueryParams<FieldSet>): Promise<Records<any>>;
    findAll(options?: QueryParams<FieldSet>): Promise<Records<any>>;
    findOneBy(where: Record<string, IAirtableValue>, options?: QueryParams<FieldSet>): Promise<AirtableRecord<FieldSet> | void>;
    create(where: Record<string, IAirtableValue>): Promise<AirtableRecord<any>>;
    updateOne(id: string, where: Record<string, IAirtableValue>): Promise<AirtableRecord<any>>;
    update(entities: IAirtableRecord[]): Promise<Records<any>>;
    deleteById(id: string): Promise<AirtableRecord<any>>;
    deleteByIds(ids: string[]): Promise<void>;
}
