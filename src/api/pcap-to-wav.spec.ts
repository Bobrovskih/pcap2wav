import * as path from 'path';
import { expect } from 'chai';
import { PcapToWav } from './pcap-to-wav';
import { helpers } from '../helpers';

describe('PcapToWav', () => {
    it('without filter', async () => {
        const pcap = path.resolve(__dirname, '../../samples/aaa.pcap');
        const p2w = new PcapToWav({ pcap });
        const result = await p2w.convert();
        expect(1).equal(result.rtpCount);
    });

    it('pcma + pcmu', async () => {
        const pcap = path.resolve(__dirname, '../../samples/sip-rtp-g711.pcap');
        const p2w = new PcapToWav({ pcap });
        const result = await p2w.convert();
        const { size } = await helpers.fs.statAsync(result.wav);
        expect(135210).equal(size);
    });

    it('only pcmu', async () => {
        const pcap = path.resolve(__dirname, '../../samples/sip-rtp-g711.pcap');
        const filters = [{ ssrc: '0x343da99b', dstIp: '10.0.2.20', dstPort: '6000' }];
        const p2w = new PcapToWav({ pcap, filters });
        const result = await p2w.convert();
        const { size } = await helpers.fs.statAsync(result.wav);
        expect(67634).equal(size);
    });

    it('gsm', async () => {
        const pcap = path.resolve(__dirname, '../../samples/sip-rtp-gsm.pcap');
        const p2w = new PcapToWav({ pcap });
        const result = await p2w.convert();
        const { size } = await helpers.fs.statAsync(result.wav);
        expect(60).equal(size);
    });

    it('filter', async () => {
        const filters = [
            {
                dstPort: '8000',
                ssrc: '0x58F33DEA',
                dstIp: '200.57.7.204',
            }, {
                dstPort: '40362',
                ssrc: '0x00002E3D',
                dstIp: '200.57.7.196',
            },
        ];
        const pcap = path.resolve(__dirname, '../../samples/SIP_CALL_RTP_G711.pcap');
        const p2w = new PcapToWav({ filters, pcap });
        const result = await p2w.convert();
        expect(2).equal(result.rtpCount);
    });
    it('clean', async () => {
        const pcap = path.resolve(__dirname, '../../samples/aaa.pcap');
        const p2w = new PcapToWav({ pcap });
        const result = await p2w.convert();
        const basename = path.parse(result.wav).name;
        const isExistsPCMA = await helpers.fs.existsAsync(path.resolve(__dirname, `../../files/${basename}_0.PCMA`));
        const isExistsWAV = await helpers.fs.existsAsync(path.resolve(__dirname, `../../files/${basename}_0.wav`));
        expect(false).equal(isExistsPCMA);
        expect(false).equal(isExistsWAV);
    });
    it('not clean', async () => {
        const pcap = path.resolve(__dirname, '../../samples/aaa.pcap');
        const p2w = new PcapToWav({ pcap, clean: false });
        const result = await p2w.convert();
        const basename = path.parse(result.wav).name;
        const pcmaTrash = path.resolve(__dirname, `../../files/${basename}_0.PCMA`);
        const wavTrash = path.resolve(__dirname, `../../files/${basename}_0.wav`);
        const isExistsPCMA = await helpers.fs.existsAsync(pcmaTrash);
        const isExistsWAV = await helpers.fs.existsAsync(wavTrash);
        expect(true).equal(isExistsPCMA);
        expect(true).equal(isExistsWAV);
    });

    it('wav option', async () => {
        const pcap = path.resolve(__dirname, '../../samples/aaa.pcap');
        const wav = path.resolve(__dirname, '../../files/track.wav');
        const p2w = new PcapToWav({ pcap, wav });
        const result = await p2w.convert();
        const wavExists = await helpers.fs.existsAsync(wav);
        expect(wav).to.equal(result.wav);
        expect(true).to.equal(wavExists);
    });
});
