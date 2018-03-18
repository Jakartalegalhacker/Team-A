from face_verification_utils import *
import tornado.ioloop
import tornado.web
from tornado import gen,locks
from tornado.queues import Queue as trQueue
from Crypto.PublicKey import RSA
from Crypto import Random
import psycopg2
import json
import pandas as pd
import os

def extract_face_embedding(img_path):
	input_image=cv2.imread(os.path.join('/home/nodeflux/Documents/side-project/legal_hackathon/photocollection',img_path))

	result,scores,frame_out=face_detector.detect_face(frame=input_image,min_size=60)

	selected_face=get_largest_face_bbox(result)

	landmark_points=face_landmark_extractor.extract_facial_landmark(input_image,selected_face)

	aligned_faces=face_alignment.extract_aligned_faces(input_image,landmark_points)

	facial_embeddings=face_embedding_extractor.extract_facial_embedding(aligned_faces)

	return facial_embeddings[0]

class EnrollmentAdditionRequestHandler(tornado.web.RequestHandler):
	def set_default_headers(self):
		self.set_header("Access-Control-Allow-Origin", "*")
		self.set_header("Access-Control-Allow-Headers", "x-requested-with,Content-Type, Access-Control-Allow-Headers")
		self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')

	@gen.coroutine
	def post(self):
		data_dict=json.loads(self.request.body)
		data_dict['action']='add'
		self.write('OK, Enrollment addition request received')
		yield q.put(data_dict)

	def options(self):
		self.write('biji lo koh')

@gen.coroutine
def enrollment_request_executor():
	while True:
		with (yield lock.acquire()):
			item=yield q.get()
			if item['action']=='add':
				## Information
				## item['email']
				## item['name']
				## item['face_photo_path']
				## item['ktp_photo_path']
				add_new_user(item)
			yield gen.sleep(0.01)



def add_new_user(json_data):
	face_embedding=extract_face_embedding(json_data['face_photo_path'])
	userStrPrivKey,userStrPubKey=generate_key_pairs()
	with open("key_collections/%s_private.pem"%json_data['name'], "w") as prv_file:
		prv_file.write(userStrPrivKey)

	with open("key_collections/%s_public.pem"%json_data['name'], "w") as pub_file:
		pub_file.write(userStrPubKey)
	conn = psycopg2.connect("dbname='legalhackathon' user='postgres' host='localhost' password='root'")
	cur = conn.cursor()

	query="INSERT INTO user_table (name,face_embedding,public_key_list,ktp_photo_path,face_photo_path,email) VALUES (%s,%s,%s,%s,%s,%s)"

	cur.execute(query,(json_data['name'],
		json.dumps(face_embedding.tolist()),userStrPubKey,json_data['ktp_photo_path'],json_data['face_photo_path'],json_data['email']))
	conn.commit()
	conn.close()

def generate_key_pairs():
	random_generator = Random.new().read
	user_key = RSA.generate(1024, random_generator)

	userStrPrivKey = user_key.exportKey('PEM')
	userStrPubKey =  user_key.publickey().exportKey('PEM')

	keys=userStrPrivKey,userStrPubKey
	return keys

class UserVerificationRequestHandler(tornado.web.RequestHandler):
	def set_default_headers(self):
		self.set_header("Access-Control-Allow-Origin", "*")
		self.set_header("Access-Control-Allow-Headers", "x-requested-with,Content-Type, Access-Control-Allow-Headers")
		self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
		
	def post(self):
		## Information
		## item['name']
		## item['face_photo_path']
		data_dict=json.loads(self.request.body)
		result=verify_user(data_dict)
		self.write(json.dumps(result))


	def options(self):
		self.write('biji lo koh')

def verify_user(json_data):
	username=json_data['name']
	target_photo=json_data['face_photo_path']

	try:
		conn = psycopg2.connect("dbname='legalhackathon' user='postgres' host='localhost' password='root'")

		query="SELECT face_embedding from user_table WHERE name='%s'"%(username)

		result_df = pd.read_sql(query, con=conn)
		anchor_embedding= np.array(result_df['face_embedding'][0])
		target_embedding=extract_face_embedding(json_data['face_photo_path'])

		dist = np.sum(np.square(target_embedding-anchor_embedding))
		if dist<=1:
			status='verified'
		else:
			status='not_verified'
	except:
		status='not_verified'
	return status	

def make_app():
	return tornado.web.Application([
		(r"/add_user", EnrollmentAdditionRequestHandler),
		(r"/verify_user", UserVerificationRequestHandler)
	])	

if __name__ == "__main__":
	global q
	q=trQueue()

	global lock
	lock = locks.Lock()

	## Initialize

	face_detector=FaceDetector(
		upsample=0,
		min_threshold=-0.1,)

	face_landmark_extractor=FaceLandmarkExtractor()

	face_alignment=FaceAlignment(aligned_face_size=112,padding=0.2)

	face_embedding_extractor=FaceFeatureExtractor(gpu_id=0)

	app = make_app()
	port = 5555
	app.listen(port)
	tornado.ioloop.IOLoop.current().spawn_callback(enrollment_request_executor)
	print 'Enrollment server started, Running on port %s'%(port)
	tornado.ioloop.IOLoop.current().start()