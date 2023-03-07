import { AirtableFormulaPolicy } from './airtable.formula.policy';

describe('AirtableFormulaPolicy', () => {
  let policy: AirtableFormulaPolicy;

  beforeEach(async () => {
    policy = new AirtableFormulaPolicy();
  });

  it(`JSON { NAME: 'test' } 통한 검색에 대해 ({NAME} = 'test')를 반환한다.`, () => {
    expect(policy.mapJsonToFormula({ NAME: 'test' })).toBe(`({NAME} = 'test')`)
  });

  it(`JSON { NAME: 'test', TEL: '010-0000-0000' } 통한 검색에 대해 AND(({NAME} = 'test'), ({TEL} = '010-0000-0000'))를 반환한다.`, () => {
    expect(policy.mapJsonToFormula({ NAME: 'test', TEL: '010-0000-0000' })).toBe(`AND(({NAME} = 'test'), ({TEL} = '010-0000-0000'))`)
  });
});
