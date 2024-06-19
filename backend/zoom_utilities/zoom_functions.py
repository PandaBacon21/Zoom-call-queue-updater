import base64
import requests
import json 
from datetime import datetime, timedelta, timezone

from flask import current_app
from .get_token import token


ZOOM_API_URL = current_app.config['ZOOM_API_URL']

# Checks access token or gets new one and returns the headers for Zoom API calls
def create_headers(): 
    access_token = token()

    return {
        'content-type': 'application/json',
        'authorization': f'Bearer {access_token}'
    }


# Lists all Zoom users on the account
def list_users():
    endpoint = '/users'
    full_url = ZOOM_API_URL+endpoint

    response = requests.get(url=full_url, headers=create_headers())
    
    print(f'endpoint: {endpoint}, status code: {response.status_code}')
    
    r_content = json.loads(response.content)
    
    user_list = []
    for user in r_content['users']: 
        print('Users on Account: ')
        print({'id': user['id'], 'email': user['email']})
        user_list.append({"user_id": user['id'], 
                          "user_name": user['display_name'], 
                          "email" : user['email']})
    return user_list


# Lists all memebers in the target queue
def list_zp_cc_members(call_queue_id):
    endpoint = f'/phone/call_queues/{call_queue_id}/members'
    full_url = ZOOM_API_URL+endpoint

    response = requests.get(url=full_url, headers=create_headers())
    
    print(f'endpoint: {endpoint}, status code: {response.status_code}')
    
    r_content = json.loads(response.content)

    user_list = []
    print('Current Call Queue Members:')
    for index, user in enumerate(r_content['call_queue_members']):
        print(f"User ID: {user['id']}, Name: {user['name']}, Receive Calls: {user['receive_call']}")
        user_list.append({"id": index+1 , "user_id" : user['id'], "name" : user['name'], 'receive_call': f"{'On' if user['receive_call'] else 'Off'}"})
    return user_list


# Updates the Zoom Phone Call Queue Members 
def update_zp_cc_members(call_queue_id, user):
    endpoint = f'/phone/call_queues/{call_queue_id}/members'
    full_url = ZOOM_API_URL+endpoint

    payload = {
        'members': {
            'users': [
                {
                    'email': user['email'],
                    'id': user['user_id']
                }
            ]
        }
    }
    try:
        response = requests.post(url=full_url, headers=create_headers(), json=payload)
        response.raise_for_status()
        print(f'endpoint: {endpoint}, status code: {response.status_code}')
        updated_cc_members = list_zp_cc_members(call_queue_id)
        for new_u in updated_cc_members: 
            if new_u['user_id'] == user['user_id']: 
                print('Updated Call Queue Member:')
                print(f"User ID: {new_u['user_id']}, Name: {new_u['name']} added to queue")
        return {
            'Update Successful': 'User Added to Call Queue',
            'Users': updated_cc_members,
        }
    except requests.exceptions.HTTPError as err: 
        print(f'endpoint: {endpoint}, status code: {response.status_code}')
        res = json.loads(response.content.decode('utf-8'))
        print(res)
        if res['message'] == 'Call queue extension already exits.':
            return {f"Error {res['code']}" : "User already in call queue"}    
        else: 
            return {f"Error {res['code']}": res['message']}


# Removes a specific member of the Zoom Phone call queue 
def remove_zp_cc_members(call_queue_id, user_list):
    for user_id in user_list:
        try:
            endpoint = f'/phone/call_queues/{call_queue_id}/members/{user_id}'
            full_url = ZOOM_API_URL+endpoint
            response = requests.delete(url=full_url, headers=create_headers())
            print(f'endpoint: {endpoint}, status code: {response.status_code}')
            print('Removed Call Queue Member:')
            print(f'User: {user_id} removed from queue')
        except requests.exceptions.HTTPError as err: 
            print(f'endpoint: {endpoint}, status code: {response.status_code}')
            res = json.loads(response.content.decode('utf-8'))
            print(res)
            return {'Error': res}
    updated_cc_members = list_zp_cc_members(call_queue_id)  
    return {'Users Removed': user_list,
            'Users': updated_cc_members}