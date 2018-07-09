import * as path from 'path';
import { expect } from 'chai';
import { PcapToWav } from './pcap-to-wav';

describe('PcapToWav', () => {
    it('without filter', async () => {
        const pcap = path.resolve(__dirname, '../../samples/aaa.pcap');
        const p2w = new PcapToWav({ pcap });
        const result = await p2w.convert();
        expect(1).equal(result.rtpCount);
    });

    it('filter', async () => {
        const filters = [
            {
                dstPort: '8000',
                ssrc: '0x58F33DEA',
            }, {
                dstPort: '40362',
                ssrc: '0x00002E3D',
            },
        ];
        const pcap = path.resolve(__dirname, '../../samples/SIP_CALL_RTP_G711.pcap');
        const p2w = new PcapToWav({ filters, pcap });
        const result = await p2w.convert();
        expect(2).equal(result.rtpCount);
    });
});
