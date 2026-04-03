export const sampleMacosLog = `Filtering the log data using "composedMessage CONTAINS[c] "APDU""
Skipping info and debug messages, pass --info and/or --debug to include.
Timestamp                       Thread     Type        Activity             PID    TTL  
2026-04-01 11:47:15.015023+0200 0xc60280   Default     0x0                  20037  0    usbsmartcardreaderd: (CryptoTokenKit) [com.apple.CryptoTokenKit:APDULog] APDU -> 81 cb df 39 04
2026-04-01 11:47:15.025682+0200 0xc60280   Default     0x0                  20037  0    usbsmartcardreaderd: (CryptoTokenKit) [com.apple.CryptoTokenKit:APDULog] APDU <- 00 01 ae dc 90 00
2026-04-01 11:47:15.027236+0200 0xc60280   Default     0x0                  20037  0    usbsmartcardreaderd: (CryptoTokenKit) [com.apple.CryptoTokenKit:APDULog] APDU -> 81 cb 3f ff 05 4d 03 ff 81 80 00
2026-04-01 11:47:15.041091+0200 0xc60280   Default     0x0                  20037  0    usbsmartcardreaderd: (CryptoTokenKit) [com.apple.CryptoTokenKit:APDULog] APDU <- e2 10 a0 0b 8c 04 f0 00 00 00 a1 03 e0 07 07 83 01 80 9a 01 05 9b 01 05 99 01 ff 9c 01 ff 9d 01 81 9e 01 a5 91 14 00 06 08 01 aa 00 08 08 55 00 00 08 08 00 00 00 aa 00 00 00 90 00
2026-04-01 11:48:02.841743+0200 0xc9aedb   Default     0x0                  20037  0    usbsmartcardreaderd: (CryptoTokenKit) [com.apple.CryptoTokenKit:APDULog] APDU -> 00 a4 04 00 0b a0 00 00 03 08 00 00 10 00 01 00
2026-04-01 11:48:02.866002+0200 0xc9aedb   Default     0x0                  20037  0    usbsmartcardreaderd: (CryptoTokenKit) [com.apple.CryptoTokenKit:APDULog] APDU <- 61 11 4f 06 00 00 10 00 01 00 79 07 4f 05 a0 00 00 03 08 90 00
2026-04-01 11:48:02.866397+0200 0xc9aedb   Default     0x0                  20037  0    usbsmartcardreaderd: (CryptoTokenKit) [com.apple.CryptoTokenKit:APDULog] APDU -> 00 cb 3f ff 05 5c 03 ff f3 02 00
2026-04-01 11:48:02.900219+0200 0xc9aedb   Default     0x0                  20037  0    usbsmartcardreaderd: (CryptoTokenKit) [com.apple.CryptoTokenKit:APDULog] APDU <- 6a 80
`;

export const sampleSelectCommand = "00 a4 04 00 07 a0 00 00 03 08 00 00";
export const sampleSelectResponse =
  "61 11 4f 06 00 00 10 00 01 00 79 07 4f 05 a0 00 00 03 08 90 00";
export const sampleGetDataCommand = "00 cb 3f ff 05 5c 03 ff f3 02 00";
export const sampleErrorResponse = "6a 80";
