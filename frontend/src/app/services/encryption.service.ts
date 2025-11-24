import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    private readonly secretKey = '12345678901234567890123456789012'; // Must match backend key

    constructor() { }

    encrypt(data: any): string {
        try {
            const jsonString = JSON.stringify(data);
            const key = CryptoJS.enc.Utf8.parse(this.secretKey);
            const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        } catch (e) {
            console.error('Error encrypting data', e);
            return '';
        }
    }

    decrypt(encryptedData: string): any {
        try {
            const key = CryptoJS.enc.Utf8.parse(this.secretKey);
            const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedString);
        } catch (e) {
            console.error('Error decrypting data', e);
            return null;
        }
    }
}
