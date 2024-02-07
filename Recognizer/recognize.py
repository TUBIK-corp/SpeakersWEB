import cv2,time
import pickle
import face_recognition
import numpy as np
from face_recognition.face_recognition_cli import image_files_in_folder
def predict(img_path, knn_clf=None, model_path=None, threshold=0.6): # 6 needs 40+ accuracy, 4 needs 60+ accuracy
    if knn_clf is None and model_path is None:
        raise Exception("Must supply knn classifier either thourgh knn_clf or model_path")

    if knn_clf is None:
        with open(model_path, 'rb') as f:
            knn_clf = pickle.load(f)

    img = cv2.imread(img_path)
    face_box = face_recognition.face_locations(np.array(img))

    if len(face_box) == 0:
        return []

    faces_encodings = face_recognition.face_encodings(img, known_face_locations=face_box)

    closest_distances = knn_clf.kneighbors(faces_encodings, n_neighbors=2)
    matches = [closest_distances[0][i][0] <= threshold for i in range(len(face_box))]

    return [(pred, loc) if rec else ("unknown", loc) for pred, loc, rec in zip(knn_clf.predict(faces_encodings),face_box,matches
    )]