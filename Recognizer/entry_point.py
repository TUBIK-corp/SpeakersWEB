import socket
import json
import numpy as np
import cv2
from photo_processing import process
import base64
import sys

if len(sys.argv)<2:
    print("No args")


directory = sys.argv[1]


server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

tcp_address = "127.0.0.1"
tcp_port = 12345

server_socket.bind((tcp_address, tcp_port))

# Listen for incoming connections
server_socket.listen(5)

print("[entry_point.py has started]")
print("Server is hosted on " + tcp_address + ":" + str(tcp_port))
print("Server is listening for connections...")

while True:
    client_socket, client_address = server_socket.accept()
    print(f"Accepted request from {client_address}")

    image_data = base64.b64decode(client_socket.recv(999999999))

    nparray = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparray, cv2.IMREAD_COLOR)

    recognized, new_image = process(image, directory)
    print(f"Recognized: {recognized}")

    ret, image_bytes = cv2.imencode(".jpeg", new_image)
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    client_socket.send(json.dumps((recognized, image_base64)).encode())

    client_socket.close()
