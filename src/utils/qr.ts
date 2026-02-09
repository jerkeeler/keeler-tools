// Self-contained QR code encoder (ISO 18004) — zero dependencies
// Byte mode only, versions 1-40, error correction levels L/M/Q/H

type ECLevel = 'L' | 'M' | 'Q' | 'H';
const EC_INDEX: Record<ECLevel, number> = { L: 0, M: 1, Q: 2, H: 3 };

// Capacity table: max data bytes per version per EC level [L, M, Q, H]
const DATA_CAPACITY: number[][] = [
    /* v1  */ [19, 16, 13, 9],
    /* v2  */ [34, 28, 22, 16],
    /* v3  */ [55, 44, 34, 26],
    /* v4  */ [80, 64, 48, 36],
    /* v5  */ [108, 86, 62, 46],
    /* v6  */ [136, 108, 76, 60],
    /* v7  */ [156, 124, 88, 66],
    /* v8  */ [194, 154, 110, 86],
    /* v9  */ [232, 182, 132, 100],
    /* v10 */ [274, 216, 154, 122],
    /* v11 */ [324, 254, 180, 140],
    /* v12 */ [370, 290, 206, 158],
    /* v13 */ [428, 334, 244, 180],
    /* v14 */ [461, 365, 261, 197],
    /* v15 */ [523, 415, 295, 223],
    /* v16 */ [589, 453, 325, 253],
    /* v17 */ [647, 507, 367, 283],
    /* v18 */ [721, 563, 397, 313],
    /* v19 */ [795, 627, 445, 341],
    /* v20 */ [861, 669, 485, 385],
    /* v21 */ [932, 714, 512, 406],
    /* v22 */ [1006, 782, 568, 442],
    /* v23 */ [1094, 860, 614, 464],
    /* v24 */ [1174, 914, 664, 514],
    /* v25 */ [1276, 1000, 718, 538],
    /* v26 */ [1370, 1062, 754, 596],
    /* v27 */ [1468, 1128, 808, 628],
    /* v28 */ [1531, 1193, 871, 661],
    /* v29 */ [1631, 1267, 911, 701],
    /* v30 */ [1735, 1373, 985, 745],
    /* v31 */ [1843, 1455, 1033, 793],
    /* v32 */ [1955, 1541, 1115, 845],
    /* v33 */ [2071, 1631, 1171, 901],
    /* v34 */ [2191, 1725, 1231, 961],
    /* v35 */ [2306, 1812, 1286, 986],
    /* v36 */ [2434, 1914, 1354, 1054],
    /* v37 */ [2566, 1992, 1426, 1096],
    /* v38 */ [2702, 2102, 1502, 1142],
    /* v39 */ [2812, 2216, 1582, 1222],
    /* v40 */ [2956, 2334, 1666, 1276],
];

// EC blocks: [numBlocks, dataCodewordsPerBlock, ecCodewordsPerBlock][]
// Some versions split into two groups with different block counts
interface ECBlockInfo {
    groups: { count: number; dataCodewords: number }[];
    ecCodewordsPerBlock: number;
    totalDataCodewords: number;
}

// Total codewords per version
const TOTAL_CODEWORDS: number[] = [
    26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991,
    1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876,
    3034, 3196, 3362, 3532, 3706,
];

