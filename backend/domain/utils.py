import os
from cryptography.fernet import Fernet

def get_cipher():
    key = os.getenv("CREDENTIAL_ENCRYPT_KEY")
    if not key:
        raise ValueError("CREDENTIAL_ENCRYPT_KEY not found in environment")
    return Fernet(key.encode())

def encrypt_data(raw_string: str) -> str:
    cipher = get_cipher()
    return cipher.encrypt(raw_string.encode()).decode()

def decrypt_data(encrypted_string: str) -> str:
    cipher = get_cipher()
    return cipher.decrypt(encrypted_string.encode()).decode()
