import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse, Http404
from django.conf import settings


def serve_frontend(request, path=''):
    frontend_dir = settings.FRONTEND_DIR

    # Try to serve the exact file requested
    if path:
        file_path = os.path.join(frontend_dir, path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            ext = os.path.splitext(path)[1].lower()
            content_types = {
                '.html': 'text/html; charset=utf-8',
                '.css':  'text/css',
                '.js':   'application/javascript',
                '.json': 'application/json',
                '.png':  'image/png',
                '.jpg':  'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.webp': 'image/webp',
                '.svg':  'image/svg+xml',
                '.ico':  'image/x-icon',
            }
            ct = content_types.get(ext, 'application/octet-stream')
            mode = 'r' if ext in ('.html', '.css', '.js', '.svg') else 'rb'
            encoding = 'utf-8' if mode == 'r' else None
            with open(file_path, mode, encoding=encoding) as f:
                return HttpResponse(f.read(), content_type=ct)

    # Default: serve index.html
    index_path = os.path.join(frontend_dir, 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html; charset=utf-8')

    raise Http404("index.html not found")


urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # ALL API routes under /api/
    path('api/', include('store.urls')),

    # Catch-all — serves frontend HTML files
    # MUST be last
    re_path(r'^(?P<path>.*)$', serve_frontend),
]