import time
import RSA as rsa
from base64 import b64encode, b64decode

from Crypto.Random import random
from Crypto.PublicKey import DSA
from Crypto.Hash import SHA256

from ecdsa import SigningKey

if __name__ == '__main__':
    fingerprint = "1B1CCA6C76F20044376CE9E7B92B1F29174424BD7BBEE6D13883157772088D50EC233031F4A29783AD4BD6631E7FEE7BF34BE5DD3AF9A1762E02E2E9E3CAF489"

    while True:
        time.sleep(10)

        msg1 = fingerprint
        msg2 = fingerprint
        keysize = 2048
        (public, private) = rsa.newkeys(keysize)
        encrypted = b64encode(rsa.encrypt(msg1, public))
        decrypted = rsa.decrypt(b64decode(encrypted), private)
        signature = b64encode(rsa.sign(msg1, private, "SHA-512"))
        verify = rsa.verify(msg1, b64decode(signature), public)

        print(private.exportKey('PEM'))
        print(public.exportKey('PEM'))
        print("Encrypted: " + encrypted)
        print("Decrypted: '%s'" % decrypted)
        print("Signature: " + signature)
        print("Verify: %s" % verify)
        rsa.verify(msg2, b64decode(signature), public)