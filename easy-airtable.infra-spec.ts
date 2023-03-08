import { EasyAirtableTable } from './easy-airtable.table';

describe('AirtableServiceTable', () => {
  let repository: EasyAirtableTable;
  const TEST_NAME = 'TEST_AIRTABLE_SERVICE';
  const TEST_TEL = '010-1234-1234';
  const TEST_CONFIG = {
    apiKey: 'keykEHwNaPUIPI9Kg',
    baseId: 'app9mEf2v0kxPbAb1',
    tableId: 'tblDQoKVItulKlmkW', // 'SAMPLE'
  };

  beforeEach(() => {
    repository = EasyAirtableTable.fromConfig(TEST_CONFIG);
  });

  afterEach(async () => {
    const records = await repository.findAll();
    if (records.length > 0) {
      const ids = records.map(record => record.id);
      await repository.deleteByIds(ids);
    }
  });

  it('정보 추가시 정보가 존재한다.', async () => {
    const record = await repository.create({
      NAME: TEST_NAME,
      TEL: TEST_TEL,
    });

    expect(typeof record.id).toBe('string');
    expect(record.id.startsWith('rec')).toBe(true);
  });


  it('추가된 레코드의 아이디를 통해 레코드를 찾을 수 있다.', async () => {
    const record = await repository.create({
      NAME: TEST_NAME,
      TEL: TEST_TEL,
    });
    const exist = await repository.findOneById(record.id);
    expect(exist.fields).toMatchObject({
      NAME: TEST_NAME,
      TEL: TEST_TEL,
    });
  });

  it('추가된 레코드의 정보를 통해 레코드를 찾을 수 있다.', async () => {
    const record = await repository.create({
      NAME: TEST_NAME,
      TEL: TEST_TEL,
    });
    const exist = await repository.findOneBy({
      NAME: TEST_NAME,
      TEL: TEST_TEL,
    });
    expect(exist?.fields).toMatchObject({
      NAME: TEST_NAME,
      TEL: TEST_TEL,
    });
    expect(exist?.id).toBe(record.id);
  });

  it('추가된 동일한 이름의 레코드에 대해 이름으로 검색할 수 있다.', async () => {
    await repository.create({
      NAME: TEST_NAME,
      TEL: '010-0000-0000',
    });
    await repository.create({
      NAME: TEST_NAME,
      TEL: '010-0000-0001',
    });
    await repository.create({
      NAME: TEST_NAME,
      TEL: '010-0000-0002',
    });
    const exists = await repository.findBy({
      NAME: TEST_NAME,
    });
    expect(exists.length).toBe(3);
    exists.forEach(exist => {
      expect(exist.fields).toMatchObject({
        NAME: TEST_NAME,
      });
    });
  });

  it('레코드의 업데이트를 수행하여 성공 결과를 반환한다.', async () => {
    const record = await repository.create({
      NAME: TEST_NAME,
      TEL: '010-0000-0000',
    });
    const updated = await repository.updateOne(record.id, {
      NAME: TEST_NAME,
      TEL: '010-0000-0001',
    });
    expect(updated.fields).toMatchObject({
      TEL: '010-0000-0001',
    });
  });

  it('다량의 레코드의 업데이트를 수행하여 성공 결과를 반환한다.', async () => {
    const record = await repository.create({
      NAME: TEST_NAME,
      TEL: '010-0000-0000',
    });
    const record2 = await repository.create({
      NAME: TEST_NAME,
      TEL: '010-0000-0001',
    });
    const record3 = await repository.create({
      NAME: TEST_NAME,
      TEL: '010-0000-0002',
    });
    const updates = [record, record2, record3].map(v => ({
      id: v.id,
      NAME: 'updated'
    }));
    const updated = await repository.update(updates);
    updated.forEach(result => {
      expect(result.fields).toMatchObject({
        NAME: 'updated'
      });
    });
  });

  it('주어진 레코드를 삭제할 수 있다.', async () => {
    const record = await repository.create({
      NAME: TEST_NAME,
      TEL: '010-0000-0000',
    });
    const result = await repository.deleteById(record.id);
    expect(result.id).toBe(record.id);
  });
});
