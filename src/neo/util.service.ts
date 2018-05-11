import { Injectable } from '@angular/core';

export const ASSET = {
    NEO: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
    GAS: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
};

@Injectable()
export class UtilService {

    constructor() { }
    /**
     * parse from arraybuffer to hex string
     * @param arr array buffer
     */
    public ab2hex(arr) {
        if (typeof arr !== 'object') {
            return '';
        }
        let result = '';
        for (let i = 0; i < arr.length; i++) {
          let str = arr[i].toString(16);
          str = str.length === 0 ? '00'
            : str.length === 1 ? '0' + str
              : str;
          result += str;
        }
        return result;
    }

    public num2hexstring(num, size = 1, littleEndian = false): string {
        if (typeof num !== 'number') {
            throw new Error('num must be numeric');
        }
        if (num < 0) {
            throw new RangeError('num is unsigned (>= 0)');
        }
        if (size % 1 !== 0) {
            throw new Error('size must be a whole integer');
        }
        if (!Number.isSafeInteger(num)) {
            throw new RangeError(`num (${num}) must be a safe integer`);
        }
        size = size * 2;
        let hexstring = num.toString(16);
        hexstring = hexstring.length % size === 0 ? hexstring : ('0'.repeat(size) + hexstring).substring(hexstring.length);
        if (littleEndian) {
            hexstring = this.reverseHex(hexstring);
        }
        return hexstring;
    }

    public reverseHex(hex: string): string {
        let out = '';
        for (let i = hex.length - 2; i >= 0; i -= 2) {
            out += hex.substr(i, 2);
        }
        return out;
    }
}
