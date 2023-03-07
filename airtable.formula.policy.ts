import * as _ from 'lodash';

export class AirtableFormulaPolicy {
  mapJsonToFormula(where: Record<string, any>): string {
    if (Object.keys(where).length > 1) {
      return `AND(${_.chain(where).mapValues((value, key) => `({${key}} = '${value}')`).values().join(', ').value()})`;
    }
    return _.chain(where).mapValues((value, key) => `({${key}} = '${value}')`).values().join(', ').value();
  }
}
