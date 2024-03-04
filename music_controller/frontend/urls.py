from django.urls import path
from .views import index

app_name = 'frontend'
#it will return index when this path called out
urlpatterns = [
    path('',index,name=''),
    path('join',index),
    path('create', index),
    path('room/<str:roomCode>',index), #dynamically take parameters in path
]