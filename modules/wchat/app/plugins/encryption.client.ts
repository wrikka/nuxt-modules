// E2EE Encryption Plugin - Client-side crypto utilities
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (!config.public.wchat?.enableE2EE) {
    return {
      provide: {
        crypto: null
      }
    }
  }

  // Generate encryption key pair
  const generateKeyPair = async (): Promise<CryptoKeyPair> => {
    return await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    )
  }

  // Export key to string
  const exportKey = async (key: CryptoKey): Promise<string> => {
    const exported = await window.crypto.subtle.exportKey('spki', key)
    return btoa(String.fromCharCode(...new Uint8Array(exported)))
  }

  // Import key from string
  const importKey = async (keyStr: string): Promise<CryptoKey> => {
    const raw = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0))
    return await window.crypto.subtle.importKey(
      'spki',
      raw,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      true,
      ['encrypt']
    )
  }

  // Encrypt message
  const encrypt = async (message: string, publicKey: CryptoKey): Promise<string> => {
    const encoded = new TextEncoder().encode(message)
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      encoded
    )
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  }

  // Decrypt message
  const decrypt = async (encrypted: string, privateKey: CryptoKey): Promise<string> => {
    const raw = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0))
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      raw
    )
    return new TextDecoder().decode(decrypted)
  }

  // Generate AES key for symmetric encryption (faster for large messages)
  const generateAESKey = async (): Promise<CryptoKey> => {
    return await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  }

  // Encrypt with AES-GCM
  const encryptAES = async (message: string, key: CryptoKey): Promise<{ iv: string; data: string }> => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encoded = new TextEncoder().encode(message)
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    )
    return {
      iv: btoa(String.fromCharCode(...iv)),
      data: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    }
  }

  // Decrypt with AES-GCM
  const decryptAES = async (iv: string, data: string, key: CryptoKey): Promise<string> => {
    const ivRaw = Uint8Array.from(atob(iv), c => c.charCodeAt(0))
    const dataRaw = Uint8Array.from(atob(data), c => c.charCodeAt(0))
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivRaw },
      key,
      dataRaw
    )
    return new TextDecoder().decode(decrypted)
  }

  return {
    provide: {
      crypto: {
        generateKeyPair,
        exportKey,
        importKey,
        encrypt,
        decrypt,
        generateAESKey,
        encryptAES,
        decryptAES
      }
    }
  }
})
