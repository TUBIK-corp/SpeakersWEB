# This is a sample Python script.

import cv2
import dlib
import numpy as np
import os
from recognize import predict


def process_boxes(box):
    xmin = box.left()
    ymin = box.top()
    xmax = box.right()
    ymax = box.bottom()
    return [int(xmin), int(ymin), int(xmax), int(ymax)]


def crop_image(box_face, img1):
    [xmin, ymin, xmax, ymax] = box_face
    cropped_face = img1[ymin:ymax, xmin:xmax]
    return cropped_face


def recognize(img_path):
    return predict(img_path, model_path='Models/Model.clf')


face_recognized_dictionary = [{
    'name': '',
    'encodings': []
}]
face_recognized_dictionary.clear()
capture = cv2.VideoCapture(0)
detector = dlib.get_frontal_face_detector()


def process(img, directory):

    predictor = dlib.shape_predictor(f'{directory}/shape_predictor_68_face_landmarks.dat')
    face_recognizer = dlib.face_recognition_model_v1(f'{directory}/dlib_face_recognition_resnet_model_v1.dat')
    gray_frame = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    recognized = None
    detected_boxes = detector(gray_frame)
    for box in detected_boxes:

        res_box = process_boxes(box)
        cv2.rectangle(img, (res_box[0], res_box[1]),
                      (res_box[2], res_box[3]), (0, 0, 255),
                      2)
        cropped_image = crop_image(res_box, img)
        landmarks = predictor(img, box)
        rgb_small_frame = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        face_encoding = face_recognizer.compute_face_descriptor(rgb_small_frame, landmarks)

        if len(face_recognized_dictionary) == 0:
            face_recognized_dictionary.append({'name': 'unknown', 'encodings': face_encoding})
            path = "Frames/" + str(len(face_recognized_dictionary)) + ".jpeg"
            cv2.imwrite(path, cropped_image)
            recog = recognize(path)
            if (len(recog) > 0):
                face_recognized_dictionary[0]['name'] = recog[0][0]
                print(recog)
                recognized = recog[0][0]
                cv2.putText(img, recog[0][0], (res_box[0], res_box[1] - 10), cv2.FONT_HERSHEY_DUPLEX, 0.8, (0, 0, 255),
                            1)
        elif not any(np.linalg.norm(np.array(encoding['encodings']) - np.array(face_encoding)) < 0.6
                     for encoding in face_recognized_dictionary):
            face_recognized_dictionary.append({'name': 'unknown', 'encodings': face_encoding})

            path = "Frames/" + str(len(face_recognized_dictionary)) + ".jpeg"
            cv2.imwrite(path, cropped_image)

            recog = recognize(path)

            if (len(recog) > 0):
                face_recognized_dictionary[-1]['name'] = recog[0][0]
                cv2.putText(img, recog[0][0], (res_box[0], res_box[1] - 10), cv2.FONT_HERSHEY_DUPLEX, 0.8, (0, 0, 255),
                            1)
                recognized = recog[0][0]
                print(recog)
        else:
            element = None
            for encoding in face_recognized_dictionary:
                if np.linalg.norm(np.array(encoding['encodings']) - np.array(face_encoding)) < 0.6:
                    element = encoding
                    break
            if element is not None:

                recognized = element
                cv2.putText(img, element['name'], (res_box[0], res_box[1] - 10), cv2.FONT_HERSHEY_DUPLEX, 0.8,
                            (0, 0, 255), 1)

    return recognized, img
