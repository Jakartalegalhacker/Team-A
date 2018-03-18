import time
import rsa
from base64 import b64encode, b64decode

import ecdsa
from ecdsa import SigningKey, VerifyingKey, SECP256k1

if __name__ == '__main__':
    fingerprint = "75737EADFAB64CD34C5BAA18A33CC8B14DD7485A3659C9FB8EA936AE1E36424CBD9E6BAD270629111C41EB3B597D170E9C35A8767C945E020C0E5FEEF87A824E"

    while True:
        sk = SigningKey.generate(curve=SECP256k1)
        vk = sk.get_verifying_key()
        sig = sk.sign(b"message")
        vk.verify(sig, b"message")  # True

        message = b"message"
        public_key = '98cedbb266d9fc38e41a169362708e0509e06b3040a5dfff6e08196f8d9e49cebfb4f4cb12aa7ac34b19f3b29a17f4e5464873f151fd699c2524e0b7843eb383'
        sig = '740894121e1c7f33b174153a7349f6899d0a1d2730e9cc59f674921d8aef73532f63edb9c5dba4877074a937448a37c5c485e0d53419297967e95e9b1bef630d'

        f = open("test.key", "rb")
        print f.read()
        vk = VerifyingKey.from_string(f.read(), curve=SECP256k1)
        vk.verify(bytearray.fromhex(sig), message)  # True

        print "success"
        time.sleep(10)

# msg1 = fingerprint
# msg2 = fingerprint
# keysize = 2048
# (public, private) = rsa.newkeys(keysize)
# encrypted = b64encode(rsa.encrypt(msg1, public))
# decrypted = rsa.decrypt(b64decode(encrypted), private)
# signature = b64encode(rsa.sign(msg1, private, "SHA-512"))
# verify = rsa.verify(msg1, b64decode(signature), public)

# print(private.exportKey('PEM'))
# print(public.exportKey('PEM'))
# print("Encrypted: " + encrypted)
# print("Decrypted: '%s'" % decrypted)
# print("Signature: " + signature)
# print("Verify: %s" % verify)
# rsa.verify(msg2, b64decode(signature), public)
