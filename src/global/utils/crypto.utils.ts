import { URL } from 'url';
import crypto from 'crypto';

export function signData(
  data: string,
  secret: string,
  alg = 'sha256',
  encoding: crypto.BinaryToTextEncoding = 'base64',
): string {
  return crypto.createHmac(alg, secret).update(data).digest(encoding);
}

export function hashData(data: string, alg = 'sha256', encoding: crypto.BinaryToTextEncoding = 'base64'): string {
  return crypto.createHash(alg).update(data).digest(encoding);
}

export function verifyDataSignature(data: string, secret: string, signature: string, alg = 'sha256'): boolean {
  return crypto.timingSafeEqual(Buffer.from(signData(data, secret, alg)), Buffer.from(signature));
}

export function signUrl(url: string, secret: string, signatureParam = 'sign', alg = 'sha256'): string {
  const urlObject = new URL(url);
  urlObject.searchParams.sort();

  const signature = signData(urlObject.href, secret, alg);
  urlObject.searchParams.set(signatureParam, signature);

  return urlObject.href;
}

export function verifyUrlSignature(url: string, secret: string, signatureParam = 'sign', alg = 'sha256'): boolean {
  const urlObject = new URL(url);
  urlObject.searchParams.sort();

  const signature = urlObject.searchParams.get(signatureParam) || '';
  urlObject.searchParams.delete(signatureParam);

  return verifyDataSignature(urlObject.href, secret, signature, alg);
}
