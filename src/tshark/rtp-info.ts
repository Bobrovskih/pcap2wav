import { helpers } from '../helpers';
import * as os from 'os';

const debug = require('debug')('pcap2wav:tshark:rtp-info');
import { RtpInfoOptions, RtpInfoData } from '../typings';

class RtpInfo {
    public async init(options: RtpInfoOptions) {
        const pcap = options.pcap;
        const command = `tshark -r ${pcap} -qz rtp,streams`;
        const { stderr, stdout } = await helpers.cp.execAsync(command);
        if (stderr) { debug(stderr); }
        const success = !stderr;
        const info = this.parser(stdout);
        return {
            success,
            info,
            stdout,
            stderr,
        };
    }

    private clearCodec(input: string) {
        return input
            .replace(/GSM\s+06.10/gi, 'GSM')
            .replace(/ITU-T\s+G.711\s+PCMA/gi, 'PCMA')
            .replace(/ITU-T\s+G.711\s+PCMU/gi, 'PCMU')
            .replace(/ITU-T\s+G.729/gi, 'G729');
    }
    private parser(input: string): RtpInfoData[] {
        debug('parser input:', os.EOL, input);
        const rows = this.clearCodec(input).split(os.EOL).slice(2, -2);
        const columns = rows.map((row) => row.trim().split(/\s+/));
        const result = columns.map((column) => {
            const [
                srcIp,
                srcPort,
                dstIp,
                dstPort,
                ssrc,
                codec,
                packets,
                lostPackets,
                lostPercent,
                maxDelta,
                maxJitter,
                meanJitter,
                problems,
            ] = column;

            return {
                srcIp,
                srcPort,
                dstIp,
                dstPort,
                ssrc,
                codec,
                packets,
                lostPackets,
                lostPercent,
                maxDelta,
                maxJitter,
                meanJitter,
                problems,
            };
        });
        return result;
    }
}

const rtpInfo = new RtpInfo();

export {
    rtpInfo,
    RtpInfo,
};
