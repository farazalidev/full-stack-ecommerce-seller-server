import * as crypto from 'crypto';

export const encrypt = (data: string, key: string) => {
  const ENC_KEY = Buffer.from(key, 'hex');
  const IV = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Combine IV and encrypted data into a single string
  const encryptedDataWithIV = IV.toString('hex') + encrypted;

  return encryptedDataWithIV;
};
export const decrypt = (
  data: string,
  key: string,
): { success: boolean; data?: string } => {
  try {
    const ENC_KEY = Buffer.from(key, 'hex');

    // Extract IV from the input data
    const ivHex = data.slice(0, 32);
    const IV = Buffer.from(ivHex, 'hex');
    const encryptedData = data.slice(32);

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
    const decrypted = decipher.update(encryptedData, 'base64', 'utf8');

    return { success: true, data: decrypted + decipher.final('utf8') };
  } catch (error) {
    return { success: false, data: undefined };
  }
};
