from django.db import models

class Comida(models.Model):
   
    id_menu = models.AutoField(primary_key=True)
   
    sopa = models.CharField(max_length=100)
    contorno = models.CharField(max_length=100)
    seco = models.CharField(max_length=100)
    jugo = models.CharField(max_length=100)
   
    img = models.ImageField(upload_to='comida_images/')
    
   
    class Meta:
      
        verbose_name = 'comida'
        
        verbose_name_plural = 'comidas'

    
    def __str__(self):
        return self.sopa