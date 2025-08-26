from datetime import datetime
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render, redirect ,get_object_or_404
from django.contrib.auth import  logout
from django.contrib.auth.models import User,Group ,Permission
from django.contrib import messages
from django.db import transaction
import requests

#Inicio de sesion con la API externa
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
             
                messages.error(request, 'Credenciales incorrectas. Por favor, inténtelo de nuevo.')

        except requests.exceptions.RequestException as e:
            messages.error(request, f'Error de conexión con la API: {e}')

    return render(request, 'paginas/login.html')


  

def index(request):
    return render(request, 'paginas/index.html')


def usu(request: HttpRequest):
   
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

def user_registro(request: HttpRequest) -> HttpResponse:
    """
    Handles user registration by sending a POST request to an external API.

    Args:
        request: The Django HttpRequest object.

    Returns:
        An HttpResponse redirecting to another page or rendering the registration form.
    """
    url = "http://comedor.mercal.gob.ve/api/p1/users"
    token = request.session.get('api_token')
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    if request.method == 'POST':
        # Use .get() with a default value to prevent KeyError if a field is missing
        name = request.POST.get('name', '')
        email = request.POST.get('email', '')
        password = request.POST.get('password', '')
        password_confirmation = request.POST.get('password_confirmation', '')
        id_gerencia = request.POST.get('id_gerencia', '')

        # Basic validation to ensure required fields aren't empty
        if not all([name, email, password, password_confirmation, id_gerencia]):
            messages.error(request, 'Todos los campos son obligatorios.')
            return redirect('usu') # Replace with your form view name

        data = {
            'name': name,
            'email': email,
            'password': password,
            'password_confirmation': password_confirmation,
            'id_gerencia': id_gerencia
        }

        try:
            # It's good practice to set a timeout for external requests
            response = requests.post(url, json=data, headers=headers, timeout=10)
            response.raise_for_status()  # This will raise an HTTPError for 4xx/5xx status codes

            messages.success(request, 'Usuario registrado exitosamente.')
            return redirect('usu')

        except requests.exceptions.HTTPError as e:
            # Handle HTTP-specific errors (e.g., 400 Bad Request, 401 Unauthorized)
            try:
                json_data = response.json()
                error_message = json_data.get('message', 'Error al registrar el usuario.')
                messages.error(request, error_message)
            except requests.exceptions.JSONDecodeError:
                # Handle cases where the response isn't valid JSON
                messages.error(request, f'Error del servidor: {response.text}')

        except requests.exceptions.RequestException as e:
            # Catch all other request-related errors (e.g., connection, DNS)
            messages.error(request, f'Error de conexión con la API: {e}')

    return render(request, 'paginas/usuarios.html') # Replace with your form template path

def eliminar_user(request, id):
    if request.method == 'GET':
        url = f"http://comedor.mercal.gob.ve/api/p1/users/{id}"
        token = request.session.get('api_token')
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

        try:
            response = requests.delete(url, headers=headers, timeout=10)
            response.raise_for_status()  # Raise an error for bad responses

            messages.success(request, 'Usuario eliminado exitosamente.')
            return redirect('usu')

        except requests.exceptions.HTTPError as e:
            try:
                json_data = response.json()
                error_message = json_data.get('message', 'Error al eliminar el usuario.')
                messages.error(request, error_message)
            except requests.exceptions.JSONDecodeError:
                messages.error(request, f'Error del servidor: {response.text}')

        except requests.exceptions.RequestException as e:
            messages.error(request, f'Error de conexión con la API: {e}')

    return redirect('usu')
        
def registro(request):
    pass



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
    if 'api_token' not in  request.session:
        messages.warning(request,"Debe iniciar sesión para ver esta información.")
        return redirect (inicio)
    
    url_api = "http://comedor.mercal.gob.ve/api/p1/empleados"
    empleados = []
    token = request.session.get('api_token')
    headers = {
        'Authorization': f'Bearer {token}'
    }
    try:
        response = requests.get(url_api, headers=headers, timeout=10)
        response.raise_for_status()
        json_data = response.json()

        # 1. Acceder al primer 'data' y luego al segundo 'data'
        data_principal = json_data.get('data', {})
        empleados = data_principal.get('data', [])

    except requests.exceptions.RequestException as req_err:
        messages.error(request, f"Ocurrió un error inesperado: {req_err}")

    return render(request, 'paginas/seleccion.html', {'empleados': empleados})

def resumen(request):
    return render(request, 'paginas/resumen.html')

def ticket(request):
    return render(request, 'paginas/ticket.html')

def empleados(request):
    if 'api_token' not in request.session:
        messages.warning(request, "Debe iniciar sesión para ver esta información.")
        return redirect('inicio') 

    url_api = "http://comedor.mercal.gob.ve/api/p1/empleados"
    empleados = []
    token = request.session.get('api_token')
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    try:
        response = requests.get(url_api, headers=headers, timeout=10)
        response.raise_for_status()
        json_data = response.json()

        # 1. Acceder al primer 'data' y luego al segundo 'data'
        data_principal = json_data.get('data', {})
        empleados = data_principal.get('data', [])

    except requests.exceptions.RequestException as req_err:
        messages.error(request, f"Ocurrió un error inesperado: {req_err}")

    return render(request, 'paginas/empleados.html', {'empleados': empleados})


#logout de la aplicacion
def logout_view(request):
    logout(request)
    messages.success(request, 'Has cerrado sesión exitosamente.')
    return redirect('inicio')