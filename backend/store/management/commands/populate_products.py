from django.core.management.base import BaseCommand
from store.models import Category, Product


class Command(BaseCommand):
    help = 'Populate database with sample products'

    def handle(self, *args, **options):
        # Clear existing data
        Product.objects.all().delete()
        Category.objects.all().delete()

        # Create categories
        men = Category.objects.create(name="Men", slug="men")
        women = Category.objects.create(name="Women", slug="women")
        oversized = Category.objects.create(name="Oversized", slug="oversized")

        # Create sample products based on current database entries
        products_data = [
            {
                "name": "STREETSTYLE LEATHER JACKET",
                "description": "Bold leather jacket built for streetwear confidence.",
                "price": "2299.00",
                "image": "products/leatherjacket.png",
                "category": men,
            },
            {
                "name": "OVERSIZED BLACK TEE",
                "description": "Relaxed oversized black tee for everyday street style.",
                "price": "899.00",
                "image": "products/blacktee1.png.png",
                "category": men,
            },
            {
                "name": "URBAN CARGO PANTS",
                "description": "Utility cargo pants with a modern streetwear fit.",
                "price": "1499.00",
                "image": "products/cargo.png",
                "category": men,
            },
            {
                "name": "MINIMAL WHITE TEE",
                "description": "Clean white tee that pairs easily with any outfit.",
                "price": "799.00",
                "image": "products/whitetee.png",
                "category": men,
            },
            {
                "name": "STREET HOODIE",
                "description": "Comfortable street hoodie designed for cool weather.",
                "price": "1299.00",
                "image": "products/hoodie.png",
                "category": men,
            },
            {
                "name": "CHIC BOW TOP",
                "description": "Elegant women's top with a statement bow detail.",
                "price": "999.00",
                "image": "products/rmbow_top.png",
                "category": women,
            },
            {
                "name": "SUMMER BREEZE DRESS",
                "description": "Lightweight dress perfect for warm-weather style.",
                "price": "1599.00",
                "image": "products/summerbg.png",
                "category": women,
            },
            {
                "name": "RED LEATHER STREET JACKET",
                "description": "Statement red jacket for bold urban looks.",
                "price": "2399.00",
                "image": "products/red-removebg-preview.png",
                "category": women,
            },
            {
                "name": "OVERSIZED GRAPHIC TEE",
                "description": "Graphic oversized tee for relaxed street style.",
                "price": "999.00",
                "image": "products/graphictee.png",
                "category": oversized,
            },
            {
                "name": "LOOSE FIT SHIRT",
                "description": "Loose-fitting shirt made for everyday comfort.",
                "price": "1199.00",
                "image": "products/loose_shirt.png",
                "category": oversized,
            },
        ]

        for product_data in products_data:
            Product.objects.create(**product_data)

        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with sample products!')
        )
