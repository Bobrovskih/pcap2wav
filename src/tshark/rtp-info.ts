import { helpers } from '../helpers';
import * as os from 'os';

const debug = require('debug')('pcap2wav:tshark:rtp-info');
import { RtpInfoOptions, RtpInfoData } from '../typings';

class RtpInfo {
    public async init(options: RtpInfoOptions) {
        const { pcap } = options;
        const [info, rtpStart] = await Promise.all([
            this.execRtpInfo(pcap),
            this.execRtpStart(pcap),
        ]);
        return {
            success: true,
            info,
            rtpStart,
        };
    }

    private async execRtpInfo(pcap: string) {
        const command = `tshark -r ${pcap} -qz rtp,streams`;
        const { stderr, stdout } = await helpers.cp.execAsync(command);
        if (stderr) { debug(stderr); }
        const success = !stderr;
        const info = this.rtpInfoParser(stdout);
        return info;
    }

    private clearCodec(input: string) {
        return input
            .replace(/GSM\s+06.10/gi, 'GSM')
            .replace(/ITU-T\s+G.711\s+PCMA/gi, 'PCMA')
            .replace(/ITU-T\s+G.711\s+PCMU/gi, 'PCMU')
            .replace(/ITU-T\s+G.729/gi, 'G729');
    }
    private rtpInfoParser(input: string): RtpInfoData[] {
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

    private async execRtpStart(pcap: string) {
        const command = `tshark -r ${pcap} -Y "rtp" -o "gui.column.format:\"Time\",\"%Yt\"`;
        const { stderr, stdout } = await helpers.cp.execAsync(command);
        if (stderr) { debug(stderr); }
        const success = !stderr;
        const rtpStart = this.rtpStartParser(stdout);
        return rtpStart;
    }

    private rtpStartParser(input: string) {
        debug('rtpStartParser input', input);
        const [timeRaw] = input.split(os.EOL);
        const [time] = timeRaw.split(',');
        const timestamp = +new Date(time);
        return timestamp;
    }
}

const rtpInfo = new RtpInfo();

export {
    rtpInfo,
    RtpInfo,
};
