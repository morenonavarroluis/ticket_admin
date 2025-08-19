from django.urls import path
from .views import *
urlpatterns = [
    path('', inicio , name='inicio'),
    path('index', index , name='index'),
    path('usu', usu , name='usu'),
    path('registro' , registro , name='registro' ),
    path('user_registro', user_registro , name='user_registro'),
    path('menu', menu , name='menu'),
    path('logout_view' , logout_view , name='logout_view' )
]