// EC block definitions: [ecPerBlock, [group1count, group1data], [group2count, group2data]?]
// Indexed by version-1, then EC level index
const EC_BLOCKS: [number, [number, number], [number, number]?][][] = [
    /* v1  */ [
        [7, [1, 19]],
        [10, [1, 16]],
        [13, [1, 13]],
        [17, [1, 9]],
    ],
    /* v2  */ [
        [10, [1, 34]],
        [16, [1, 28]],
        [22, [1, 22]],
        [28, [1, 16]],
    ],
    /* v3  */ [
        [15, [1, 55]],
        [26, [1, 44]],
        [18, [2, 17]],
        [22, [2, 13]],
    ],
    /* v4  */ [
        [20, [1, 80]],
        [18, [2, 32]],
        [26, [2, 24]],
        [16, [4, 9]],
    ],
    /* v5  */ [
        [26, [1, 108]],
        [24, [2, 43]],
        [18, [2, 15], [2, 16]],
        [22, [2, 11], [2, 12]],
    ],
    /* v6  */ [
        [18, [2, 68]],
        [16, [4, 27]],
        [24, [4, 19]],
        [28, [4, 15]],
    ],
    /* v7  */ [
        [20, [2, 78]],
        [18, [4, 31]],
        [18, [2, 14], [4, 15]],
        [26, [4, 13], [1, 14]],
    ],
    /* v8  */ [
        [24, [2, 97]],
        [22, [2, 38], [2, 39]],
        [22, [4, 18], [2, 19]],
        [26, [4, 14], [2, 15]],
    ],
    /* v9  */ [
        [30, [2, 116]],
        [22, [3, 36], [2, 37]],
        [20, [4, 16], [4, 17]],
        [24, [4, 12], [4, 13]],
    ],
    /* v10 */ [
        [18, [2, 68], [2, 69]],
        [26, [4, 43], [1, 44]],
        [24, [6, 19], [2, 20]],
        [28, [6, 15], [2, 16]],
    ],
    /* v11 */ [
        [20, [4, 81]],
        [30, [1, 50], [4, 51]],
        [28, [4, 22], [4, 23]],
        [24, [3, 12], [8, 13]],
    ],
    /* v12 */ [
        [24, [2, 92], [2, 93]],
        [22, [6, 36], [2, 37]],
        [26, [4, 20], [6, 21]],
        [28, [7, 14], [4, 15]],
    ],
    /* v13 */ [
        [26, [4, 107]],
        [22, [8, 37], [1, 38]],
        [24, [8, 20], [4, 21]],
        [22, [12, 11], [4, 12]],
    ],
    /* v14 */ [
        [30, [3, 115], [1, 116]],
        [24, [4, 40], [5, 41]],
        [20, [11, 16], [5, 17]],
        [24, [11, 12], [5, 13]],
    ],
    /* v15 */ [
        [22, [5, 87], [1, 88]],
        [24, [5, 41], [5, 42]],
        [30, [5, 24], [7, 25]],
        [24, [11, 12], [7, 13]],
    ],
    /* v16 */ [
        [24, [5, 98], [1, 99]],
        [28, [7, 45], [3, 46]],
        [24, [15, 19], [2, 20]],
        [30, [3, 15], [13, 16]],
    ],
    /* v17 */ [
        [28, [1, 107], [5, 108]],
        [28, [10, 46], [1, 47]],
        [28, [1, 22], [15, 23]],
        [28, [2, 14], [17, 15]],
    ],
    /* v18 */ [
        [30, [5, 120], [1, 121]],
        [26, [9, 43], [4, 44]],
        [28, [17, 22], [1, 23]],
        [28, [2, 14], [19, 15]],
    ],
    /* v19 */ [
        [28, [3, 113], [4, 114]],
        [26, [3, 44], [11, 45]],
        [26, [17, 21], [4, 22]],
        [26, [9, 13], [16, 14]],
    ],
    /* v20 */ [
        [28, [3, 107], [5, 108]],
        [26, [3, 41], [13, 42]],
        [28, [15, 24], [5, 25]],
        [28, [15, 15], [10, 16]],
    ],
    /* v21 */ [
        [28, [4, 116], [4, 117]],
        [26, [17, 42]],
        [30, [17, 22], [6, 23]],
        [28, [19, 16], [6, 17]],
    ],
    /* v22 */ [
        [28, [2, 111], [7, 112]],
        [28, [17, 46]],
        [24, [7, 24], [16, 25]],
        [30, [34, 13]],
    ],
    /* v23 */ [
        [30, [4, 121], [5, 122]],
        [28, [4, 47], [14, 48]],
        [30, [11, 24], [14, 25]],
        [30, [16, 15], [14, 16]],
    ],
    /* v24 */ [
        [30, [6, 117], [4, 118]],
        [28, [6, 45], [14, 46]],
        [30, [11, 24], [16, 25]],
        [30, [30, 16], [2, 17]],
    ],
    /* v25 */ [
        [26, [8, 106], [4, 107]],
        [28, [8, 47], [13, 48]],
        [30, [7, 24], [22, 25]],
        [30, [22, 15], [13, 16]],
    ],
    /* v26 */ [
        [28, [10, 114], [2, 115]],
        [28, [19, 46], [4, 47]],
        [28, [28, 22], [6, 23]],
        [30, [33, 16], [4, 17]],
    ],
    /* v27 */ [
        [30, [8, 122], [4, 123]],
        [28, [22, 45], [3, 46]],
        [30, [8, 23], [26, 24]],
        [30, [12, 15], [28, 16]],
    ],
    /* v28 */ [
        [30, [3, 117], [10, 118]],
        [28, [3, 45], [23, 46]],
        [30, [4, 24], [31, 25]],
        [30, [11, 15], [31, 16]],
    ],
    /* v29 */ [
        [30, [7, 116], [7, 117]],
        [28, [21, 45], [7, 46]],
        [30, [1, 23], [37, 24]],
        [30, [19, 15], [26, 16]],
    ],
    /* v30 */ [
        [30, [5, 115], [10, 116]],
        [28, [19, 47], [10, 48]],
        [30, [15, 24], [25, 25]],
        [30, [23, 15], [25, 16]],
    ],
    /* v31 */ [
        [30, [13, 115], [3, 116]],
        [28, [2, 46], [29, 47]],
        [30, [42, 24], [1, 25]],
        [30, [23, 15], [28, 16]],
    ],
    /* v32 */ [
        [30, [17, 115]],
        [28, [10, 46], [23, 47]],
        [30, [10, 24], [35, 25]],
        [30, [19, 15], [35, 16]],
    ],
    /* v33 */ [
        [30, [17, 115], [1, 116]],
        [28, [14, 46], [21, 47]],
        [30, [29, 24], [19, 25]],
        [30, [11, 15], [46, 16]],
    ],
    /* v34 */ [
        [30, [13, 115], [6, 116]],
        [28, [14, 46], [23, 47]],
        [30, [44, 24], [7, 25]],
        [30, [59, 16], [1, 17]],
    ],
    /* v35 */ [
        [30, [12, 121], [7, 122]],
        [28, [12, 47], [26, 48]],
        [30, [39, 24], [14, 25]],
        [30, [22, 15], [41, 16]],
    ],
    /* v36 */ [
        [30, [6, 121], [14, 122]],
        [28, [6, 47], [34, 48]],
        [30, [46, 24], [10, 25]],
        [30, [2, 15], [64, 16]],
    ],
    /* v37 */ [
        [30, [17, 122], [4, 123]],
        [28, [29, 46], [14, 47]],
        [30, [49, 24], [10, 25]],
        [30, [24, 15], [46, 16]],
    ],
    /* v38 */ [
        [30, [4, 122], [18, 123]],
        [28, [13, 46], [32, 47]],
        [30, [48, 24], [14, 25]],
        [30, [42, 15], [32, 16]],
    ],
    /* v39 */ [
        [30, [20, 117], [4, 118]],
        [28, [40, 47], [7, 48]],
        [30, [43, 24], [22, 25]],
        [30, [10, 15], [67, 16]],
    ],
    /* v40 */ [
        [30, [19, 118], [6, 119]],
        [28, [18, 47], [31, 48]],
        [30, [34, 24], [34, 25]],
        [30, [20, 15], [61, 16]],
    ],
];

