import os
import shutil
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

from store.models import Product

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_IMAGES_DIR = os.path.normpath(
    os.path.join(BASE_DIR, '..', 'frontend', 'static', 'images')
)

MEDIA_PRODUCTS_DIR = os.path.join(BASE_DIR, 'media', 'products')
os.makedirs(MEDIA_PRODUCTS_DIR, exist_ok=True)

image_map = {
    'STREETSTYLE LEATHER JACKET': 'leatherjacket.png',
    'URBAN CARGO PANTS': 'cargo.png',
    'MINIMAL WHITE TEE': 'whitetee.png',
    'STREET HOODIE': 'hoodie.png',
    'CHIC BOW TOP': 'rmbow_top.png',
    'SUMMER BREEZE DRESS': 'summerbg.png',
    'RED LEATHER STREET JACKET': 'red-removebg-preview.png',
    'OVERSIZED GRAPHIC TEE': 'graphictee.png',
    'LOOSE FIT SHIRT': 'loose_shirt.png'
}

 
print(f'Frontend images directory: {FRONTEND_IMAGES_DIR}')
print(f'Media products directory: {MEDIA_PRODUCTS_DIR}')

for product in Product.objects.all():
    if product.image:
        print(f'Skipping {product.name}, already has image: {product.image.name}')
        continue

    filename = image_map.get(product.name)
    if not filename:
        print(f'No mapped image for product: {product.name}')
        continue

    source_name = filename
    source_path = os.path.join(FRONTEND_IMAGES_DIR, source_name)
    if not os.path.exists(source_path):
        alt_source_path = source_path.replace('_', ' ')
        if os.path.exists(alt_source_path):
            source_path = alt_source_path

    if not os.path.exists(source_path):
        print(f'Image file not found for {product.name}: {source_path}')
        continue

    dest_path = os.path.join(MEDIA_PRODUCTS_DIR, filename)
    if not os.path.exists(dest_path):
        shutil.copy2(source_path, dest_path)
        print(f'Copied {source_name} to media/products')
    else:
        print(f'Already exists: {dest_path}')

    product.image = f'products/{filename}'
    product.save()
    print(f'Updated product {product.name} image => products/{filename}')

print('Product image sync complete.')
