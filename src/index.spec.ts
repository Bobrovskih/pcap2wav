import * as path from 'path';
import * as fs from 'fs';

import { expect } from 'chai';
import { pcap2wav, rtpInfo } from './';

describe('pcap2wav', () => {
    it('aaa.pcap, basic convert', async () => {
        const pcap = path.resolve(__dirname, '../samples/aaa.pcap');
        const result = await pcap2wav({ pcap });
        const { size } = fs.statSync(result.wav);
        expect(1490).equal(size);
        expect(true).equal(/\.wav$/.test(result.wav));
    });
    it('SIP_CALL_RTP_G711.pcap, basic convert', async () => {
        const pcap = path.resolve(__dirname, '../samples/SIP_CALL_RTP_G711.pcap');
        const result = await pcap2wav({ pcap });
        const { size } = fs.statSync(result.wav);
        expect(139184).equal(size);
        expect(true).equal(/\.wav$/.test(result.wav));
    });
    it('SIP_CALL_RTP_G711.pcap, only 1 rtp', async () => {
        const pcap = path.resolve(__dirname, '../samples/SIP_CALL_RTP_G711.pcap');
        const { info } = await rtpInfo({ pcap });
        const filters = info.slice(0, 1);
        const result = await pcap2wav({ pcap, filters });
        const { size } = fs.statSync(result.wav);
        expect(87192).equal(size);
        expect(true).equal(/\.wav$/.test(result.wav));
    });
});
