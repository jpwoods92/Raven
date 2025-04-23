import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class MfaService {
  // Generate a secret for a user
  generateSecret(username: string): { otpAuthUrl: string; base32: string } {
    const secret = speakeasy.generateSecret({
      name: `Raven:${username}`,
      length: 20,
    });

    return {
      otpAuthUrl: secret.otpauth_url || '',
      base32: secret.base32,
    };
  } // Verify a token against a secret
  verifyToken(token: string, secret: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
    });
  }

  // Generate QR code for the OTP auth URL
  async generateQrCode(otpAuthUrl: string): Promise<string> {
    return await QRCode.toDataURL(otpAuthUrl);
  }
}
