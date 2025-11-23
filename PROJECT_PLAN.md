# E-Commerce Mini System - خطة العمل الكاملة

## 📋 نظرة عامة على المشروع

مشروع E-Commerce متكامل يتكون من:
- **Backend**: Laravel 10/11 + JWT Authentication
- **Frontend**: Vue.js 3 (Composition API)
- **Database**: MySQL/PostgreSQL
- **الوقت المتوقع**: يومين عمل

---

## 🎯 المتطلبات الأساسية

### التقنيات المستخدمة:
- Laravel 10+ 
- PHP 8.1+
- Vue.js 3
- JWT Authentication (tymon/jwt-auth)
- MySQL/PostgreSQL
- Composer & NPM

---

## 📦 هيكل المشروع

```
task_ECommerce/
├── backend/              # Laravel Project
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/             # Vue.js Project
│   ├── src/
│   ├── public/
│   └── ...
├── PROJECT_PLAN.md       # هذا الملف
└── README.md             # التوثيق الرئيسي
```

---

## 🗄️ تصميم قاعدة البيانات

### الجداول المطلوبة:

#### 1. **users** (المستخدمين)
```sql
- id (PK)
- name (string)
- email (string, unique)
- password (hashed)
- created_at
- updated_at
```

#### 2. **products** (المنتجات)
```sql
- id (PK)
- name (string)
- description (text, nullable)
- price (decimal 10,2)
- stock (integer)
- status (enum: in_stock, out_of_stock)
- created_at
- updated_at
```

#### 3. **orders** (الطلبات)
```sql
- id (PK)
- user_id (FK → users)
- order_number (string, unique)
- total (decimal 10,2)
- address (text)
- phone (string)
- status (enum: pending, completed, cancelled)
- created_at
- updated_at
```

#### 4. **order_items** (تفاصيل الطلب)
```sql
- id (PK)
- order_id (FK → orders)
- product_id (FK → products)
- product_name (string)
- quantity (integer)
- price (decimal 10,2)
- subtotal (decimal 10,2)
- created_at
- updated_at
```

#### 5. **cart_items** (سلة التسوق)
```sql
- id (PK)
- user_id (FK → users)
- product_id (FK → products)
- quantity (integer)
- created_at
- updated_at
```

### العلاقات:
- User → hasMany → Orders
- User → hasMany → CartItems
- Order → hasMany → OrderItems
- Product → hasMany → OrderItems
- Product → hasMany → CartItems

---

## 🔧 PART 1: Backend Development (Laravel)

### المرحلة 1: إعداد المشروع (30 دقيقة)

#### 1.1 إنشاء مشروع Laravel جديد
```bash
composer create-project laravel/laravel backend
cd backend
```

