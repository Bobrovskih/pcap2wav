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
        debug('this.filesDir', this.filesDir);
        this.options.pcap = path.resolve(this.options.pcap);
        this.options.clean = this.options.clean === false ? false : true;
        debug('this.options.pcap', this.options.pcap);
        this.wav = this.options.wav || path.resolve(this.filesDir, `${this.opId}.wav`);
        debug('this.wav', this.wav);
        this.info = [];
        this.rtps = [];
    }

    public async convert() {
        try {
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
            await this.cleanTrash();
            return {
                success,
                wav,
                rtpCount,
            };
        } catch (error) {
            await this.cleanTrash();
            const success = false;
            const wav = '';
            const rtpCount = null;
            return {
                success,
                error,
                wav,
                rtpCount,
            };
        }
    }

    private async loadInfo() {
        const { info } = await tshark.rtpInfo(this.options);
        this.info = info;
        debug('this.info.length', this.info.length);
    }

    private filterInfo() {
        const { filters = [] } = this.options;
        if (!Array.isArray(filters)) {
            return;
        }
        if (filters.length < 1) {
            return;
        }
        this.info = this.info.filter((stream) => {
            return filters.some((filter) => {
                const ssrcEqual = filter.ssrc.toLowerCase() === stream.ssrc.toLowerCase();
                const dstPortEqual = filter.dstPort === stream.dstPort;
                const dstIpEqual = filter.dstIp === stream.dstIp;
                const hit = ssrcEqual && dstIpEqual && dstPortEqual;
                return hit;
            });
        });
        debug('filterInfo this.info.length', this.info.length);
    }

    private async loadRtps() {
        this.rtps = await Promise.all(this.info.map(async (rtp, i) => {
            debug('loadRtp i', i, 'rtp.ssrc', rtp.ssrc);
            const payloadType = helpers.payloadTypes[rtp.codec];
            const codecFile = path.resolve(this.filesDir, `${this.opId}_${i}.${rtp.codec}`);
            const wavFile = path.resolve(this.filesDir, `${this.opId}_${i}.wav`);
            const opts = {
                pcap: this.options.pcap,
                ssrc: rtp.ssrc,
                dstIp: rtp.dstIp,
                dstPort: rtp.dstPort,
            };
            const payloads = await tshark.extractPayload(opts);
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
            debug('create wav rtp.ssrc', rtp.ssrc);
            await helpers.fs.writeFileAsync(rtp.codecFile, rtp.hexPayloads, { encoding: 'ascii' });
            await sox.convertToWav(rtp.codec, rtp.codecFile, rtp.wavFile);
        }));
    }

    private async mergeWavs() {
        if (this.rtps.length > 1) {
            debug(`merging ${this.rtps.length} wavs into one`);
            const wavPaths = this.rtps.map((rtp) => rtp.wavFile).join(' ');
            await sox.mergeWavs(wavPaths, this.wav);
            return;
        }
        if (this.rtps.length === 1) {
            debug('this.rtps.length === 1. copying one rtp in wav');
            const data = await helpers.fs.readFileAsync(this.rtps[0].wavFile);
            await helpers.fs.writeFileAsync(this.wav, data);
            return;
        }
        throw Error(`cannot merge wav, this.rtps.length: ${this.rtps.length}`);
    }

    private async cleanTrash() {
        if (!this.options.clean) {
            return;
        }
        await Promise.all(this.rtps.map(async (rtp) => {
            const trashs = [rtp.wavFile, rtp.codecFile];
            await Promise.all(trashs.map(async (trash) => {
                const exists = await helpers.fs.existsAsync(trash);
                if (exists) {
                    await helpers.fs.unlinkAsync(trash);
                }
            }));
        }));
    }

}

export {
    PcapToWav,
};
