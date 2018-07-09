// tslint:disable:no-console
import { rtpInfo } from '../src';
import * as path from 'path';

const main = async () => {
    const pcap = path.resolve(__dirname, '../samples/aaa.pcap');
    const result = await rtpInfo({ pcap });
    console.log(result);
};

main();
