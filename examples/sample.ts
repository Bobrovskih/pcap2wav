// tslint:disable:no-console

import { pcap2wav } from '../src';
import * as path from 'path';

const main = async () => {
    const pcap = path.resolve(__dirname, '../samples/aaa.pcap');
    const result = await pcap2wav({ pcap });
    console.log(result);
};

main();
