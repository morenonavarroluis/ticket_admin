from django.shortcuts import render, redirect
from django.contrib import messages
import requests
from django.conf import settings
from datetime import datetime, date
from collections import defaultdict
api_url = settings.API

def menu(request):
    
    if 'api_token' not in request.session:
        messages.warning(request, "Debe iniciar sesión para ver esta información.")
        return redirect('inicio')

    # Diccionario para almacenar los menús agrupados por categoría
    grouped_menus = defaultdict(list) 
    date_of_menu = None 
    token = request.session.get('api_token')
    
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    fecha_actual = date.today()
    
    
    # Convertimos la fecha a formato ISO (YYYY-MM-DD) para la API
    fecha_para_api = fecha_actual.isoformat() 
    
    try:
            # 1. Llamada a la API con el filtro de fecha actual
            response = requests.get(f"{api_url}/menus?date={fecha_para_api}", headers=headers, timeout=10)
            response.raise_for_status() 
            
            json_data = response.json()
            
            # Bloque de procesamiento seguro
            raw_menus = json_data.get('menus', [])
           
            if raw_menus:
                # La fecha del menú es la que pedimos a la API
                date_of_menu = raw_menus[0].get('date_menu', fecha_para_api)
                
                # 2. Itera sobre la lista plana y agrupa
                for item in raw_menus:
                    category = item['food_category']
                    
                    # *** CAMBIO CLAVE AQUÍ ***
                    # Dividir la cadena de ingredientes por la coma, eliminando espacios extra
                    raw_ingredients = item['name_ingredient'].split(',')
                    
                    for ingredient in raw_ingredients:
                        # Limpia cualquier espacio en blanco que quede al inicio/final del ingrediente
                        cleaned_ingredient = ingredient.strip()
                        
                        # Solo agrega si no está vacío después de limpiar
                        if cleaned_ingredient:
                            grouped_menus[category].append(cleaned_ingredient)
                    
            else:
                # Mensaje claro si no hay menú para hoy
                messages.info(request, f"No hay registro de menú disponible para el día {fecha_para_api}.")
                
    except requests.exceptions.RequestException as req_err:
            messages.error(request, f"Ocurrió un error inesperado al conectar: {req_err}")
    except Exception as e:
            messages.error(request, f"Error desconocido al procesar el menú: {e}")
            
    contexto= {
            'fecha_actual':fecha_actual,
            'date_of_menu':date_of_menu,
            'grouped_menus': grouped_menus, 
            'current_page' : 'menu'
        }
    print(grouped_menus)
    
    return render(request, 'paginas/menu.html', contexto)
def registro_menu(request):
    if request.method == 'POST':
        
        sopas = request.POST.getlist('sopas')
        print (sopas)
        contornos = request.POST.getlist('contornos')
        print (contornos)
        proteinas = request.POST.getlist('proteinas')
        print (proteinas)
        postres = request.POST.getlist('postres') 
        print (postres)
        bebidas = request.POST.getlist('bebidas')
        print (bebidas)
        ensaladas = request.POST.getlist('ensaladas')
        print (ensaladas)
        
       
        data = []
        
        
        def agregar_al_payload(categoria, ingredientes):
            if ingredientes:
                
                ingredient_string = ", ".join(ingredientes)
                data.append({
                    "foodCategory": categoria,
                    "ingredient": ingredient_string
                })
        
      
        agregar_al_payload("Sopas", sopas)
        agregar_al_payload("Contornos", contornos)
        agregar_al_payload("Proteinas", proteinas)
        agregar_al_payload("Postres", postres)
        agregar_al_payload("Bebidas", bebidas)
        agregar_al_payload("Ensaladas", ensaladas)
        
        try:
            token = request.session.get('api_token')
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = requests.post(f"{api_url}/menus/bluk", json=data, headers=headers, timeout=10)
            response.raise_for_status() 

            messages.success(request, 'Menú registrado exitosamente.')
            return redirect('menu')

        except requests.exceptions.RequestException as e:
            # Manejar errores de la solicitud (conexión, timeouts, etc.)
            messages.error(request, f"Error al registrar: {e}")
        except Exception as e:
            # Manejar otros errores inesperados
            messages.error(request, f"Ocurrió un error inesperado: {e}")
    messages.error(request,"Error al registrar ya hay un menu registrado")
    return redirect('menu')

def actualizar_menu(request, id_menu):
    if request.method == 'POST':
       
        
        first_ingredient = request.POST.get('first_ingredient')

        
        payload = {
            "ingredient": first_ingredient,
        }
        print(payload)
        try:
            token = request.session.get('api_token')
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.patch(
                f"{api_url}/menus/{id_menu}", 
                headers=headers, 
                json=payload,
                timeout=10
            )
            print(response)
            response.raise_for_status()

            messages.success(request, f'Menú  actualizado exitosamente.')
            return redirect('menu')

        except requests.exceptions.RequestException as e:
            messages.error(request, f"Error al actualizar el menú: {e}")
           
    return render(request, "paginas/menu.html")