// Alignment pattern center coordinates per version (version 2+)
const ALIGNMENT_POSITIONS: number[][] = [
    [], // v1 — none
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170],
];

// Format information strings for each EC level and mask pattern
// 15-bit BCH encoded, including mask for XOR pattern 101010000010010
const FORMAT_INFO: number[][] = [
    // L: masks 0-7
    [0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976],
    // M: masks 0-7
    [0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0],
    // Q: masks 0-7
    [0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed],
    // H: masks 0-7
    [0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b],
];

// Version information for versions 7-40 (18-bit BCH encoded)
const VERSION_INFO: number[] = [
    0x07c94, 0x085bc, 0x09a99, 0x0a4d3, 0x0bbf6, 0x0c762, 0x0d847, 0x0e60d, 0x0f928, 0x10b78,
    0x1145d, 0x12a17, 0x13532, 0x149a6, 0x15683, 0x168c9, 0x177ec, 0x18ec4, 0x191e1, 0x1afab,
    0x1b08e, 0x1cc1a, 0x1d33f, 0x1ed75, 0x1f250, 0x209d5, 0x216f0, 0x228ba, 0x2379f, 0x24b0b,
    0x2542e, 0x26a64, 0x27541,
];

// GF(256) arithmetic with primitive polynomial 0x11d
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

