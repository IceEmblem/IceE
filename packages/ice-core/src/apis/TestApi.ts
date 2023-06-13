import Api, { Entity } from './Api';

export interface TestEntity extends Entity {
    name?: string,
    age?: number
}

class TestApi extends Api<TestEntity> {
    url = '/api/test';
}

export default new TestApi();