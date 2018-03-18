from mtcnn.mtcnn_face_align import *
from mtcnn.mtcnn_face_detect import *
import numpy as np
from PIL import Image

class FaceDetector():

	def __init__(self,
		upsample=0,
		min_threshold=0,
		use_dlib_formatting_output=False
		):

		import dlib
		self.dlib=dlib

		self.use_dlib_formatting_output=use_dlib_formatting_output
		self.face_detector = self.dlib.get_frontal_face_detector()
		self.upsample=upsample
		self.min_threshold=min_threshold

	def detect_face(self,
		frame,
		min_size=25
		):

		dets,old_scores,idx = self.face_detector.run(frame, self.upsample,self.min_threshold)
		
		if self.use_dlib_formatting_output:
			result=self.dlib.rectangles()
		else:
			result=[]
		scores=[]

		for i, d in enumerate(dets):
			x1=int(d.left())
			y1=int(d.top())
			x2=int(d.right())
			y2=int(d.bottom())
			score=float(old_scores[i])

			new_coords,transform_flag=transform_to_rect((x1,y1,x2,y2),frame)

			if transform_flag:
				x1,y1,x2,y2=new_coords

				w=x2-x1
				h=y2-y1

				if w>=min_size and h>=min_size:

					if self.use_dlib_formatting_output:
						dlib_rect=self.dlib.rectangle(left=x1, top=y1, right=x2, bottom=y2)
						result.append(dlib_rect)
					else:
						result.append([x1,y1,x2,y2])
					scores.append(score)

		if not self.use_dlib_formatting_output:
			result=np.array(result)
		
		final_result=result,np.array(scores),frame

		return final_result

class FaceLandmarkExtractor():

	def __init__(self,
		base_model_dir='models'
		):

		import tensorflow as tf
		self.tf=tf

		with self.tf.Graph().as_default():
			config = self.tf.ConfigProto()
			config.gpu_options.allow_growth = True
			sess = self.tf.Session(config=config)
			with sess.as_default():
				self.pnet, self.rnet, self.onet = create_mtcnn(sess, model_path=os.path.join(base_model_dir,'face_landmark'))

	def extract_facial_landmark(self,
		img,
		face_boxes
		):

		if len(face_boxes)>0:
			face_boxes=face_boxes[:,0:4]
			result=[]

			face_count=0
			for i in face_boxes:
				face_count+=1

			if face_count!=0:
				new_face_boxes,points = detect_facial_landmark(img,self.onet,face_boxes)
				for i,box in enumerate(face_boxes):
					left_eye=(int(points[0][i]),int(points[5][i]))
					right_eye=(int(points[1][i]),int(points[6][i]))
					nose=(int(points[2][i]),int(points[7][i]))
					left_mouth=(int(points[3][i]),int(points[8][i]))
					right_mouth=(int(points[4][i]),int(points[9][i]))
					result.append([left_eye,right_eye,nose,left_mouth,right_mouth])
		else:
			result=[]
		return np.array(result)

