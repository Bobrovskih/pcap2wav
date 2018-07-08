import * as cp from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';
import { payloadTypes } from './payload-types';

class Helpers {
    get fs() {
        return {
            writeFileAsync: promisify(fs.writeFile),
            readFileAsync: promisify(fs.readFile),
        };
    }
    get cp() {
        return {
            execAsync: promisify(cp.exec),
        };
    }
    get payloadTypes(): any {
        return payloadTypes;
    }

    public random(min = 100000, max = 999999) {
        const rand = Math.round(min - 0.5 + Math.random() * (max - min + 1));
        const now = Date.now();
        return now + '' + rand;
    }
}

const helpers = new Helpers();

export {
    helpers,
    Helpers,
};
