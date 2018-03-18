import docproc
import sys

db = "cfg/dummy.json"


def authorizer():
    (ret, in_trx) = docproc.verify_trx("cfg/input.json", 0)
    if ret is True:
        digest = docproc.md5("cfg/sample.pdf")
        ret = docproc.verify_digest(digest, db)
        if ret is True:
            block = docproc.create_block(1, 1)
            idx = docproc.get_index(digest, db)

            (public, private) = docproc.generate_key()
            trx = docproc.create_trx(digest, idx, "Notaris A", "Freddy Wijaya",
                                     public.exportKey())
            trx = docproc.sign_trx(trx, private)
            trx = docproc.hash_trx(trx)

            block["input"] = dict()
            block["input"][0] = in_trx

            block["output"] = dict()
            block["output"][0] = trx

            docproc.save_block(block, 'cfg/output.json')
            print "\n\n---BLOCK OUT---"
            print block
            print "---BLOCK OUT---\n\n"

    # docs = docproc.get_digest(db)
    # ret = docs.has_key(digest)
    # print ret

    # idx = docproc.get_index(digest, db)


def client():
    digest = docproc.md5("cfg/request.pdf")

    ret = docproc.verify_digest(digest, db)
    if ret is True:
        block = docproc.create_block(0, 1)
        idx = docproc.get_index(digest, db)
        (public, private) = docproc.generate_key()

        strpub = public.publickey().exportKey('PEM')
        trx = docproc.create_trx(digest, idx, "Notaris A", "Freddy Wijaya",
                                 strpub)
        trx = docproc.sign_trx(trx, private)
        trx = docproc.hash_trx(trx)

        block["output"] = dict()
        block["output"][0] = trx

        docproc.save_block(block, 'cfg/input.json')

        print "\n\n---BLOCK IN---"
        print block
        print "---BLOCK IN---\n\n"


if __name__ == "__main__":
    role = sys.argv[1]
    # if role == "client":
    client()
    authorizer()
    # elif role == "authorizer":
