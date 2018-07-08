// tslint:disable:no-console

import { pcap2wav } from '../src';

const main = async () => {
    const result = await pcap2wav({ pcap: '', wav: '' });
    console.log(result);
};

main();
