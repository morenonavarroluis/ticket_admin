from django.urls import path
from .views import *
urlpatterns = [
    path('', inicio , name='inicio'),
    path('index', index , name='index'),
    path('logout_view' , logout_view , name='logout_view' )
]