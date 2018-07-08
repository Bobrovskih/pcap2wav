import { expect } from 'chai';
import { helpers } from './';

describe('helpers', () => {
    it('random', () => {
        const r1 = helpers.random();
        const r2 = helpers.random();
        expect(r1).not.equal(r2);
    });
});
