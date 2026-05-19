# E-Commerce Clothing Store 🛍️

A full-stack e-commerce application built with Django (backend) and HTML/CSS/JavaScript (frontend) for an online clothing store.

## 📋 Project Overview

This is a complete clothing store e-commerce platform featuring:
- **Backend**: Django REST API with SQLite database
- **Frontend**: Responsive HTML5/CSS3/JavaScript
- **Features**: Product catalog, shopping cart, user authentication, reviews, wishlist

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Git
- pip (Python package manager)

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

#### 2. Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
# OR
source venv/bin/activate      # macOS/Linux
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
pip install Pillow --only-binary :all:
```

#### 4. Run Migrations
```bash
python manage.py migrate
```

#### 5. Populate Sample Data
```bash
python manage.py populate_products
```

#### 6. Start Development Server
```bash
python manage.py runserver 0.0.0.0:8000
```

The API will be available at `http://localhost:8000/`

## 📁 Project Structure

```
frontend/
├── backend/                          # Django backend
│   ├── mysite/                       # Django project settings
│   │   ├── settings.py              # Project configuration
│   │   ├── urls.py                  # Main URL router
│   │   └── wsgi.py
│   ├── store/                        # Main Django app
│   │   ├── models.py                # Database models (Category, Product, Review)
│   │   ├── views.py                 # API endpoints
│   │   ├── urls.py                  # App URL routes
│   │   ├── serializers.py           # DRF serializers
│   │   ├── admin.py                 # Django admin configuration
│   │   ├── management/              # Custom management commands
│   │   │   └── commands/
│   │   │       └── populate_products.py  # Sample data loader
│   │   └── migrations/              # Database migrations
│   ├── media/products/              # Uploaded product images
│   ├── db.sqlite3                   # SQLite database
│   ├── manage.py                    # Django CLI
│   └── requirements.txt             # Python dependencies
├── frontend/                        # Static frontend files
│   ├── css/                         # Stylesheets
│   │   └── style.css                # Main stylesheet
│   ├── images/                      # Product and UI images
│   ├── js/                          # JavaScript files
│   │   ├── main.js                  # Main app logic
│   │   ├── auth.js                  # Authentication handler
│   │   ├── cart.js                  # Shopping cart functionality
│   │   ├── products.js              # Product listing
│   │   ├── product-detail.js        # Product detail page
│   │   ├── checkout.js              # Checkout process
│   │   ├── favourites.js            # Wishlist functionality
│   │   ├── profile.js               # User profile management
│   │   ├── search.js                # Search functionality
│   │   └── slider.js                # Image slider
│   ├── add_review.html              # Review submission
│   ├── cart.html                    # Shopping cart
│   ├── checkout.html                # Checkout page
│   ├── favourites.html              # Wishlist page
│   ├── index.html                   # Homepage
│   ├── men.html                     # Men's category
│   ├── oversized.html               # Oversized category
│   ├── product-detail.html          # Product detail view
│   ├── products.html                # Product listing
│   ├── profile.html                 # User profile
│   ├── signin.html                  # Login page
│   ├── signup.html                  # Registration page
│   ├── track-orders.html            # Order tracking
│   └── women.html                   # Women's category
├── .gitignore                       # Git ignore file
├── .hintrc                          # HTML hint configuration
├── README.md                        # This file
└── SETUP.md                         # Setup instructions
```

## 🔌 API Endpoints

### Authentication
- `POST /api/signup/` - User registration
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout

### Products
- `GET /api/products/` - List all products (supports filters)
- `GET /api/product/<id>/` - Get product details with reviews
- `GET /api/categories/` - List all categories

### Reviews
- `POST /api/add-review/<product_id>/` - Add product review

### Query Parameters
- `category=<category_name>` - Filter by category (e.g., `?category=Men`)
- `search=<query>` - Search products (e.g., `?search=shirt`)

## 🗄️ Database Schema

### Category Model
```
- id: Integer (Primary Key)
- name: String (max 255 chars)
- slug: String (unique, auto-generated from name)
```

