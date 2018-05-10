import { Injectable } from '@angular/core';

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
