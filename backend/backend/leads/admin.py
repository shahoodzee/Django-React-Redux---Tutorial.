from django.contrib import admin
from .models import Lead
    # Register your models here.
class LeadAdmin(admin.ModelAdmin):  # add this
    list_display = ('name', 'email', 'message', 'gender', 'image')  # add this
    

admin.site.register(Lead, LeadAdmin)  # add this    