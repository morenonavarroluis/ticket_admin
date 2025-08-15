from django.shortcuts import render, redirect ,get_object_or_404
from django.contrib.auth.forms import  AuthenticationForm 
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate ,login ,logout
from django.contrib.auth.models import User,Group ,Permission
from django.contrib import messages
from django.db import transaction
# Create your views here.

def inicio(request):
     if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password')
            user = authenticate(email=email, password=password)

            if user is not None:
               
                login(request, user)  
                
               
                if user.groups.filter(name='administrador').exists():
                   
                    return redirect('index')
                
                else:
                   
                    return redirect('home')  
        else:
          
            return render(request, 'paginas/index.html', {'form': form, 'error': 'Usuario o contraseña incorrectos'})
    
    # Maneja la solicitud GET para mostrar el formulario
     else:
        form = AuthenticationForm()
        return render(request, 'paginas/login.html')
    

def index(request):
    return render(request, 'paginas/index.html')


def usu(request):
    usuarios = User.objects.all()
    return render(request, 'paginas/usuarios.html',{'usuarios':usuarios })

def user_registro(request):
   group = Group.objects.all()
   if request.method == 'POST':
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        email =request.POST.get('email', '').strip()
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()
        rol_id = request.POST.get('rol')
        print(rol_id)
        # Validación de campos vacíos
        if not all([first_name, last_name, email, username, password, rol_id]):
            messages.error(request, 'Todos los campos son obligatorios.')
            return redirect('usu')
        
        # Validación de longitud mínima de password
        if len(password) < 8:
            messages.error(request, 'La contraseña debe tener al menos 8 caracteres.')
            return redirect('usu')
            
        # Validación de formato de username
        if not username.isalnum():
            messages.error(request, 'El nombre de usuario solo puede contener letras y números.')
            return redirect('usu')
            
        # Verificar si el nombre de usuario ya existe
        if User.objects.filter(username__iexact=username).exists():
            messages.error(request, 'El nombre de usuario ya existe. Por favor, elige otro.')
            return redirect('usu')

        try:
        
            with transaction.atomic():
             
                new_user = User.objects.create_user(
                    first_name = first_name,
                    last_name = last_name,
                    email = email,
                    username=username,
                    password=password,
                )

                
                rol_instance = get_object_or_404(Group, id=rol_id)
                new_user.groups.add(rol_instance)

               

                messages.success(request, f'El usuario {username} ha sido registrado exitosamente.')
                return redirect('usu')
            
        except Exception as e:
            messages.error(request, f'Error inesperado al registrar el usuario: {str(e)}')
            return redirect('usu')
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

#logout de la aplicacion
def logout_view(request):
    logout(request)
    messages.success(request, 'Has cerrado sesión exitosamente.')
    return redirect('inicio')