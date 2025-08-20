from datetime import datetime
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render, redirect ,get_object_or_404
from django.contrib.auth import  logout
from django.contrib.auth.models import User,Group ,Permission
from django.contrib import messages
from django.db import transaction
import requests


def inicio(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        url_api_login = "http://comedor.mercal.gob.ve/api/p1/users/login"
        
        
        data = {
            'email': email,
            'password': password
        }

        try:
          
            response = requests.post(url_api_login, json=data, timeout=10)
            
           
            if response.status_code == 200:
                json_data = response.json()
                
                
                token = json_data.get('token')
                print (token)
                if token:
                    
                    request.session['api_token'] = token
                    
                    messages.success(request, '¡Inicio de sesión exitoso!')
                    
                    return redirect('index')
                else:
                    messages.error(request, 'Token no encontrado en la respuesta de la API.')
            else:
                # La API devolvió un error (ej. 401 - no autorizado)
                messages.error(request, 'Credenciales incorrectas. Por favor, inténtelo de nuevo.')

        except requests.exceptions.RequestException as e:
            messages.error(request, f'Error de conexión con la API: {e}')

    return render(request, 'paginas/login.html')


    

def index(request):
    return render(request, 'paginas/index.html')


def usu(request: HttpRequest):
    # 1. Verificar si el token de la API existe en la sesión
    if 'api_token' not in request.session:
        messages.warning(request, "Debe iniciar sesión para ver esta información.")
        return redirect('inicio')  # Redirige a la página de login si no hay token

    url_api = "http://comedor.mercal.gob.ve/api/p1/users"
    usuarios = []  # Inicializamos la variable aquí para que siempre esté definida
    token = request.session.get('api_token')
    
    # Preparamos las cabeceras con el token para la autenticación
    headers = {
        'Authorization': f'Bearer {token}'
    }

    try:
        # 2. Hacemos la solicitud a la API usando el token en los headers
        response = requests.get(url_api, headers=headers, timeout=10)
        
        # 3. Verificamos el estado de la respuesta
        response.raise_for_status()
        
        # 4. Procesamos la respuesta JSON si todo fue bien
        json_data = response.json()
        usuarios = json_data.get('data', [])
        
    except requests.exceptions.HTTPError as http_err:
        if http_err.response.status_code == 401:
            messages.error(request, "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.")
            return redirect('login')
        else:
            messages.error(request, f"Error HTTP: {http_err} - No se pudo obtener la información de los usuarios.")
            
    except requests.exceptions.ConnectionError as conn_err:
        messages.error(request, f"Error de conexión: {conn_err} - No se pudo conectar con la API.")
            
    except requests.exceptions.Timeout as timeout_err:
        messages.error(request, f"Error de tiempo de espera: {timeout_err} - La solicitud tardó demasiado en responder.")
            
    except requests.exceptions.RequestException as req_err:
        messages.error(request, f"Ocurrió un error inesperado: {req_err}")

    # 5. Renderizamos la plantilla con los datos obtenidos (o una lista vacía en caso de error)
    return render(request, 'paginas/usuarios.html', {'usuarios': usuarios})

def user_registro(request):
   group = Group.objects.all()
   return render (request, 'paginas/registrar_usuario.html', {'group':group})

def registro(request):
    permiso = Permission.objects.all()
    
    if request.method == 'POST':
        name = request.POST.get('name')
        permisos_ids = request.POST.getlist('permisos_ids')

        # 1. Verificar si el grupo ya existe
        if Group.objects.filter(name=name).exists():
            # Si el grupo ya existe, muestra un mensaje de error y no crea el grupo
            messages.error(request, f'El grupo "{name}" ya existe. Por favor, elige otro nombre.')
            return render(request, 'paginas/registrar.html', {'permiso': permiso})

        # 2. Si no existe, crea el nuevo grupo
        new_group = Group.objects.create(name=name)

        # 3. Asignar los permisos al grupo
        for permiso_id in permisos_ids:
            try:
                perm = Permission.objects.get(id=permiso_id)
                new_group.permissions.add(perm)
            except Permission.DoesNotExist:
                pass  # Ignorar si el permiso no se encuentra

        messages.success(request, f'El Rols {name} ha sido creado exitosamente.')
        return redirect('usu')
    
    return render(request, 'paginas/registrar.html', {'permiso': permiso})


import requests
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import HttpRequest

def menu(request: HttpRequest):
    if 'api_token' not in request.session:
        messages.warning(request, "Debe iniciar sesión para ver esta información.")
        return redirect('inicio') 

    url_api = "http://comedor.mercal.gob.ve/api/p1/menus"
    menus = []  
    token = request.session.get('api_token')
    
    headers = {
        'Authorization': f'Bearer {token}'
    }

    try:
        response = requests.get(url_api, headers=headers, timeout=10)
        response.raise_for_status()
        
        json_data = response.json()
        
        # === Lógica de corrección ===
        # Si la respuesta es una lista, la asignamos directamente
        if isinstance(json_data, list):
            menus = json_data
        # Si es un diccionario y tiene la clave 'data', la extraemos
        elif isinstance(json_data, dict) and 'data' in json_data:
            menus = json_data.get('data', [])
        else:
            # Si el formato no es el esperado, mostramos un error
            messages.error(request, "El formato de la respuesta de la API para menús no es el esperado.")
        
    except requests.exceptions.HTTPError as http_err:
        if http_err.response.status_code == 401:
            messages.error(request, "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.")
            return redirect('login')
        else:
            messages.error(request, f"Error HTTP: {http_err} - No se pudo obtener la información de los menús.")
            
    except requests.exceptions.ConnectionError as conn_err:
        messages.error(request, f"Error de conexión: {conn_err} - No se pudo conectar con la API.")
            
    except requests.exceptions.Timeout as timeout_err:
        messages.error(request, f"Error de tiempo de espera: {timeout_err} - La solicitud tardó demasiado en responder.")
            
    except requests.exceptions.RequestException as req_err:
        messages.error(request, f"Ocurrió un error inesperado: {req_err}")

    return render(request, 'paginas/menu.html', {'menus': menus})

    

def seleccion(request):
    return render(request, 'paginas/seleccion.html')

def resumen(request):
    return render(request, 'paginas/resumen.html')

def ticket(request):
    return render(request, 'paginas/ticket.html')

def qr(request):
    return render(request, 'paginas/qr.html')


#logout de la aplicacion
def logout_view(request):
    logout(request)
    messages.success(request, 'Has cerrado sesión exitosamente.')
    return redirect('inicio')