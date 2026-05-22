import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.http import HttpResponse, Http404
from django.views.static import serve


def serve_frontend(request, path=''):
    frontend_dir = str(settings.FRONTEND_DIR)
    
    # If path is empty, serve index.html
    if not path:
        file_path = os.path.join(frontend_dir, 'index.html')
    else:
        file_path = os.path.join(frontend_dir, path)

    # If exact file exists, serve it
    if os.path.exists(file_path) and os.path.isfile(file_path):
        ext = os.path.splitext(file_path)[1].lower()
        content_types = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
        }
        mode = 'r' if ext in ['.html', '.css', '.js', '.svg'] else 'rb'
        encoding = 'utf-8' if mode == 'r' else None
        with open(file_path, mode, encoding=encoding) as f:
            return HttpResponse(
                f.read(),
                content_type=content_types.get(ext, 'application/octet-stream')
            )

    # Fallback to index.html
    index_path = os.path.join(frontend_dir, 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')

    raise Http404("Frontend not found")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('store.urls')),

    # media files
    re_path(r'^media/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    }),
]

# static files
urlpatterns += [
    re_path(r'^static/(?P<path>.*)$', serve, {
        'document_root': settings.FRONTEND_DIR / 'static',
    }),
]

# frontend — serve any .html file directly, catch-all for SPA
urlpatterns += [
    re_path(r'^(?P<path>[^/]+\.html)$', serve_frontend),
    re_path(r'^(?P<path>[^/]+\.html)\?.*$', serve_frontend),
    re_path(r'^$', serve_frontend),
    re_path(r'^(?!admin/|api/|static/|media/).*$', serve_frontend),
]