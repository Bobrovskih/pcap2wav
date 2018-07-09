// tslint:disable:no-console

import { pcap2wav, rtpInfo } from '../src';
import * as path from 'path';

const main = async () => {
    const pcap = path.resolve(__dirname, '../samples/SIP_CALL_RTP_G711.pcap');
    const { info } = await rtpInfo({ pcap });
    const filters = info.slice(0, 2);
    const result = await pcap2wav({ filters, pcap });
    console.log(result);
};

main();
