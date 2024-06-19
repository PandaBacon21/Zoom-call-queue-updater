import base64
import requests
import json 

from datetime import datetime, timedelta, timezone

from flask import current_app
from models.models import Token 
from app import db

ACCOUNT_ID = current_app.config['ACCOUNT_ID']
CLIENT_ID = current_app.config['CLIENT_ID']
CLIENT_SECRET = current_app.config['CLIENT_SECRET']

AUTH_URL = current_app.config['AUTH_URL']
ZOOM_API_URL = current_app.config['ZOOM_API_URL']

combined_client = f'{CLIENT_ID}:{CLIENT_SECRET}'
encoded_client = base64.b64encode(combined_client.encode()).decode()

HEADERS = headers = {
        'content-type': 'application/json',
        'authorization': f'Basic {encoded_client}'
    }

def get_new_token(): 
    final_url = f'{AUTH_URL}?grant_type=account_credentials&account_id={ACCOUNT_ID}'
    response = requests.post(url=final_url, headers=headers)
    print(f'Zoom Token Endpoint - Status Code: {response.status_code}')
    r_content = json.loads(response.content)

    new_access_token = r_content['access_token']
    new_token_exp = datetime.now() + timedelta(seconds=r_content['expires_in'])

    #Check if a token already exists in db
    token = db.session.query(Token).filter_by(id=1).first()
    if token == None: 
        zoom_token = Token(access_token=new_access_token, token_expires=new_token_exp)
        db.session.add(zoom_token)
        db.session.commit()
        print('New Zoom Token Received')
    #If token already exists, override with new token
    else: 
        token.access_token = new_access_token
        token.token_expires = new_token_exp
        db.session.commit()

    return new_access_token, new_token_exp.strftime('%Y-%m-%d %H:%M:%S')

def check_token_valid(token_exp): 
    current_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    if (token_exp < current_datetime):
        print('Token Is Expired. Retrieving New Token')
        return False
    else:
        print('Token Is Valid')
        return True

def token():
    try: 
        existing_token = db.session.query(Token).filter_by(id=1).first()
        access_token = existing_token.access_token
        token_expires = existing_token.token_expires.strftime('%Y-%m-%d %H:%M:%S')
    except Exception as ex: 
        print('Token not in DB, fetching new token')
        access_token, token_expires = get_new_token()
    if check_token_valid(token_expires) == False:
        access_token,_ = get_new_token()
    return access_token