(function initGaloisField() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
        GF_EXP[i] = x;
        GF_LOG[x] = i;
        x = x << 1;
        if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) {
        GF_EXP[i] = GF_EXP[i - 255];
    }
})();

function gfMul(a: number, b: number): number {
    if (a === 0 || b === 0) return 0;
    return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
    let gen = new Uint8Array([1]);
    for (let i = 0; i < degree; i++) {
        const next = new Uint8Array(gen.length + 1);
        for (let j = 0; j < gen.length; j++) {
            next[j] ^= gfMul(gen[j], GF_EXP[i]);
            next[j + 1] ^= gen[j];
        }
        gen = next;
    }
    return gen;
}

function rsEncode(data: Uint8Array, ecCount: number): Uint8Array {
    const gen = rsGeneratorPoly(ecCount);
    const result = new Uint8Array(ecCount);
    for (let i = 0; i < data.length; i++) {
        const coef = data[i] ^ result[0];
        // Shift result left
        for (let j = 0; j < ecCount - 1; j++) {
            result[j] = result[j + 1];
        }
        result[ecCount - 1] = 0;
        if (coef !== 0) {
            for (let j = 0; j < ecCount; j++) {
                result[j] ^= gfMul(gen[j], coef);
            }
        }
    }
    return result;
}

function getECBlockInfo(version: number, ecLevel: ECLevel): ECBlockInfo {
    const ecIdx = EC_INDEX[ecLevel];
    const entry = EC_BLOCKS[version - 1][ecIdx];
    const ecPerBlock = entry[0];
    const g1 = entry[1];
    const g2 = entry[2];
    const groups: { count: number; dataCodewords: number }[] = [
        { count: g1[0], dataCodewords: g1[1] },
    ];
    if (g2) {
        groups.push({ count: g2[0], dataCodewords: g2[1] });
    }
    let totalData = 0;
    for (const g of groups) totalData += g.count * g.dataCodewords;
    return { groups, ecCodewordsPerBlock: ecPerBlock, totalDataCodewords: totalData };
}

function selectVersion(dataBytes: number, ecLevel: ECLevel): number {
    const ecIdx = EC_INDEX[ecLevel];
    for (let v = 0; v < 40; v++) {
        if (DATA_CAPACITY[v][ecIdx] >= dataBytes) return v + 1;
    }
    throw new Error('Data too large for QR code');
}

function encodeData(data: string, version: number, ecLevel: ECLevel): Uint8Array {
    const utf8 = new TextEncoder().encode(data);
    const ecInfo = getECBlockInfo(version, ecLevel);
    const totalDataCodewords = ecInfo.totalDataCodewords;

    // Byte mode indicator (0100) + character count
    const bits: number[] = [];
    function pushBits(value: number, count: number) {
        for (let i = count - 1; i >= 0; i--) {
            bits.push((value >> i) & 1);
        }
    }

    // Mode indicator: byte mode = 0100
    pushBits(0b0100, 4);

    // Character count indicator length depends on version
    const ccBits = version <= 9 ? 8 : 16;
    pushBits(utf8.length, ccBits);

    // Data bytes
    for (let bi = 0; bi < utf8.length; bi++) {
        pushBits(utf8[bi], 8);
    }

    // Terminator (up to 4 zeros)
    const totalBits = totalDataCodewords * 8;
    const terminatorLen = Math.min(4, totalBits - bits.length);
    for (let i = 0; i < terminatorLen; i++) bits.push(0);

    // Pad to byte boundary
    while (bits.length % 8 !== 0) bits.push(0);

    // Convert to bytes
    const codewords = new Uint8Array(totalDataCodewords);
    for (let i = 0; i < bits.length; i += 8) {
        let byte = 0;
        for (let j = 0; j < 8; j++) byte = (byte << 1) | (bits[i + j] || 0);
        codewords[i / 8] = byte;
    }

    // Pad codewords with alternating 0xEC, 0x11
    let padIdx = bits.length / 8;
    let padToggle = false;
    while (padIdx < totalDataCodewords) {
        codewords[padIdx++] = padToggle ? 0x11 : 0xec;
        padToggle = !padToggle;
    }

    return codewords;
}

