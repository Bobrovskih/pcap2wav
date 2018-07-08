// tslint:disable:no-console
import { rtpInfo } from '../src';

const main = async () => {
    const result = await rtpInfo({ pcap: '' });
    console.log(result);
};

main();
