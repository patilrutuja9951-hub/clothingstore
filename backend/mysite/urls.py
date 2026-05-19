from django.contrib import admin
from django.urls import path, include, re_path
from django.views.static import serve
from store.views import home

# 👇 ADD THESE
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', serve, {'path': 'index.html', 'document_root': settings.FRONTEND_DIR}),
    path('admin/', admin.site.urls),

    path('api/', include('store.urls')),
]

# 👇 THIS IS REQUIRED FOR IMAGES
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [
        re_path(r'^(?P<path>.*)$', serve, {'document_root': settings.FRONTEND_DIR}),
    ]