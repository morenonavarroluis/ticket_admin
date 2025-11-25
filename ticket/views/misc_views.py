from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from django.contrib import messages
import requests
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from io import BytesIO
from django.conf import settings
from requests.exceptions import ConnectionError, HTTPError, Timeout
from datetime import date
api_url = settings.API


def get_api_headers(request):
    """Obtiene los encabezados de autorización de la sesión."""
    token = request.session.get('api_token')
    return {'Authorization': f'Bearer {token}'}

def fetch_api_data(url, headers, params=None):
    """Función genérica para realizar una llamada GET a la API con manejo de errores."""
    try:
        response = requests.get(
            url, 
            headers=headers, 
            params=params if params else {}, 
            timeout=10
        )
        response.raise_for_status() 
        return response.json()
    except (ConnectionError, HTTPError, Timeout) as e:
        # Aquí puedes loggear el error más detalladamente si es necesario
        print(f"Error al conectar/obtener de la API ({url}): {e}")
        return None
    except Exception as e:
        print(f"Error inesperado al obtener de la API ({url}): {e}")
        return None

def get_user_data(api_url, headers):
    """Obtiene la lista de usuarios y cuenta cuántos hay."""
    
    url = f"{api_url}/users"
    json_data = fetch_api_data(url, headers)
    
    if json_data is None:
        return 0, []
        
    users = json_data.get('data', [])
    number = len(users)
    return number, users
    
def calculate_daily_sales(api_url, headers):
    """Obtiene los pedidos de hoy y calcula el total de ventas."""
    
    hoy = date.today().isoformat()
    endpoint = f"{api_url}/pedidos"
    params = {'fecha': hoy} 
    
    json_data = fetch_api_data(endpoint, headers, params)
    
    if json_data is None:
        return 0.0
        
    orders = json_data.get('orders', []) 
    total_sales = 0.0
    
    for order in orders:
        try:
            amount = float(order.get('total_amount', 0.0)) 
            total_sales += int(amount)
        except (ValueError, TypeError):
            # Si el monto es inválido, registramos y seguimos
            print(f"Advertencia: Pedido con monto inválido detectado.") 
            continue
            
    return total_sales

def count_tickets_by_consumption(api_url, headers, consumption_id=3):
    """Cuenta los pedidos que tienen un ID de consumo específico."""
    
    url = f"{api_url}/pedidos"
    json_data = fetch_api_data(url, headers)
    
    if json_data is None:
        return 0
    
    data_pedidos = json_data.get('orders', []) 
    contador_tickets = 0
    
    for pedido in data_pedidos:
        # Acceder de forma segura a datos anidados
        consumo_data = pedido.get('order_consumption', {}) 
        consumido_number = consumo_data.get('id_orders_consumption')
        
        if consumido_number == consumption_id:
            contador_tickets += 1
            
    return contador_tickets

def get_orders_data(api_url, headers):
   url = f"{api_url}/pedidos/monthlyConsumption"
   json_data = fetch_api_data(url, headers)
   if json_data is None:
         return []
     
   orders = json_data.get('orders', []) 
   return orders

def progreso(api_url, headers):
    url = f"{api_url}/ordersDay"
    json_data = fetch_api_data(url, headers)
    if json_data is None:
        return []
    limite = json_data.get("totalAllowed", 0) 
    vendidos = json_data.get("totalSold", 0)     
    restante = json_data.get("remainingTotal", 0)
    progreso_data = {
        'limite': limite,
        'vendidos': vendidos,
        'restante': restante
    }
    
    return progreso_data
    
def index(request):
    """
    Vista principal del dashboard.
    Requiere autenticación, obtiene datos de usuarios, ventas diarias y tickets por consumo.
    """
    
    # 1. **Manejo de Autenticación**
    if 'api_token' not in request.session:
        messages.warning(request, "Debe iniciar sesión para ver esta información.")
        return redirect('inicio')  
    
    headers = get_api_headers(request)
    
    # 2. **Obtención y Procesamiento de Datos de la API**
    
    # Datos de Usuarios
    number, user_data_list = get_user_data(api_url, headers)
    
    # Ventas Diarias
    total_sales = calculate_daily_sales(api_url, headers)
    
    # Conteo de Tickets (ID Consumo = 3)
    contador_tickets_3 = count_tickets_by_consumption(api_url, headers, consumption_id=3)
    
    # recuperar datos de pedidos mensuales
    orders = get_orders_data(api_url, headers)
    
    #recuperar progreso
    progreso_data = progreso(api_url, headers)
    
    contexto = {
        'progreso_data':progreso_data,
        'number': number,
        'datos_usuarios': user_data_list,  
        'total_sales': total_sales,
        'contador_tickets_3': contador_tickets_3,
        'orders': orders,
        'current_page': 'dashboard'
    }

    return render(request, 'paginas/index.html', contexto)

