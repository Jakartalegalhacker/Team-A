import hashlib
import json
import RSA as rsa

from Crypto.Random import random
from datetime import datetime
from pprint import pprint
from base64 import b64encode, b64decode


def generate_key():
    keysize = 2048
    (public, private) = rsa.newkeys(keysize)
    return (public, private)


def md5(fname):
    hash_md5 = hashlib.md5()
    with open(fname, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()


def get_index(digest, db):
    data = json.load(open(db))
    return data["documents"][digest]['index']


def verify_digest(digest, db):
    data = json.load(open(db))
    ret = data['documents'].has_key(digest)
    return ret


def get_nonce():
    return random.getrandbits(64)


def current_time():
    return str(datetime.now())


def create_block(inc, outc):
    block = dict()
    block["version"] = "0.0.1"
    block["nonce"] = str(get_nonce())
    block["count"] = dict()
    block["count"]["in"] = inc
    block["count"]["out"] = outc
    block["timestamp"] = current_time()
    return block


def create_trx(digest, idx, authorID, clientID, pub_key):
    trx = dict()
    trx["digest"] = digest
    trx["idx"] = idx
    trx["authorID"] = authorID
    trx["clientID"] = clientID
    trx["pub_key"] = pub_key
    return trx


def sign_trx(trx, priv_key):
    msg = b64encode(str(trx))

    print "\n\n---"
    print trx['pub_key']
    print "---\n\n"

    print "\n\n---"
    print msg
    print "---\n\n"

    signature = b64encode(rsa.sign(msg, priv_key, "SHA-512"))
    trx["signature"] = signature
    return trx


def hash_trx(trx):
    trx["trx_block"] = hashlib.sha256(str(trx)).hexdigest()
    return trx


def save_block(block, fname):
    with open(fname, 'w') as fp:
        json.dump(block, fp, indent=4)


def verify_trx(block_path, idx):
    data = json.load(open(block_path))
    in_trx = data['output'][str(idx)]

    trx = dict()
    trx['digest'] = str(in_trx["digest"])
    trx['idx'] = int(in_trx["idx"])
    trx["authorID"] = str(in_trx['authorID'])
    trx["clientID"] = str(in_trx['clientID'])
    trx["pub_key"] = str(in_trx['pub_key'])

    signature = in_trx['signature']

    pubkey = str(trx['pub_key'])

    public = rsa.importKey(pubkey)
    msg = b64encode(str(trx))

    print "\n\n---"
    print trx['pub_key']
    print "---\n\n"

    print "\n\n---"
    print msg
    print "---\n\n"

    verify = rsa.verify(msg, b64decode(signature), public)
    return verify, in_trx