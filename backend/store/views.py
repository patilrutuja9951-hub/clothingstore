from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import Q
from .models import Product, Review, Category
import json


# ================= HOME =================
def home(request):
    return JsonResponse({"message": "Backend is running 🚀"})


# ================= SIGNUP =================
@csrf_exempt
def signup_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    data = json.loads(request.body)

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return JsonResponse({"error": "Missing fields"}, status=400)

    if User.objects.filter(username=email).exists():
        return JsonResponse({"error": "User already exists"}, status=400)

    User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name
    )

    return JsonResponse({"message": "Signup success"})


# ================= LOGIN =================
@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    data = json.loads(request.body)

    email = data.get("email")
    password = data.get("password")

    user = authenticate(username=email, password=password)

    if not user:
        return JsonResponse({"error": "Invalid email or password"}, status=400)

    login(request, user)

    return JsonResponse({
        "message": "Login success",
        "user": {
            "name": user.first_name,
            "email": user.email
        }
    })


# ================= LOGOUT =================
@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out"})


# ================= PRODUCTS API =================
def product_list(request):
    category = request.GET.get("category")
    search = request.GET.get("search", "")
    
    products = Product.objects.all()
    
    if category:
        products = products.filter(category__name__iexact=category)
    
    if search:
        products = products.filter(
            Q(name__icontains=search) | Q(description__icontains=search)
        )

    data = []

    for p in products:
        image_url = p.image.url if p.image else None
        if image_url:
            while image_url.endswith('%20'):
                image_url = image_url[:-3]
            image_url = image_url.strip()
        data.append({
            "id": p.id,
            "name": p.name,
            "price": str(p.price),
            "description": p.description,
            "image": request.build_absolute_uri(image_url) if image_url else None,
            "category": p.category.name if p.category else None
        })

    return JsonResponse(data, safe=False)


# ================= PRODUCT DETAIL =================
def product_detail(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        reviews = Review.objects.filter(product=product)
        
        reviews_data = []
        for review in reviews:
            reviews_data.append({
                "id": review.id,
                "rating": review.rating,
                "comment": review.comment,
                "created_at": review.created_at.isoformat()
            })
        
        image_url = product.image.url if product.image else None
        if image_url:
            while image_url.endswith('%20'):
                image_url = image_url[:-3]
            image_url = image_url.strip()
        return JsonResponse({
            "id": product.id,
            "name": product.name,
            "price": str(product.price),
            "description": product.description,
            "image": request.build_absolute_uri(image_url) if image_url else None,
            "category": product.category.name if product.category else None,
            "reviews": reviews_data
        })
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)


# ================= CATEGORIES =================
def categories_list(request):
    categories = Category.objects.all()
    data = [{"id": c.id, "name": c.name, "slug": c.slug} for c in categories]
    return JsonResponse(data, safe=False)


# ================= ADD REVIEW =================
@csrf_exempt
def add_review(request, product_id):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    try:
        data = json.loads(request.body)

        rating = data.get("rating")
        comment = data.get("comment")

        if not rating or not comment:
            return JsonResponse({"error": "Missing rating or comment"}, status=400)

        product = Product.objects.get(id=product_id)

        Review.objects.create(
            product=product,
            rating=rating,
            comment=comment
        )

        return JsonResponse({"message": "Review added successfully"})

    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)