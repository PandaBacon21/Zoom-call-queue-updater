from flask import Blueprint, request, current_app

from zoom_utilities.zoom_functions import list_users, list_zp_cc_members, update_zp_cc_members, remove_zp_cc_members


TARGET_CALL_QUEUE = current_app.config['TARGET_CALL_QUEUE']

main_bp = Blueprint('main', __name__,)

@main_bp.route('/', methods=['GET'])
def home(): 
    return {'Test': 'API'}

@main_bp.route('/list-zoom-users', methods=['GET'])
def list_zoom_users():
    user_list = list_users()
    return {
        'Users': user_list
    }

@main_bp.route('/list-cc-members', methods=['GET'])
def list_cc_members():
    current_zp_cc_members = list_zp_cc_members(TARGET_CALL_QUEUE)

    return {
        'current_cc_members': current_zp_cc_members
    }

@main_bp.route('/update-cc-members', methods=['POST'])
def update_cc_members():
    email = request.json.get('email', None)
    id = request.json.get('user_id', None)
    user = {
        'email': email,
        'user_id': id
    }
    return update_zp_cc_members(TARGET_CALL_QUEUE, user)

@main_bp.route('/remove-cc-members', methods=['POST'])
def remove_cc_members():
    user_list =request.json.get('Users', None)
    return remove_zp_cc_members(TARGET_CALL_QUEUE, user_list)