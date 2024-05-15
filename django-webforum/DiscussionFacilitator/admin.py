from django.contrib import admin

# Register your models here.

from .models import Discussion, Link, Comment, Like, Opinion, InitialLinkOpinion

admin.site.register(Discussion)
admin.site.register(Link)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Opinion)
admin.site.register(InitialLinkOpinion)