function interleaveBlocks(
    dataCodewords: Uint8Array,
    version: number,
    ecLevel: ECLevel
): Uint8Array {
    const ecInfo = getECBlockInfo(version, ecLevel);
    const totalCodewords = TOTAL_CODEWORDS[version - 1];

    // Split data into blocks
    const dataBlocks: Uint8Array[] = [];
    const ecBlocks: Uint8Array[] = [];
    let offset = 0;

    for (const group of ecInfo.groups) {
        for (let i = 0; i < group.count; i++) {
            const block = dataCodewords.slice(offset, offset + group.dataCodewords);
            dataBlocks.push(block);
            ecBlocks.push(rsEncode(block, ecInfo.ecCodewordsPerBlock));
            offset += group.dataCodewords;
        }
    }

    // Interleave data codewords
    const result = new Uint8Array(totalCodewords);
    let idx = 0;
    const maxDataLen = Math.max(...dataBlocks.map((b) => b.length));
    for (let i = 0; i < maxDataLen; i++) {
        for (const block of dataBlocks) {
            if (i < block.length) result[idx++] = block[i];
        }
    }

    // Interleave EC codewords
    for (let i = 0; i < ecInfo.ecCodewordsPerBlock; i++) {
        for (const block of ecBlocks) {
            if (i < block.length) result[idx++] = block[i];
        }
    }

    return result;
}

function createMatrix(version: number): { matrix: boolean[][]; reserved: boolean[][] } {
    const size = 17 + version * 4;
    const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
    const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

    // Place finder patterns (7x7) at three corners
    function placeFinder(row: number, col: number) {
        for (let r = -1; r <= 7; r++) {
            for (let c = -1; c <= 7; c++) {
                const mr = row + r;
                const mc = col + c;
                if (mr < 0 || mr >= size || mc < 0 || mc >= size) continue;
                reserved[mr][mc] = true;
                if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
                    // Finder pattern: outer border, inner square
                    const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
                    const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
                    matrix[mr][mc] = isOuter || isInner;
                } else {
                    matrix[mr][mc] = false; // Separator
                }
            }
        }
    }

    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
        reserved[6][i] = true;
        matrix[6][i] = i % 2 === 0;
        reserved[i][6] = true;
        matrix[i][6] = i % 2 === 0;
    }

    // Alignment patterns
    if (version >= 2) {
        const positions = ALIGNMENT_POSITIONS[version - 1];
        for (const row of positions) {
            for (const col of positions) {
                // Skip if overlapping with finder patterns
                if (row <= 8 && col <= 8) continue;
                if (row <= 8 && col >= size - 9) continue;
                if (row >= size - 9 && col <= 8) continue;
                for (let r = -2; r <= 2; r++) {
                    for (let c = -2; c <= 2; c++) {
                        reserved[row + r][col + c] = true;
                        const isOuter = r === -2 || r === 2 || c === -2 || c === 2;
                        const isCenter = r === 0 && c === 0;
                        matrix[row + r][col + c] = isOuter || isCenter;
                    }
                }
            }
        }
    }

    // Dark module
    reserved[size - 8][8] = true;
    matrix[size - 8][8] = true;

    // Reserve format info areas (will be filled later)
    for (let i = 0; i <= 8; i++) {
        if (i < size) {
            reserved[8][i] = true;
            reserved[i][8] = true;
        }
    }
    for (let i = 0; i < 8; i++) {
        reserved[8][size - 1 - i] = true;
        reserved[size - 1 - i][8] = true;
    }

    // Reserve version info areas (versions 7+)
    if (version >= 7) {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 3; j++) {
                reserved[i][size - 11 + j] = true;
                reserved[size - 11 + j][i] = true;
            }
        }
    }

    return { matrix, reserved };
}

