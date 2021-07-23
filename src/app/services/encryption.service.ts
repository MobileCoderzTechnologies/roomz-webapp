import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private token = 'Roomz!';
  constructor() { }

  encrypt(data: any): string {
    const key = crypto.enc.Base64.parse(this.token);
    const iv = crypto.enc.Base64.parse(this.token);
    let encrypted = crypto.AES.encrypt(
      JSON.stringify(data), key, {
      keySize: 16,
      iv,
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7
    }
    );
    encrypted = encrypted.toString();
    return encrypted;
  }

  decrypt(encrypted: string): string {
    const key = crypto.enc.Base64.parse(this.token);
    const iv = crypto.enc.Base64.parse(this.token);

    const decrypted = crypto.AES.decrypt(encrypted, key, {
      keySize: 16,
      iv,
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7
    })
    .toString(crypto.enc.Utf8);
    return decrypted;
  }
}
