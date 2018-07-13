const debug = require('debug')('pcap2wav:tshark:index');
import { helpers } from '../helpers';
import { rtpInfo } from './rtp-info';

import { RtpInfoOptions } from '../typings';

const maxBuffer = 1024 * 50000; // 50 mb

class Tshark {
    public async rtpInfo(options: RtpInfoOptions) {
        return await rtpInfo.init(options);
    }
    public async extractPayload(options: { pcap: string, ssrc: string, dstIp: string, dstPort: string }) {
        const filter = `rtp.ssrc == ${options.ssrc} && ip.dst == ${options.dstIp} && udp.dstport == ${options.dstPort}`;
        const command = `tshark -n -r ${options.pcap} -Y "${filter}" -T fields -e rtp.payload`;
        const { stderr, stdout } = await helpers.cp.execAsync(command, { maxBuffer });
        if (stderr) {
            debug(stderr);
        }
        return stdout;
    }

}

const tshark = new Tshark();

export {
    tshark,
    Tshark,
};
