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
}
