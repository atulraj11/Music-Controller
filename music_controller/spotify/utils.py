from datetime import timedelta
from urllib import response
from django.utils import timezone
from requests import get, post,put
from .models import SpotifyToken
from .settings import *
import requests
import json

BASE_URL = 'https://api.spotify.com/v1'

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    return None


def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token',
                                   'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token,
                              refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()



def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expires=tokens.expires_in
        if expires<=timezone.now():
            refresh_token(session_id)
        
        return True
    return False

def refresh_token(session_id):

    refresh_token = get_user_tokens(session_id).refresh_token
    
    response = post('https://accounts.spotify.com/api/token',data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id' : CLIENT_ID,
        'client_secret' : CLIENT_SECRET
    }).json()
    
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    
    
    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)    
    
def execute_spotify_api_request(session_id,endpoint,params=None,body=None,post_=False,put_=False):
    tokens = get_user_tokens(session_id)
    headers = {'Content-type': 'application/json', 'Authorization': 'Bearer ' + tokens.access_token}
    url = f"{BASE_URL}{endpoint}"
    if params:
        url += f"/{params['id']}"
        params=None
    
    body= json.dumps(body) if body else None
    
    if post_:
        post(BASE_URL+endpoint,headers)
    
    if put_:
        put(BASE_URL+endpoint,headers)
    
    # print(BASE_URL+endpoint)
    response = get(url,data=body,headers=headers)
    
    try:
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
        return response.json()
    except requests.HTTPError as e:
        print(f"HTTPError in API request: {e}")
        return {'Error': 'HTTPError in request', 'status_code': e.response.status_code}
    except json.JSONDecodeError:
        print(f"Error decoding JSON: {response.text}")
        return {'Error': 'Invalid JSON in response'}
    except Exception as e:
        print(f"Error in API request: {e}")
        return {'Error': 'Issue with request'}

def pause_song(session_id):
    response = execute_spotify_api_request(session_id,'/me/player/pause',put_=True)
    return response

def play_song(session_id):
    response= execute_spotify_api_request(session_id,'/me/player/play',put_=True)
    return response

def skip_song(session_id):
    response= execute_spotify_api_request(session_id,'/me/player/next',post_=True)
    return response

def get_artist(session_id,artist_id):
    params= {
        "id" : artist_id
    }
    response= execute_spotify_api_request(session_id,'/artists',params)
    return response