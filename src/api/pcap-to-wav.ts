import * as path from 'path';
const debug = require('debug')('pcap2wav:core:pcap-to-wav');

import { sox } from '../sox';
import { tshark } from '../tshark';
import { helpers } from '../helpers';

import { Pcap2WavOptions, RtpData, RtpInfoData } from '../typings';

class PcapToWav {
    /** параметры */
    private options: Pcap2WavOptions;
    /** ртп потоки */
    private rtps: RtpData[];
    /** id операции */
    private opId: string;
    /** папка с файлами */
    private filesDir: string;
    private info: RtpInfoData[];
    private wav: string;
    constructor(options: Pcap2WavOptions) {
        this.options = options || {};
        this.opId = helpers.random();
        this.filesDir = path.resolve(__dirname, '../../files');
        this.options.pcap = path.resolve(this.options.pcap);
        this.wav = this.options.wav || path.resolve(this.filesDir, `${this.opId}.wav`);
        this.info = [];
        this.rtps = [];
    }

    public async convert() {
        debug('convert start');
        await this.loadInfo();
        this.filterInfo();
        await this.loadRtps();
        await this.createWavs();
        await this.mergeWavs();
        debug('convert finish');
        const { wav } = this;
        const success = true;
        const rtpCount = this.rtps.length;
        return { success, wav, rtpCount };
    }

    private async loadInfo() {
        const { info } = await tshark.rtpInfo(this.options);
        this.info = info;
    }

    private filterInfo() {
        const { filters = [] } = this.options;
        if (!Array.isArray(filters)) {
            return;
        }
        if (filters.length < 1) {
            return;
        }
        this.info = this.info.filter((stream) =>
            filters.some((filter) =>
                filter.ssrc.toLowerCase() === stream.ssrc.toLowerCase() && filter.dstPort === stream.dstPort));
    }

    private async loadRtps() {
        this.rtps = await Promise.all(this.info.map(async (rtp, i) => {
            const payloadType = helpers.payloadTypes[rtp.codec];
            const codecFile = path.resolve(this.filesDir, `${this.opId}_${i}.${rtp.codec}`);
            const wavFile = path.resolve(this.filesDir, `${this.opId}_${i}.wav`);
            const payloads = await tshark.extractPayload({ pcap: this.options.pcap, ssrc: rtp.ssrc });
            const hexPayloads = payloads
                .split(':')
                .map((payload) => String.fromCharCode(parseInt(payload, 16)))
                .join('');

            return {
                payloadType,
                payloads,
                hexPayloads,
                codecFile,
                wavFile,
                i,
                ...rtp,
            };
        }));
    }

    private async createWavs() {
        await Promise.all(this.rtps.map(async (rtp) => {
            await helpers.fs.writeFileAsync(rtp.codecFile, rtp.hexPayloads, { encoding: 'ascii' });
            await sox.convertToWav(rtp.codec, rtp.codecFile, rtp.wavFile);
        }));
    }

    private async mergeWavs() {
        if (this.rtps.length > 1) {
            debug(`merging ${this.rtps.length} wavs into one`);
            const wavPaths = this.rtps.map((rtp) => rtp.wavFile).join(' ');
            await sox.mergeWavs(wavPaths, this.wav);
        }
        if (this.rtps.length === 1) {
            const data = await helpers.fs.readFileAsync(this.rtps[0].wavFile);
            await helpers.fs.writeFileAsync(this.wav, data);
        }
    }

}

export {
    PcapToWav,
};