#### 1.2 تثبيت JWT Authentication
```bash
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

#### 1.3 إعداد قاعدة البيانات
- تعديل ملف `.env` بإعدادات قاعدة البيانات
- إنشاء قاعدة بيانات جديدة

---

### المرحلة 2: إنشاء Models & Migrations (45 دقيقة)

#### 2.1 إنشاء Models مع Migrations
```bash
php artisan make:model Product -m
php artisan make:model Order -m
php artisan make:model OrderItem -m
php artisan make:model CartItem -m
```

#### 2.2 تعديل ملفات Migration
- إضافة الحقول المطلوبة لكل جدول
- تعريف العلاقات (Foreign Keys)
- إضافة Indexes للأداء

#### 2.3 تعديل Models
- تعريف `$fillable` attributes
- تعريف العلاقات (Relations)
- إضافة Accessors/Mutators إذا لزم
- إضافة Observers (لتحديث status المنتج تلقائياً)

#### 2.4 تشغيل Migrations
```bash
php artisan migrate
```

---

### المرحلة 3: إعداد JWT Authentication (1 ساعة)

#### 3.1 تعديل User Model
- إضافة `JWTSubject` interface
- تطبيق الدوال المطلوبة

#### 3.2 تعديل ملف config/auth.php
- تغيير driver إلى `jwt`

#### 3.3 إنشاء AuthController
```bash
php artisan make:controller Api/AuthController
```

#### 3.4 تطبيق الـ Endpoints:
- `POST /api/auth/register`
  - Validation (name, email unique, password min:8)
  - Hash password
  - إنشاء user جديد
  - Return token + user data

- `POST /api/auth/login`
  - Validation (email, password)
  - محاولة تسجيل الدخول
  - Return token + user data

- `POST /api/auth/logout`
  - تسجيل خروج (invalidate token)

- `GET /api/auth/me`
  - إرجاع بيانات المستخدم الحالي

---

### المرحلة 4: Products Module (1.5 ساعة)

#### 4.1 إنشاء ProductController
```bash
php artisan make:controller Api/ProductController --resource --api
```

#### 4.2 تطبيق CRUD Operations:
- `GET /api/products`
  - إرجاع كل المنتجات مع pagination
  - إمكانية البحث والفلترة

- `POST /api/products`
  - Validation (name required, price numeric, stock integer)
  - إنشاء منتج جديد
  - تحديد status بناءً على stock

- `PUT /api/products/{id}`
  - Validation
  - تحديث المنتج
  - تحديث status إذا تغير stock

- `DELETE /api/products/{id}`
  - حذف المنتج
  - التحقق من عدم وجود طلبات مرتبطة

#### 4.3 إنشاء Product Observer
```bash
php artisan make:observer ProductObserver --model=Product
```
- تحديث status تلقائياً عند creating/updating
- إذا stock = 0 → status = out_of_stock
- إذا stock > 0 → status = in_stock

#### 4.4 إنشاء Form Requests للـ Validation
```bash
php artisan make:request StoreProductRequest
php artisan make:request UpdateProductRequest
```

---

### المرحلة 5: Cart Module (1 ساعة)

#### 5.1 إنشاء CartController
```bash
php artisan make:controller Api/CartController
```

#### 5.2 تطبيق الـ Endpoints:
- `GET /api/cart`
  - إرجاع محتويات السلة للمستخدم الحالي

- `POST /api/cart/add`
  - إضافة منتج للسلة
  - Validation (product_id, quantity)
  - التحقق من توفر stock

- `PUT /api/cart/{id}`
  - تحديث الكمية
  - التحقق من stock

- `DELETE /api/cart/{id}`
  - حذف عنصر من السلة

- `DELETE /api/cart/clear`
  - تفريغ السلة كاملة

---

### المرحلة 6: Orders Module (2 ساعة)

#### 6.1 إنشاء OrderController
```bash
php artisan make:controller Api/OrderController
```

#### 6.2 تطبيق Order Creation Logic:
- `POST /api/orders`
  - Validation (address required, phone required)
  - التحقق من وجود منتجات في السلة
  - التحقق من stock لكل منتج
  - **Database Transaction** لضمان data integrity:
    1. إنشاء Order
    2. توليد order_number فريد
    3. إنشاء OrderItems من CartItems
    4. خصم stock من Products
    5. حساب total
    6. تفريغ Cart
  - إرجاع تفاصيل الطلب (order_number, total, items)

- `GET /api/orders`
  - إرجاع طلبات المستخدم الحالي
  - مع pagination
  - مع علاقة order_items

- `GET /api/orders/{id}`
  - عرض تفاصيل طلب محدد
  - التحقق من ملكية المستخدم للطلب

#### 6.3 إنشاء Order Service
```bash
php artisan make:service OrderService
```
- فصل business logic عن Controller
- معالجة إنشاء الطلب
- معالجة الأخطاء

#### 6.4 إنشاء Form Requests
```bash
php artisan make:request StoreOrderRequest
```

---

### المرحلة 7: API Resources & Routes (45 دقيقة)

#### 7.1 إنشاء API Resources
```bash
php artisan make:resource UserResource
php artisan make:resource ProductResource
php artisan make:resource OrderResource
php artisan make:resource OrderItemResource
php artisan make:resource CartItemResource
```
- تنسيق البيانات المرجعة من API
- إخفاء الحقول الحساسة

#### 7.2 تعريف Routes في routes/api.php
```php
// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // Products
    Route::apiResource('products', ProductController::class);
    
    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);
    
    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
});
```

---

### المرحلة 8: Seeders & Testing Data (30 دقيقة)

#### 8.1 إنشاء Seeders
```bash
php artisan make:seeder UserSeeder
php artisan make:seeder ProductSeeder
```

#### 8.2 إنشاء Factories
```bash
php artisan make:factory ProductFactory
```

#### 8.3 تشغيل Seeders
```bash
php artisan db:seed
```

---

### المرحلة 9: Middleware & Error Handling (30 دقيقة)

#### 9.1 إعداد CORS
```bash
php artisan config:publish cors
```
- السماح للـ frontend بالوصول للـ API

#### 9.2 Global Exception Handling
- تعديل `app/Exceptions/Handler.php`
- إرجاع JSON responses للأخطاء

#### 9.3 Custom Middleware (إذا لزم)
- Rate limiting
- API versioning

---

### المرحلة 10: Documentation & Testing (1 ساعة)

#### 10.1 إنشاء README.md للـ Backend
- خطوات التثبيت
- تشغيل المشروع
- تفاصيل API Endpoints
- أمثلة على Requests/Responses

#### 10.2 إنشاء Database Diagram
- استخدام dbdiagram.io أو draw.io
- توضيح العلاقات بين الجداول

#### 10.3 Testing API Endpoints
- استخدام Postman أو Thunder Client
- اختبار كل endpoint
- التأكد من Validation

---

## 🎨 PART 2: Frontend Development (Vue.js)

### المرحلة 1: إعداد مشروع Vue.js (30 دقيقة)

#### 1.1 إنشاء مشروع Vue.js
```bash
npm create vue@latest frontend
cd frontend
npm install
```
- اختيار: Vue Router, Pinia (State Management)

#### 1.2 تثبيت المكتبات الإضافية
```bash
npm install axios
npm install vue-router@4
npm install pinia
```

#### 1.3 هيكل المشروع
```
src/
├── assets/           # الصور والأنماط
├── components/       # المكونات القابلة لإعادة الاستخدام
├── views/            # صفحات التطبيق
├── router/           # إعدادات التوجيه
├── stores/           # Pinia stores
├── services/         # API services
├── utils/            # دوال مساعدة
└── App.vue
```

---

### المرحلة 2: إعداد Axios & API Service (45 دقيقة)

#### 2.1 إنشاء Axios Instance
`src/services/api.js`
- تعريف base URL
- إضافة token للـ headers تلقائياً
- معالجة الأخطاء globally

#### 2.2 إنشاء API Services
```
src/services/
├── auth.service.js
├── product.service.js
├── cart.service.js
└── order.service.js
```

---

### المرحلة 3: State Management (Pinia) (45 دقيقة)

#### 3.1 إنشاء Stores
```bash
src/stores/
├── auth.store.js      # إدارة المستخدم والـ token
├── product.store.js   # إدارة المنتجات
├── cart.store.js      # إدارة السلة
└── order.store.js     # إدارة الطلبات
```

#### 3.2 Auth Store
- حفظ token في localStorage
- حفظ بيانات المستخدم
- دوال: login, register, logout, checkAuth

---

### المرحلة 4: Router & Navigation Guards (30 دقيقة)

#### 4.1 إعداد Vue Router
`src/router/index.js`
- تعريف جميع الـ routes
- Public routes (login, register)
- Protected routes (dashboard, products, orders)

#### 4.2 Navigation Guards
- التحقق من وجود token
- إعادة توجيه غير المسجلين إلى login
- إعادة توجيه المسجلين من login إلى dashboard

---

### المرحلة 5: Authentication Pages (1 ساعة)

#### 5.1 Login Page
`src/views/Login.vue`
- Form (email, password)
- Validation
- استدعاء API
- حفظ token
- إعادة توجيه للـ dashboard

#### 5.2 Register Page
`src/views/Register.vue`
- Form (name, email, password, confirm password)
- Validation
- استدعاء API
- حفظ token
- إعادة توجيه للـ dashboard

#### 5.3 Styling
- تصميم جميل ومتجاوب
- استخدام CSS/Tailwind CSS

---

### المرحلة 6: Dashboard Layout & Components (1 ساعة)

#### 6.1 Dashboard Layout
`src/components/Layout/DashboardLayout.vue`
- Sidebar مع القوائم
- Header مع بيانات المستخدم وزر logout
- Main content area

#### 6.2 Reusable Components
```
src/components/
├── common/
│   ├── Button.vue
│   ├── Input.vue
│   ├── Modal.vue
│   ├── Table.vue
│   └── Card.vue
```

---

### المرحلة 7: Dashboard Home (1 ساعة)

#### 7.1 Dashboard Home Page
`src/views/Dashboard.vue`
- عرض إحصائيات:
  - إجمالي المنتجات
  - إجمالي الطلبات
  - منتجات نفذت من المخزون
  - آخر الطلبات

#### 7.2 Statistics Cards
- تصميم Cards جميلة
- استخدام Icons
- Animations

---

### المرحلة 8: Products Management (2 ساعة)

#### 8.1 Products List Page
`src/views/Products/ProductsList.vue`
- جدول يعرض المنتجات
- Columns: ID, Name, Price, Stock, Status, Actions
- Pagination
- Search & Filter
- أزرار: Add, Edit, Delete

#### 8.2 Create/Edit Product Modal
`src/views/Products/ProductForm.vue`
- Form في Modal
- حقول: name, description, price, stock
- Validation
- حفظ/تحديث المنتج

#### 8.3 Delete Confirmation
- Modal للتأكيد قبل الحذف

---

### المرحلة 9: Orders Management (1.5 ساعة)

#### 9.1 Orders List Page
`src/views/Orders/OrdersList.vue`
- جدول يعرض الطلبات
- Columns: Order Number, Date, Total, Status, Actions
- Pagination
- زر عرض التفاصيل

#### 9.2 Order Details Modal
`src/views/Orders/OrderDetails.vue`
- عرض معلومات الطلب الكاملة
- Address, Phone
- جدول بالمنتجات المطلوبة
- إجمالي السعر

---

### المرحلة 10: Cart Management (Optional) (1 ساعة)

#### 10.1 Cart Page
`src/views/Cart/Cart.vue`
- عرض المنتجات في السلة
- تحديث الكمية
- حذف منتج
- حساب الإجمالي
- زر إنشاء طلب

#### 10.2 Checkout Form
- Form لإدخال Address & Phone
- إنشاء الطلب
- عرض رسالة نجاح

---

### المرحلة 11: Styling & UX (1 ساعة)

#### 11.1 تحسين التصميم
- استخدام Tailwind CSS أو Bootstrap
- تصميم متجاوب (Responsive)
- ألوان متناسقة
- Transitions & Animations

#### 11.2 Loading States
- Spinners عند تحميل البيانات
- Skeleton loaders

#### 11.3 Error Handling
- عرض رسائل الأخطاء بشكل واضح
- Toast notifications

---

### المرحلة 12: Documentation & Final Testing (1 ساعة)

#### 12.1 إنشاء README.md للـ Frontend
- خطوات التثبيت
- كيفية تشغيل المشروع
- شرح الـ components

#### 12.2 Testing
- اختبار جميع الصفحات
- اختبار التوجيه
- اختبار التفاعل مع API
- اختبار Responsive design

---

## 📝 Checklist للتسليم

### Backend ✅
- [ ] مشروع Laravel منشور على GitHub
- [ ] JWT Authentication يعمل بشكل صحيح
- [ ] جميع API Endpoints تعمل
- [ ] Validation على جميع الـ inputs
- [ ] Business logic للـ stock تعمل
- [ ] Database migrations جاهزة
- [ ] Seeders للبيانات التجريبية
- [ ] README.md شامل
- [ ] Database diagram واضح
- [ ] CORS معد بشكل صحيح

### Frontend ✅
- [ ] مشروع Vue.js منشور على GitHub
- [ ] صفحات Login & Register تعمل
- [ ] Dashboard home يعرض الإحصائيات
- [ ] Products management كامل (CRUD)
- [ ] Orders management يعرض الطلبات والتفاصيل
- [ ] التصميم جميل ومتجاوب
- [ ] Navigation يعمل بشكل صحيح
- [ ] Error handling مناسب
- [ ] README.md واضح

---

## 🚀 خطوات التنفيذ الموصى بها

### اليوم الأول (8 ساعات):
**الصباح (4 ساعات):**
1. إعداد Backend Laravel (30 دقيقة)
2. Database & Models (1 ساعة)
3. JWT Authentication (1 ساعة)
4. Products Module (1.5 ساعة)

**المساء (4 ساعات):**
5. Cart Module (1 ساعة)
6. Orders Module (2 ساعة)
7. Testing & Documentation (1 ساعة)

### اليوم الثاني (8 ساعات):
**الصباح (4 ساعات):**
1. إعداد Frontend Vue.js (1 ساعة)
2. Authentication Pages (1 ساعة)
3. Dashboard Layout (1 ساعة)
4. Dashboard Home (1 ساعة)

**المساء (4 ساعات):**
5. Products Management (2 ساعة)
6. Orders Management (1.5 ساعة)
7. Final Testing & Documentation (30 دقيقة)

---

## 🔑 نقاط مهمة للنجاح

### Backend:
1. **استخدام Transactions** عند إنشاء الطلبات
2. **Validation قوي** على جميع المدخلات
3. **Error Handling** مناسب
4. **API Resources** لتنسيق البيانات
5. **Observer Pattern** لتحديث status المنتجات

### Frontend:
1. **State Management** باستخدام Pinia
2. **Reusable Components** قابلة لإعادة الاستخدام
3. **Loading States** لتحسين UX
4. **Error Messages** واضحة
5. **Responsive Design** على جميع الأجهزة

---

## 📚 مصادر مفيدة

- [Laravel Documentation](https://laravel.com/docs)
- [JWT Auth Package](https://jwt-auth.readthedocs.io)
- [Vue.js 3 Documentation](https://vuejs.org)
- [Pinia Documentation](https://pinia.vuejs.org)
- [Axios Documentation](https://axios-http.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## ✨ ميزات إضافية (Optional)

إذا كان هناك وقت إضافي:
- [ ] تصدير الطلبات إلى PDF
- [ ] بحث متقدم في المنتجات
- [ ] Dashboard charts باستخدام Chart.js
- [ ] Real-time notifications
- [ ] Image upload للمنتجات
- [ ] Multiple roles (Admin, Customer)
- [ ] Order status tracking

---

## 🎯 الخلاصة

هذا المشروع يغطي:
- ✅ Full CRUD Operations
- ✅ JWT Authentication
- ✅ Complex Business Logic (Cart → Order)
- ✅ Database Relationships
- ✅ API Development
- ✅ Modern Frontend (Vue.js 3)
- ✅ State Management
- ✅ Professional Structure

**الهدف**: إظهار مهاراتك كـ Full-Stack Developer بطريقة احترافية! 💪

---

*تم إنشاء هذه الخطة بواسطة GitHub Copilot - بالتوفيق في مشروعك! 🚀*
