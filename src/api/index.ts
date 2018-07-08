import { tshark } from '../tshark';
import { PcapToWav } from './pcap-to-wav';

const pcap2wav = async (options: any) => {
    const p2w = new PcapToWav(options);
    return await p2w.convert();
};

const rtpInfo = async (options: any) => {
    return await tshark.rtpInfo(options);
};

export {
    pcap2wav,
    rtpInfo,
};
