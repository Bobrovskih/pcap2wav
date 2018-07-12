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
