import { tshark } from '../tshark';
import { PcapToWav } from './pcap-to-wav';

import { Pcap2WavOptions, RtpInfoOptions } from '../typings';

const pcap2wav = async (options: Pcap2WavOptions) => {
    const p2w = new PcapToWav(options);
    return await p2w.convert();
};

const rtpInfo = async (options: RtpInfoOptions) => {
    return await tshark.rtpInfo(options);
};

export {
    pcap2wav,
    rtpInfo,
};
