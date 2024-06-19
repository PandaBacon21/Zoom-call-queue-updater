from os import environ, path
from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, '.env'))

class Config():
    SECRET_KEY = environ.get('SECRET_KEY')

    # Database Config
    SQLALCHEMY_DATABASE_URI = environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Zoom Specific Configs
    ACCOUNT_ID = environ.get('ACCOUNT_ID')
    CLIENT_ID = environ.get('CLIENT_ID')
    CLIENT_SECRET = environ.get('CLIENT_SECRET')
    TARGET_CALL_QUEUE = environ.get('TARGET_CALL_QUEUE')

    AUTH_URL = environ.get('AUTH_URL')
    ACCESS_TOKEN_URL = environ.get('ACCESS_TOKEN_URL')
    ZOOM_API_URL = environ.get('ZOOM_API_URL')