class FaceAlignment():

	def __init__(self,
		aligned_face_size=96,
		padding=0,
		method='mtcnn'
		):

		self.aligned_face_size=aligned_face_size
		self.padding=padding
		self.method=method
		BASE_TEMPLATE_68 = np.float32([
				(0.0792396913815, 0.339223741112), (0.0829219487236, 0.456955367943),
				(0.0967927109165, 0.575648016728), (0.122141515615, 0.691921601066),
				(0.168687863544, 0.800341263616), (0.239789390707, 0.895732504778),
				(0.325662452515, 0.977068762493), (0.422318282013, 1.04329000149),
				(0.531777802068, 1.06080371126), (0.641296298053, 1.03981924107),
				(0.738105872266, 0.972268833998), (0.824444363295, 0.889624082279),
				(0.894792677532, 0.792494155836), (0.939395486253, 0.681546643421),
				(0.96111933829, 0.562238253072), (0.970579841181, 0.441758925744),
				(0.971193274221, 0.322118743967), (0.163846223133, 0.249151738053),
				(0.21780354657, 0.204255863861), (0.291299351124, 0.192367318323),
				(0.367460241458, 0.203582210627), (0.4392945113, 0.233135599851),
				(0.586445962425, 0.228141644834), (0.660152671635, 0.195923841854),
				(0.737466449096, 0.182360984545), (0.813236546239, 0.192828009114),
				(0.8707571886, 0.235293377042), (0.51534533827, 0.31863546193),
				(0.516221448289, 0.396200446263), (0.517118861835, 0.473797687758),
				(0.51816430343, 0.553157797772), (0.433701156035, 0.604054457668),
				(0.475501237769, 0.62076344024), (0.520712933176, 0.634268222208),
				(0.565874114041, 0.618796581487), (0.607054002672, 0.60157671656),
				(0.252418718401, 0.331052263829), (0.298663015648, 0.302646354002),
				(0.355749724218, 0.303020650651), (0.403718978315, 0.33867711083),
				(0.352507175597, 0.349987615384), (0.296791759886, 0.350478978225),
				(0.631326076346, 0.334136672344), (0.679073381078, 0.29645404267),
				(0.73597236153, 0.294721285802), (0.782865376271, 0.321305281656),
				(0.740312274764, 0.341849376713), (0.68499850091, 0.343734332172),
				(0.353167761422, 0.746189164237), (0.414587777921, 0.719053835073),
				(0.477677654595, 0.706835892494), (0.522732900812, 0.717092275768),
				(0.569832064287, 0.705414478982), (0.635195811927, 0.71565572516),
				(0.69951672331, 0.739419187253), (0.639447159575, 0.805236879972),
				(0.576410514055, 0.835436670169), (0.525398405766, 0.841706377792),
				(0.47641545769, 0.837505914975), (0.41379548902, 0.810045601727),
				(0.380084785646, 0.749979603086), (0.477955996282, 0.74513234612),
				(0.523389793327, 0.748924302636), (0.571057789237, 0.74332894691),
				(0.672409137852, 0.744177032192), (0.572539621444, 0.776609286626),
				(0.5240106503, 0.783370783245), (0.477561227414, 0.778476346951)])

		TPL_MIN, TPL_MAX = np.min(BASE_TEMPLATE_68, axis=0), np.max(BASE_TEMPLATE_68, axis=0)
		self.MINMAX_TEMPLATE = (BASE_TEMPLATE_68 - TPL_MIN) / (TPL_MAX - TPL_MIN)

		self.filter_keypoints_index=np.array([36,	#left eye outer
											  39,	#left eye inner
											  42,	#right eye inner
											  45,	#right eye outer
											  33,	#nose
											  48,	#left mouth
											  54	#right mouth
											  ])
	

	def extract_aligned_faces(self,
		img,
		face_points
		):

		if self.method=='mtcnn':
			new_face_points_format=[]
			for i,face in enumerate(face_points):
				if len(face)==68:
					filtered_points=face[self.filter_keypoints_index]

					face = np.float32(np.zeros(shape=(5,2)))
					face[0]=(filtered_points[0]+filtered_points[1])/2
					face[1]=(filtered_points[2]+filtered_points[3])/2
					face[2]=filtered_points[4]
					face[3]=filtered_points[5]
					face[4]=filtered_points[6]


				points_template=np.array([0,0,0,0,0,0,0,0,0,0])

				for i,point in enumerate(face):
					points_template[i]=point[0]
					points_template[i+5]=point[1]
				
				if len(new_face_points_format)==0:
					new_face_points_format=np.array([points_template])
				else:
					new_face_points_format=np.append(new_face_points_format,np.array([points_template]),axis=0)
			
			aligned_faces = extract_image_chips(img, new_face_points_format, desired_size=self.aligned_face_size, padding=self.padding)

			return np.array(aligned_faces)

