from django.contrib import admin
from .models import CustomUser
# Register your models here.

class AdminCustomUser(admin.ModelAdmin):
    list_display = ['email', 'fullname']

admin.site.register(CustomUser, AdminCustomUser)