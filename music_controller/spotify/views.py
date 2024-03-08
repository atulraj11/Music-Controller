from urllib import response
from django.shortcuts import render,redirect
from fastapi.exceptions import ResponseValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from requests import Request, post

from .utils import *
from .settings import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from api.models import Room
from .models import Vote
# Create your views here.

class AuthURL(APIView):
    def get(self,request,format=None):
        scopes= 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET','https://accounts.spotify.com/authorize',params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url
        
        return Response({'url':url},status=status.HTTP_200_OK)

def spotify_callback(request,format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    response = post('https://accounts.spotify.com/api/token',data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri' : REDIRECT_URI,
        'client_id' : CLIENT_ID,
        'client_secret' : CLIENT_SECRET
    }).json()
    
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')
    
    if not request.session.exists(request.session.session_key):
        request.session.create()
    # print("expires_in",expires_in)
    update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)
    
    
    return redirect('frontend:')

class isAuthenticated(APIView):
    def get(self,request,format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)

        return Response({"status":is_authenticated}, status = status.HTTP_200_OK)
            
class CurrentSong(APIView):
    def get(self,request,format=None):
        room_code= self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        # print("room_code",room_code)
        if room.exists():
            room=room[0]
        else:
            return Response({"message":"Room not found"},status=status.HTTP_404_NOT_FOUND)
        host= room.host
        endpoint = "/me/player/currently-playing"
        response= execute_spotify_api_request(host,endpoint)
        if 'error' in response or 'item' not in response:
            return Response({"Error":response.get('Error')},status=status.HTTP_204_NO_CONTENT)
        
        item= response.get('item')
        duration = item.get('duration_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id= item.get('id')
        progress = response.get('progress_ms')
        
        artist_string= ""
        
        for i,artist in enumerate(item.get('artists')):
            if i>0:
                artist_string+=", "
            
            name=artist.get('name')
            artist_string+=name
            
        artist_id = item.get('artists')[0].get('id')
        response= get_artist(host,artist_id)
        artist_image_url = response.get('images')[0].get('url')

        votes= Vote.objects.filter(room=room,song_id=room.current_song)
        votes=len(votes)
        song= {
            'title': item.get('name'),
            'artist': artist_string,
            'duration' :duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id,
            'artist_image_url': artist_image_url,
        }
        
        self.update_room_song(room,song_id)
        return Response(song,status=status.HTTP_200_OK)
    
    def update_room_song(self,room,song_id):
        current_song = room.current_song
        
        if current_song!=song_id:
            room.current_song=song_id
            room.save(update_fields=['current_song'])
            votes= Vote.objects.filter(room=room).delete()
    
class PauseSong(APIView):
    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            response = pause_song(room.host)

            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)
    
class PlaySong(APIView):
    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)


class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        # print("************************************")
        votes= Vote.objects.filter(room=room,song_id=room.current_song)
        votes_needed = room.votes_to_skip
        
        # when user votes to skip button by clicking on skip button then it will check whether no of votes required to skip songs is
        # less than no of votes given otherwise it will simply add the user details in vote model to increase the count of votes
        if self.request.session.session_key == room.host or len(votes)+1>=votes_needed:
            votes.delete()
            skip_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        else:
            vote,created=Vote.objects.update_or_create(user=self.request.session.session_key,
                      room=room,song_id=room.current_song)

        return Response({}, status=status.HTTP_403_FORBIDDEN)