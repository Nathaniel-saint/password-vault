from django.contrib import admin
from .models import Domain

# Register your models here.

class DomainAdmin(admin.ModelAdmin):
    list_display = ['site_name', 'login_url', 'site_username_or_email']

admin.site.register(Domain, DomainAdmin)