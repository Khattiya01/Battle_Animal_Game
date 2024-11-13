import crypto from 'crypto';

export class EncryptDecrypt {
    private static EDKey: Buffer = EncryptDecrypt.strToByteArray('SMART', 32);
    private static EDIv: Buffer = EncryptDecrypt.strToByteArray('HR', 16);
    private static algorithm: string = 'aes-256-cbc';

    public static encryption(encryptStr: string): string {
        let cipher = crypto.createCipheriv(EncryptDecrypt.algorithm, EncryptDecrypt.EDKey, EncryptDecrypt.EDIv);
        let encrypted = cipher.update(encryptStr, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    public static decryption(decryptStr: string): string {
        let decipher = crypto.createDecipheriv(EncryptDecrypt.algorithm, EncryptDecrypt.EDKey, EncryptDecrypt.EDIv);
        let decrypted = decipher.update(decryptStr, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    private static strToByteArray(str: string, total: number): Buffer {
        let bytes = Buffer.from(str, 'utf8');
        let padding = Buffer.alloc(total - bytes.length, 0);
        return Buffer.concat([bytes, padding], total);
    }
}
