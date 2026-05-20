# Fix Products Not Loading Issue (Deployed: clothingstore-2-smeg.onrender.com)

## Status Legend
- [x] Completed
- [ ] Pending

## Plan Steps:
### [x] Step 0: Analysis & Plan Approved ✅
**Summary**: API exists but DB empty on Render + frontend wrong backend URL.

### [x] Step 1: Fix frontend BACKEND_URL in products.js ✅
**Files**: `frontend/js/products.js` (Updated to clothingstore-2-smeg.onrender.com)

### [x] Step 2: Auto-populate products on Render deploy ✅
**Files**: `render.yaml`

### [ ] Step 3: Sync/attach product images locally
**Command**: `cd backend && python sync_product_images.py`

### [ ] Step 4: Local test
**Commands**: `cd backend && python manage.py runserver`, open frontend/index.html

### [ ] Step 5: Commit & push to trigger Render redeploy

### [ ] Step 6: Verify live site
**Tests**: Products load, admin has data

## Files to Edit:
- frontend/js/products.js
- render.yaml

