import { createHmac, timingSafeEqual } from 'crypto';

export const verifyStripeSignature = (
  payload: string,
  signature: string,
  secret: string,
): boolean => {
  try {
    const [timestamp, signatureHash] = signature.split(',').map(part => {
      const [, value] = part.split('=');
      return value;
    });

    if (!timestamp || !signatureHash) {
      return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    return timingSafeEqual(
      Buffer.from(signatureHash),
      Buffer.from(expectedSignature),
    );
  } catch {
    return false;
  }
};

export const verifyGitHubSignature = (
  payload: string,
  signature: string,
  secret: string,
): boolean => {
  try {
    const expectedSignature = `sha256=${
      createHmac('sha256', secret)
        .update(payload)
        .digest('hex')
    }`;

    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  } catch {
    return false;
  }
};

export const verifySlackSignature = (
  payload: string,
  timestamp: string,
  signature: string,
  secret: string,
): boolean => {
  try {
    const basestring = `v0:${timestamp}:${payload}`;
    const expectedSignature = `v0=${
      createHmac('sha256', secret)
        .update(basestring)
        .digest('hex')
    }`;

    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  } catch {
    return false;
  }
};
