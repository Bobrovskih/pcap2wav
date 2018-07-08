import * as path from 'path';
const debug = require('debug')('pcap2wav:core:pcap-to-wav');

import { sox } from '../sox';
import { tshark } from '../tshark';
import { helpers } from '../helpers';

class PcapToWav {
    /** параметры */
    private options: any;
    /** ртп потоки */
    private rtps: any[];
    /** id операции */
    private opId: string;
    /** папка с файлами */
    private filesDir: string;
    constructor(options: any) {
        this.options = options || {};
        this.opId = helpers.random();
        this.filesDir = path.resolve(__dirname, '../../files');
        this.rtps = [];
    }

    public async convert() {
        debug('convert start');
        const { info } = await tshark.rtpInfo(this.options);
        this.rtps = info.map((rtp, i) => {
            const payload = helpers.payloadTypes[rtp.codec];
            const toFile = path.resolve(this.filesDir, `${this.opId}_${i}.wav`);
            const cc = sox.convertCommand(rtp.codec, toFile);
            return {
                payload,
                cc,
                i,
                ...rtp,
            };
        });

        debug('convert finish');

        return {
            success: true,
        };
    }
}

export {
    PcapToWav,
};
