from django.urls import path
from .views import *
urlpatterns = [
    path('', inicio , name='inicio'),
    path('index', index , name='index'),
    path('usu', usu , name='usu'),
    path('registro' , registro , name='registro' ),
    path('user_registro', user_registro , name='user_registro'),
    path('eliminar_user/<int:id>', eliminar_user , name='eliminar_user'),    
    path('menu', menu , name='menu'),
    path('seleccion', seleccion , name='seleccion'),
    path('resumen', resumen, name='resumen'),
    path('ticket', ticket , name='ticket'),
    path('empleados' , empleados , name= 'empleados'),
    path('logout_view' , logout_view , name='logout_view' )
]