### Product Model
```
- id: Integer (Primary Key)
- name: String (max 255 chars)
- description: Text
- price: Decimal (10 digits, 2 decimal places)
- image: ImageField (uploads to media/products/)
- category: ForeignKey to Category
- created_at: DateTime (auto-set on creation)
```

### Review Model
```
- id: Integer (Primary Key)
- product: ForeignKey to Product
- rating: Integer
- comment: Text
- created_at: DateTime (auto-set on creation)
```

## ⚙️ Configuration

### Django Settings (`backend/mysite/settings.py`)
- **DEBUG**: Set to `True` for development (change to `False` for production)
- **SECRET_KEY**: Change this in production!
- **ALLOWED_HOSTS**: Add your domain when deploying
- **CORS Settings**: `CORS_ALLOW_ALL_ORIGINS = True` (change for production)
- **Database**: SQLite (change to PostgreSQL for production)

### Static & Media Files
- Static files: `/staticfiles/`
- Media files: `/media/`

## 🛠️ Dependencies

See [requirements.txt](backend/requirements.txt):
- **Django 4.2.0** - Web framework
- **djangorestframework 3.14.0** - REST API framework
- **django-cors-headers 4.0.0** - CORS support
- **Pillow 12.2.0** - Image processing (for product images)
- **python-decouple 3.8** - Environment variable management

## 🎨 Features

### Frontend
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Product catalog with categories
- ✅ Shopping cart (persisted in localStorage)
- ✅ User authentication (localStorage-based)
- ✅ Wishlist/Favorites
- ✅ Product search and filtering
- ✅ Product reviews and ratings
- ✅ Checkout process
- ✅ Order tracking

### Backend
- ✅ RESTful API with Django
- ✅ User authentication (Django built-in)
- ✅ Product management
- ✅ Review system
- ✅ CORS enabled for frontend
- ✅ SQLite database
- ✅ Admin panel (Django admin)

## 📝 Sample Data

The project includes 12 pre-loaded sample products across 3 categories:
- **Men**: 4 products
- **Women**: 4 products
- **Oversized**: 4 products

To reload sample data:
```bash
python manage.py populate_products
```

## 🔐 Security Notes

⚠️ **For Development Only!**
- Debug mode is enabled
- CORS allows all origins
- No production secret key
- SQLite database (not suitable for production)

**Production Checklist:**
- [ ] Set `DEBUG = False`
- [ ] Change `SECRET_KEY`
- [ ] Update `ALLOWED_HOSTS`
- [ ] Configure CORS properly
- [ ] Use PostgreSQL or MySQL
- [ ] Set up HTTPS/SSL
- [ ] Configure environment variables
- [ ] Set up proper logging

## 🚀 Deployment

### Using Gunicorn (Production Server)
```bash
pip install gunicorn
gunicorn mysite.wsgi:application
```

### Using Docker
Create a `Dockerfile` and `docker-compose.yml` for containerization.

### Hosting Options
- Heroku
- AWS (EC2, Lightsail)
- DigitalOcean
- PythonAnywhere
- Vercel (frontend only)

## 📱 Frontend Technologies

- **HTML5** - Semantic markup
- **CSS3** - Styling and animations
- **Vanilla JavaScript** - No frameworks (lightweight)
- **LocalStorage API** - Client-side data persistence

## 🐛 Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'django'"
**Solution**: Activate virtual environment and install dependencies
```bash
source venv/Scripts/activate
pip install -r requirements.txt
```

### Issue: "Cannot use ImageField because Pillow is not installed"
**Solution**: Install Pillow
```bash
pip install Pillow --only-binary :all:
```

### Issue: "CORS error when calling API from frontend"
**Solution**: Already configured in `settings.py`; ensure both frontend and backend are properly connected.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Developer** - Initial Project Setup

## 📧 Contact

For questions or support, please create an issue in the repository.

---

**Happy Coding! 🎉**

Last Updated: April 29, 2026
