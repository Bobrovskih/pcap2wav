import * as cp from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';
import { payloadTypes } from './payload-types';

class Helpers {
    get fs() {
        return {
            writeFileAsync: promisify(fs.writeFile),
            readFileAsync: promisify(fs.readFile),
            unlinkAsync: promisify(fs.unlink),
            existsAsync: promisify(fs.exists),
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

    public typeOf(variable: any) {
        const type: string = Object.prototype.toString.call(variable);
        return type
            .slice(8, -1)
            .toLowerCase();
    }
}

const helpers = new Helpers();

export {
    helpers,
    Helpers,
};
