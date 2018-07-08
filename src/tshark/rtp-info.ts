import { helpers } from '../helpers';

const debug = require('debug')('pcap2wav:tshark:rtp-info');

class RtpInfo {
    public async init(options: any) {
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
    private parser(input: string) {
        const rows = input.split('\r\n').slice(2, -2);
        const columns = rows.map((row) => row.trim().split(/\s+/));
        const result = columns.map((column) => {
            const [
                srcIp,
                srcPort,
                dstIp,
                dstPort,
                ssrc,
                codecCode,
                codecNumber,
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
                codecCode,
                codecNumber,
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
