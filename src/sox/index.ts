const debug = require('debug')('pcap2wav:sox:index');

class Sox {
    public convertCommand(codecName: string, toFile: string) {
        if (codecName === 'PCMA') {
            return `sox -t al -r 8000 -c 1 ${toFile}`;
        }
        if (codecName === 'PCMU') {
            return `sox -t ul -r 8000 -c 1 ${toFile}`;
        }
    }
}

const sox = new Sox();

export {
    sox,
    Sox,
};
