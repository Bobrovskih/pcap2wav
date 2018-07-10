 [![npm version](https://badge.fury.io/js/pcap2wav.svg)](https://www.npmjs.com/package/pcap2wav) [![Build status branch:master](https://travis-ci.org/Bobrovskih/pcap2wav.svg?branch=master)](https://travis-ci.org/Bobrovskih/pcap2wav)
 [![coverage](https://codecov.io/gh/Bobrovskih/pcap2wav/branch/master/graph/badge.svg)](https://codecov.io/gh/Bobrovskih/pcap2wav)

## Требования
 - nodejs >= 8.0.0 
 - tshark 2.4.5
 - sox 14.4.2

## Установка
`npm i pcap2wav`

## Использование
```javascript
const options = { pcap: '/absolute/path/to/pcap/file.pcap' };
const { success, wav } = await pcap2wav(options);
console.log(success, wav); // => true, '/absolute/path/to/wav/file.wav'
```

| Параметр  | Тип  | Описание |
| --------- | ---- | -------- |
| options | <code>object</code> | параметры |
| options.pcap | <code>string</code> | абсолютный путь до .pcap файла |