class FaceFeatureExtractor():

	def __init__(self,
		base_model_dir='models',
		gpu_id=0):

		import mxnet as mx
		from sklearn.preprocessing import normalize

		self.mx=mx
		self.normalize=normalize

		model_dir='face_recog'

		self.ctx=self.mx.gpu(gpu_id)
		epoch=0
		sym, arg_params, aux_params = self.mx.model.load_checkpoint(os.path.join(base_model_dir,model_dir,'model'), epoch)
		all_layers = sym.get_internals()
		sym = all_layers['fc1_output']
		model = self.mx.mod.Module(symbol=sym, context=self.ctx, label_names = None)
		model.bind(data_shapes=[('data', (1, 3, 112, 112))])
		model.set_params(arg_params, aux_params)
		self.model=model

	def extract_facial_embedding(self,
		aligned_faces
		):
		resized_aligned_faces=[resize_by_custom(face,112,112) for face in aligned_faces]

		preprocessed_faces=self._preprocess_face_images(resized_aligned_faces)

		data = self.mx.nd.array(preprocessed_faces)
		db = self.mx.io.DataBatch(data=(data,))
		self.model.forward(db, is_train=False)
		_embedding = self.model.get_outputs()[0].asnumpy()

		embedding = self.normalize(_embedding)

		return embedding

	def _preprocess_face_images(self,
		aligned_faces):
		## swap channel from BGR to RGB
		channel_swapped_aligned_faces=np.array([ face[:,:,::-1] for face in aligned_faces])
		
		## swap image format from (h,w,c) to (c,h,w)
		format_swapped_aligned_faces = np.array([ np.transpose(face, (2,0,1)) for face in channel_swapped_aligned_faces])

		return format_swapped_aligned_faces


def transform_to_rect(coords,frame):
	x1,y1,x2,y2=coords

	w=x2-x1
	h=y2-y1

	diff=w-h
	diff=int(diff/2)

	new_w=w-diff
	new_h=new_w

	if diff<=0:
		new_x1=x1+int(diff/2)
		new_y1=y1-int(diff/2)
	else:
		new_x1=x1-int(diff/2)
		new_y1=y1+int(diff/2)

	new_x2=new_x1+int(new_w)
	new_y2=new_y1+int(new_h)

	if new_x1>=0 and new_x2<=frame.shape[1] and new_y1>=0 and new_y2<=frame.shape[0]:
		new_coords=new_x1,new_y1,new_x2,new_y2
		transform_flag=True
	else:
		new_coords=x1,y1,x2,y2
		transform_flag=False
	return new_coords,transform_flag

def get_largest_face_bbox(face_boxes):

	biggest_size=0

	selected_face=[]
	for face in face_boxes:
		w=face[2]-face[0]
		h=face[3]-face[1]

		temp_size=w*h
		
		if temp_size>biggest_size:
			biggest_size=temp_size
			selected_face=[face]
	selected_face=np.array(selected_face)
	
	
	return selected_face

def resize_by_custom(image, w, h):
	image = Image.fromarray(image)
	image = image.resize((w, h), resample=Image.BILINEAR)
	image = np.array(image)
	return image



if __name__ == '__main__':
	import cv2

	## Initialize

	face_detector=FaceDetector(
		upsample=0,
		min_threshold=-0.1,)

	face_landmark_extractor=FaceLandmarkExtractor()

	face_alignment=FaceAlignment(aligned_face_size=112,padding=0.2)

	face_embedding_extractor=FaceFeatureExtractor(gpu_id=0)

	

	## Process

	test_image=cv2.imread('/home/nodeflux/Downloads/IMG_20180317_103010.jpg')

	result,scores,frame_out=face_detector.detect_face(frame=test_image,min_size=60)

	selected_face=get_largest_face_bbox(result)

	landmark_points=face_landmark_extractor.extract_facial_landmark(test_image,selected_face)

	aligned_faces=face_alignment.extract_aligned_faces(test_image,landmark_points)

	facial_embeddings=face_embedding_extractor.extract_facial_embedding(aligned_faces)

	print facial_embeddings.shape

