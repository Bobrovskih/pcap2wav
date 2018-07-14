declare class Pcap2WavOptions {
    pcap: string;
    wav?: string;
    filters?: RtpInfoData[] | Filters[];
    clean?: boolean;
}

declare class Filters {
    ssrc: string;
    dstPort: string;
    dstIp: string;
}

declare class RtpInfoOptions {
    pcap: string;
}

declare class RtpInfoData {
    srcIp: string;
    srcPort: string;
    dstIp: string;
    dstPort: string;
    ssrc: string;
    codec: string;
    packets: string
    lostPackets: string;
    lostPercent: string;
    maxDelta: string;
    maxJitter: string;
    meanJitter: string;
    problems: string;
}

declare class RtpData extends RtpInfoData {
    payloadType: string;
    payloads: string;
    hexPayloads: string;
    codecFile: string;
    wavFile: string;
    i: number;
}

export {
    Pcap2WavOptions,
    RtpInfoOptions,
    RtpInfoData,
    RtpData,
};
