from django.db import models
from authentication.models import CustomUser

# Create your models here.

class Domain(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    site_name = models.CharField(max_length=255)
    login_url = models.CharField(max_length=500, blank=True, null=True)
    site_username_or_email = models.CharField(max_length=255)
    site_password = models.CharField(max_length=500)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.site_name
    
    