from django.shortcuts import render, redirect
from django.contrib.auth.forms import  AuthenticationForm 
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate ,login ,logout
from django.contrib import messages
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
    return render(request, 'paginas/usuarios.html')

#logout de la aplicacion
def logout_view(request):
    logout(request)
    messages.success(request, 'Has cerrado sesión exitosamente.')
    return redirect('inicio')