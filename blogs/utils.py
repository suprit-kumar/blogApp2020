import os
import random
import string
import datetime
import calendar
import _thread

from Crypto.Cipher import AES
from django.core.mail import send_mail
from base64 import b64encode
from Crypto.Util.Padding import pad
from base64 import b64decode
from Crypto.Util.Padding import unpad
import urllib.request
import urllib.parse

key = "!%F=-?sssfsc!%F=".encode('utf-8')
iv = "4tyhuhOXyU&**Q7w".encode('utf-8')


def encrypt_password(raw_pwd):
    cipher = AES.new(key, AES.MODE_CBC, iv)
    ct_bytes = cipher.encrypt(pad(raw_pwd.encode('utf-8'), AES.block_size))
    ct = b64encode(ct_bytes).decode('utf-8')
    return ct


# print(encrypt_password('rcpumper@oilfield'))


def decrypt_password(ency_pwd):
    res = ''
    try:
        ct = b64decode(ency_pwd)
        cipher = AES.new(key, AES.MODE_CBC, iv)
        pt = unpad(cipher.decrypt(ct), AES.block_size)
        res = pt.decode('ASCII')
    except:
        # logger.error("Incorrect decryption or some error happened. - > ")
        print("Incorrect decryption")

    return res


# print(decrypt_password())


def timestampToDate(timestamp):
    date = datetime.datetime.fromtimestamp(timestamp)
    return date


def dateToTimestamp():
    dt_obj = datetime.datetime.strptime('20-12-2016 09:38:42,76', '%d-%m-%Y %H:%M:%S,%f')
    millisec = dt_obj.timestamp() * 1000
    return millisec


def getUniqueUserCode():
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(16))


def random_pwd_generate():
    temp_pwd = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(10))
    return temp_pwd



