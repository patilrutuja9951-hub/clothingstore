import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

from store.models import Product

for cat in ['Men', 'Women', 'Oversized']:
    names = [p.name for p in Product.objects.filter(category__name__iexact=cat)]
    print(f'{cat}:', names)
