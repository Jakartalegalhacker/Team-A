# from Crypto.PublicKey import RSA
# from Crypto import Random
# import binascii
# random_generator = Random.new().read
# user_key = RSA.generate(1024, random_generator)

# msg='attack on titan'

# userStrPrivKey = user_key.exportKey('PEM')
# userStrPubKey =  user_key.publickey().exportKey('PEM')

# with open("private.pem", "w") as prv_file:
# 	prv_file.write(userStrPrivKey)

# with open("public.pem", "w") as pub_file:
# 	pub_file.write(userStrPubKey)

# emsg = user_key.publickey().encrypt(msg, 'x')


# with open("private.pem", "r") as prv_file:
# 	lines=prv_file.read()



# # print encUserStrPrivKey

# # wrapperStrPrivKey = user_key.exportKey('PEM')

# userPrivKeyObj = RSA.importKey(lines)
# # pubKeyObj =  RSA.importKey(binPubKey)




# dmsg = userPrivKeyObj.decrypt(emsg)
# print dmsg

# # def bin2hex(binStr):
# # 	return binascii.hexlify(binStr)

# # strPrivKey=bin2hex(binPrivKey)

# # def hex2bin(hexStr):
# #     return binascii.unhexlify(hexStr)


# # print emsg
# # print dmsg

import requests
import json

data=dict()
data['name']='alvin'
data['email']='freddy_wijaya@gmail.com'
data['ktp_photo_path']=None
data['face_photo_path']='/home/nodeflux/Documents/side-project/legal_hackathon/photocollection/alvin_1.jpg'

r = requests.post("http://localhost:5555/add_user", data=json.dumps(data))

# data=dict()
# data['name']='freddy'
# # data['email']='alphinside@gmail.com'
# # data['ktp_photo_path']=None
# data['face_photo_path']='/home/nodeflux/Documents/side-project/legal_hackathon/photocollection/anharry_1.jpeg'

# r = requests.post("http://localhost:5555/verify_user", data=json.dumps(data))
# print r.text