def escaner(request):
    return render(request,"paginas/scan.html",{'current_page' : 'escaner'})

def extras_unified_view(request):
    # 1. Verificación de Autenticación y Encabezados Comunes
    if 'api_token' not in request.session:
        messages.warning(request, "Debe iniciar sesión para ver esta información.")
        return redirect('inicio')
       
    token = request.session.get('api_token')
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # Inicialización del Contexto
    contexto = {
        'current_page': 'extras',
        'limites': None,      # Para el límite de pedidos diarios
        'extras': []          # Para la lista de extras registrados
    }

    # 2. Manejo de la Solicitud POST (Registro de Datos)
    if request.method == 'POST': 
        # Identificar qué formulario se ha enviado
        # Usaremos la presencia de campos específicos para distinguir
        
        # --- Lógica de registro de Límite de Pedidos (de la función 'extras_management') ---
        if 'numberOrdersDay' in request.POST:
            numberOrdersDay = request.POST.get('numberOrdersDay')
           
            if not numberOrdersDay:
                messages.error(request, 'El campo de límite de pedidos es obligatorio.')
                return redirect('extras_unified_view') 

            data = {'numberOrdersDay': numberOrdersDay}

            try:
                response = requests.post(f"{api_url}/ordersDay", json=data, headers=headers, timeout=10)
                response.raise_for_status() 
                messages.success(request, 'Cantidad de pedidos registrada.')
                return redirect('extras_unified_view')
            except requests.exceptions.HTTPError as e:
                messages.error(request, f'Error al registrar el límite de pedidos: {e}')
                return redirect('extras_unified_view')
            except Exception as e:
                messages.error(request, 'Ocurrió un error inesperado al registrar el límite.')
                return redirect('extras_unified_view')

        # --- Lógica de registro de Extras Adicionales (de la función 'regis_extras') ---
        elif 'extras' in request.POST and 'precio' in request.POST:
            precio = request.POST.get('precio')
            extras_name = request.POST.get('extras')
           
            if not all([precio, extras_name]):
                messages.error(request, 'Los campos de extra y precio son obligatorios.')
                return redirect('extras_unified_view') 

            data = {
                'nameExtra': extras_name,
                'price': precio
            }

            try:
                response = requests.post(f"{api_url}/extras", json=data, headers=headers, timeout=10)
                response.raise_for_status() 
                messages.success(request, 'Extra registrado correctamente.')
                return redirect('extras_unified_view')
            except Exception as e:
                messages.error(request, f'Error al registrar el extra: {e}')
                return redirect('extras_unified_view')
        
        else:
            # POST sin campos reconocidos
            messages.error(request, 'Solicitud POST no válida.')
            return redirect('extras_unified_view')

    result = []
    try:
        response_limit = requests.get(f"{api_url}/ordersDay", headers=headers, timeout=10)
        response_limit.raise_for_status() 
        
        limite = response_limit.json() 
        print(limite)
        resultado = limite.get('remainingTotal')
        
        total_all = limite.get('totalAllowed')
        date = limite.get('totalSold')
        
        result ={
            'resultado':resultado,
            'total_all':total_all,
            'date':date
        }
        request.session['result'] = result
    except requests.exceptions.RequestException:
        messages.warning(request, 'No se pudo obtener la información del límite diario.')
        
    
    try:
        response_extras = requests.get(f"{api_url}/extras", headers=headers, timeout=10)
        response_extras.raise_for_status()         
        extras = response_extras.json() 
        resultados = extras.get('extras',[])
        contexto={
            'resultados': resultados
        }
        contexto.update(result)
    except requests.exceptions.RequestException:
        messages.warning(request, 'No se pudo obtener la lista de extras.')

    
    return render(request, "paginas/extras.html",contexto)

def progreso_mensual_view(request):
    pass

