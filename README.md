# EasyAirtable.js
The EasyAirtable API provides easier way of accessing your data with airtable. It provides functions like typeorm features and some complicated features.

# Installation
### Node.js
To install easy-airtable.js in node project:
```
npm install easy-airtable
```

# Configuration
There are three variables for configure

### Airtable
* apiKey - your secret API token. Visit /create/tokens to create a personal access token. OAuth access tokens can also be used.
* endpointUrl - the API endpoint to hit. You might want to override it if you are using an API proxy (e.g. runscope.net) to debug your API calls. (AIRTABLE_ENDPOINT_URL)
```ts
new EasyAirtable({ apiKey: 'YOUR_SECRET_API_TOKEN' })
// or
new EasyAirtable({ endpointUrl: 'https://api-airtable-com-8hw7i1oz63iz.runscope.net/' })
```
### AirtableBase
* baseId - your baseId for airtable base. you can see this id rom your base url (https://airtable.com/BASE_ID/TABLE_ID) or /help/API documentation.
```ts
new EasyAirtable({ apiKey: 'YOUR_SECRET_API_TOKEN' }).getBase('YOUR_BASE_ID')
// or
EasyAirtableBase.fromConfig({ apiKey: 'YOUR_SECRET_API_TOKEN', baseId: 'YOUR_BASE_ID' })
```
### AirtableTable
* tableId - your tableId for airtable table. you can see this id rom your base url (https://airtable.com/BASE_ID/TABLE_ID) or /help/API documentation.
```ts
new EasyAirtable({ apiKey: 'YOUR_SECRET_API_TOKEN' })
  .getTable({ baseId: 'YOUR_BASE_ID', tableId: 'YOUR_TABLE_ID' });
// or
EasyAirtableTable.fromConfig({ 
  apiKey: 'YOUR_SECRET_API_TOKEN', 
  baseId: 'YOUR_BASE_ID', 
  tableId: 'YOUR_TABLE_ID',
})
```
# Usage
### Find All
find all records in table
```ts
import { EasyAirtableTable } from 'easy-airtable';

const config = {
  apiKey: 'YOUR_SECRET_API_TOKEN',
  baseId: 'YOUR_BASE_ID',
  tableId: 'YOUR_TABLE_ID',
}
const table = EasyAirtableTable.fromConfig(config);
const allRecords = await table.findAll();
```
### Find
find all records in specific conditions in table
```ts
import { EasyAirtableTable } from 'easy-airtable';

const config = {
  apiKey: 'YOUR_SECRET_API_TOKEN',
  baseId: 'YOUR_BASE_ID',
  tableId: 'YOUR_TABLE_ID',
}
const table = EasyAirtableTable.fromConfig(config);
const allRecords = await table.findBy({ 'FIELD_NAME1': 'MATCHING_VALUE1', 'FIELD_NAME2': 'MATCHING_VALUE2' });
```
