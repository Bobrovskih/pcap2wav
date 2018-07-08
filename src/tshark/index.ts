const debug = require('debug')('pcap2wav:tshark:index');
import { helpers } from '../helpers';
import { rtpInfo } from './rtp-info';

class Tshark {
    public async rtpInfo(options: any) {
        return await rtpInfo.init(options);
    }
    public async extractPayload(options: any) {
        const command = `tshark -n -r ${options.pcap} -Y "rtp.ssrc == ${options.ssrc}" -T fields -e rtp.payload`;
        const { stderr, stdout } = await helpers.cp.execAsync(command);
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
