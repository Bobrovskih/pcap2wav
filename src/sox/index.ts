const debug = require('debug')('pcap2wav:sox:index');
import { helpers } from '../helpers';

class Sox {
    public async convertToWav(codec: string, codecFile: string, wavFile: string) {
        const command = this.createConvertToWavCommand(codec, codecFile, wavFile);
        const { stderr, stdout } = await helpers.cp.execAsync(command);
        debug(stderr, stdout);
    }

    public async mergeWavs(inputWavPaths: string, wav: string) {
        const command = `sox -m ${inputWavPaths} ${wav}`;
        const { stderr, stdout } = await helpers.cp.execAsync(command);
        debug(stderr, stdout);
    }

    private createConvertToWavCommand(codec: string, codecFile: string, wavFile: string) {
        if (codec === 'PCMA') {
            return this.escapingBackslash(`sox -t al -r 8000 -c 1 ${codecFile} ${wavFile}`);
        }
        if (codec === 'PCMU') {
            return this.escapingBackslash(`sox -t ul -r 8000 -c 1 ${codecFile} ${wavFile}`);
        }
        throw Error(`cannot define convert command for codec: ${codec}`);
    }

    private escapingBackslash(input: string): string {
        return input.replace(/\\/g, '\\\\');
    }
}

const sox = new Sox();

export {
    sox,
    Sox,
};