function placeData(matrix: boolean[][], reserved: boolean[][], codewords: Uint8Array): void {
    const size = matrix.length;
    let bitIdx = 0;
    const totalBits = codewords.length * 8;

    // Zigzag traversal: right to left in column pairs, bottom to top alternating
    let col = size - 1;
    while (col >= 0) {
        // Skip timing pattern column
        if (col === 6) col--;
        if (col < 0) break;

        for (let row = 0; row < size; row++) {
            // Direction alternates: even column-pairs go upward, odd go downward
            const colPairIdx = col >= 7 ? (size - 1 - col) >> 1 : (size - 2 - col) >> 1;
            const upward = colPairIdx % 2 === 0;
            const actualRow = upward ? size - 1 - row : row;

            for (let dx = 0; dx <= 1; dx++) {
                const c = col - dx;
                if (c < 0) continue;
                if (reserved[actualRow][c]) continue;
                if (bitIdx < totalBits) {
                    const bit = (codewords[Math.floor(bitIdx / 8)] >> (7 - (bitIdx % 8))) & 1;
                    matrix[actualRow][c] = bit === 1;
                    bitIdx++;
                }
            }
        }
        col -= 2;
    }
}

function applyMask(matrix: boolean[][], reserved: boolean[][], maskNum: number): boolean[][] {
    const size = matrix.length;
    const masked = matrix.map((row) => [...row]);
    const maskFn = getMaskFunction(maskNum);

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!reserved[r][c] && maskFn(r, c)) {
                masked[r][c] = !masked[r][c];
            }
        }
    }
    return masked;
}

function getMaskFunction(mask: number): (row: number, col: number) => boolean {
    switch (mask) {
        case 0:
            return (r, c) => (r + c) % 2 === 0;
        case 1:
            return (r) => r % 2 === 0;
        case 2:
            return (_, c) => c % 3 === 0;
        case 3:
            return (r, c) => (r + c) % 3 === 0;
        case 4:
            return (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
        case 5:
            return (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0;
        case 6:
            return (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
        case 7:
            return (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
        default:
            return () => false;
    }
}

function evaluatePenalty(matrix: boolean[][]): number {
    const size = matrix.length;
    let penalty = 0;

    // Rule 1: Five or more same-colored modules in a row/column
    for (let r = 0; r < size; r++) {
        let count = 1;
        for (let c = 1; c < size; c++) {
            if (matrix[r][c] === matrix[r][c - 1]) {
                count++;
            } else {
                if (count >= 5) penalty += count - 2;
                count = 1;
            }
        }
        if (count >= 5) penalty += count - 2;
    }
    for (let c = 0; c < size; c++) {
        let count = 1;
        for (let r = 1; r < size; r++) {
            if (matrix[r][c] === matrix[r - 1][c]) {
                count++;
            } else {
                if (count >= 5) penalty += count - 2;
                count = 1;
            }
        }
        if (count >= 5) penalty += count - 2;
    }

    // Rule 2: 2x2 blocks of same color
    for (let r = 0; r < size - 1; r++) {
        for (let c = 0; c < size - 1; c++) {
            const val = matrix[r][c];
            if (
                val === matrix[r][c + 1] &&
                val === matrix[r + 1][c] &&
                val === matrix[r + 1][c + 1]
            ) {
                penalty += 3;
            }
        }
    }

    // Rule 3: Finder-like patterns (1:1:3:1:1 with 4-module white on one side)
    const pattern1 = [true, false, true, true, true, false, true, false, false, false, false];
    const pattern2 = [false, false, false, false, true, false, true, true, true, false, true];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c <= size - 11; c++) {
            let match1 = true;
            let match2 = true;
            for (let i = 0; i < 11; i++) {
                if (matrix[r][c + i] !== pattern1[i]) match1 = false;
                if (matrix[r][c + i] !== pattern2[i]) match2 = false;
            }
            if (match1 || match2) penalty += 40;
        }
    }
    for (let c = 0; c < size; c++) {
        for (let r = 0; r <= size - 11; r++) {
            let match1 = true;
            let match2 = true;
            for (let i = 0; i < 11; i++) {
                if (matrix[r + i][c] !== pattern1[i]) match1 = false;
                if (matrix[r + i][c] !== pattern2[i]) match2 = false;
            }
            if (match1 || match2) penalty += 40;
        }
    }

    // Rule 4: Proportion of dark modules
    let darkCount = 0;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r][c]) darkCount++;
        }
    }
    const totalModules = size * size;
    const pct = (darkCount / totalModules) * 100;
    const prevFive = Math.floor(pct / 5) * 5;
    const nextFive = prevFive + 5;
    penalty += Math.min(Math.abs(prevFive - 50) / 5, Math.abs(nextFive - 50) / 5) * 10;

    return penalty;
}

