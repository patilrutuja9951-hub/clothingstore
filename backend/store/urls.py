from django.urls import path
from .views import (
    signup_view,
    login_view,
    logout_view,
    product_list,
    product_detail,
    categories_list,
    add_review
)

urlpatterns = [
    # AUTH
    path('signup/', signup_view),
    path('login/', login_view),
    path('logout/', logout_view),

    # PRODUCTS
    path('products/', product_list),
    path('products/<int:product_id>/', product_detail),  # FIXED: was 'product/'

    # CATEGORIES
    path('categories/', categories_list),

    # REVIEWS
    path('add-review/<int:product_id>/', add_review),
]