function placeFormatInfo(matrix: boolean[][], ecLevel: ECLevel, maskNum: number): void {
    const size = matrix.length;
    const ecIdx = EC_INDEX[ecLevel];
    const formatBits = FORMAT_INFO[ecIdx][maskNum];

    // Place format info around finder patterns
    for (let i = 0; i < 15; i++) {
        const bit = ((formatBits >> (14 - i)) & 1) === 1;

        // Top-left: along row 8 and column 8
        if (i < 6) {
            matrix[8][i] = bit;
        } else if (i === 6) {
            matrix[8][7] = bit;
        } else if (i === 7) {
            matrix[8][8] = bit;
        } else if (i === 8) {
            matrix[7][8] = bit;
        } else {
            matrix[14 - i][8] = bit;
        }

        // Second copy: bottom-left and top-right
        if (i < 8) {
            matrix[size - 1 - i][8] = bit;
        } else {
            matrix[8][size - 15 + i] = bit;
        }
    }
}

function placeVersionInfo(matrix: boolean[][], version: number): void {
    if (version < 7) return;
    const size = matrix.length;
    const versionBits = VERSION_INFO[version - 7];

    for (let i = 0; i < 18; i++) {
        const bit = ((versionBits >> i) & 1) === 1;
        const row = Math.floor(i / 3);
        const col = size - 11 + (i % 3);
        matrix[row][col] = bit;
        matrix[col][row] = bit;
    }
}

function addQuietZone(matrix: boolean[][]): boolean[][] {
    const size = matrix.length;
    const newSize = size + 8; // 4 modules on each side
    const result: boolean[][] = Array.from({ length: newSize }, () => Array(newSize).fill(false));
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            result[r + 4][c + 4] = matrix[r][c];
        }
    }
    return result;
}

export function generateQrMatrix(data: string, errorCorrectionLevel: ECLevel = 'H'): boolean[][] {
    const utf8 = new TextEncoder().encode(data);
    // +3 for mode indicator + character count overhead in bytes
    const dataByteCount = utf8.length;
    const version = selectVersion(dataByteCount, errorCorrectionLevel);

    const dataCodewords = encodeData(data, version, errorCorrectionLevel);
    const allCodewords = interleaveBlocks(dataCodewords, version, errorCorrectionLevel);

    const { matrix, reserved } = createMatrix(version);
    placeData(matrix, reserved, allCodewords);

    // Try all 8 masks, pick the one with lowest penalty
    let bestMask = 0;
    let bestPenalty = Infinity;
    let bestMatrix: boolean[][] = [];

    for (let mask = 0; mask < 8; mask++) {
        const masked = applyMask(matrix, reserved, mask);
        placeFormatInfo(masked, errorCorrectionLevel, mask);
        placeVersionInfo(masked, version);
        const penalty = evaluatePenalty(masked);
        if (penalty < bestPenalty) {
            bestPenalty = penalty;
            bestMask = mask;
            bestMatrix = masked;
        }
    }

    // Apply best mask to original and add format/version info
    const finalMatrix = applyMask(matrix, reserved, bestMask);
    placeFormatInfo(finalMatrix, errorCorrectionLevel, bestMask);
    placeVersionInfo(finalMatrix, version);

    return addQuietZone(finalMatrix);
}
