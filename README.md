# KPM SALES MANAGEMENT PROJECT

## PROJECT DESCRIPTION

This project is a sales management system that allows users to manage their sales activities. It provides features such as creating and managing sales orders, tracking sales, and generating invoices. The system also includes a dashboard that displays real-time sales data and analytics.


## PROJECT REQUIREMENTS

Python 3.x
Flask
Flask-SQLAlchemy
Restful API
React
Tailwind CSS
zustand

## PROJECT INSTALLATION
1.Frontend Installation
(i)
- Github Repo clone
```
git clone https://github.com/levos-snr/kpm-sales-management-frontend.git
```
- Install dependencies
```
bun install
```
- Run the project
```
bun run dev

2.Backend Installation
(i)
- Github Repo clone
```
git clone https://github.com/levos-snr/kpm-sales-management-backend.git
```
- Install dependencies
```
pipenv install
```
- Virtual Environment Activation
```
pipenv shell
```
- Run the project
```
python app.py
```

Fronend Requirements
- React
- Tailwind CSS
- zustand
- Axios
- React-router-dom
- React-icons
- React-toastify
- React-datepicker
- Shadcn
- React-chartjs-2


Backend Requirements
```
[packages]
flask-sqlalchemy = "*"
flask-migrate = "*"
sqlalchemy-serializer = "*"
python-dotenv = "*"
flask-restful = "*"
psycopg2-binary = "*"
gunicorn = "*"
flask = "*"
flask-bcrypt = "*"
flask-jwt-extended = "*"
sqlalchemy = "*"
supabase = "*"
faker = "*"
faker-commerce = "*"
flask-cors = "*"
geoalchemy2 = "*"
shapely = "*"
requests = "*"
flask-limiter = "*"
resend = "*"
```

## PROJECT SETUP
1.Frontend Setup
(i)
- Create a new file named .env in the root directory of the project and add the following lines:

- Server URL for local and production environments
```
VITE_API_BASE_URL_DEV=http://127.0.0.1:5000
VITE_API_BASE_URL_PROD=https://kpm-sales-management-backend.vercel.app

```

2.Backend Setup
(i)
- Create a new file named .env in the root directory of the project and add the following lines:
```env
DATABASE_URL=postgresql url
JWT_SECRET_KEY=your_secret_key
SECRET_KEY=my_secret_key
my_url=supabase_url
my_key=supabase_key
RESEND_API_KEY=your_resend_api_key
```

## ENDPOINTS
```
# Optional Index Resource
class Index(Resource):
    def get(self):
        return {"message": "Welcome to The KPM Sales Management System"}
        
# Routes-endpoints
api.add_resource(Index, '/')
api.add_resource(AdminManagerRegistrationResource, '/auth/register/admin-manager')
api.add_resource(LoginResource, '/auth/login')
api.add_resource(SalesRepRegistrationResource, '/auth/register/sales-rep')
api.add_resource(UserListResource, '/users', '/users/<int:user_id>')
api.add_resource(LogoutResource, '/auth/logout')
api.add_resource(RefreshTokenResource, '/auth/refresh')

# Products
api.add_resource(ProductResource, '/products', '/products/<int:product_id>')
api.add_resource(TaskResource, '/tasks', '/tasks/<int:task_id>')
api.add_resource(CheckInOutResource, '/attendance/check-in-out', '/attendance/records')
api.add_resource(CustomerResource, '/customers', '/customers/<int:customer_id>')
api.add_resource(OrderResource, '/orders', '/orders/<int:order_id>')
api.add_resource(GeocodeResource, '/geocode')
api.add_resource(SalesReportResource, '/sales-report')

api.add_resource(DashboardOverview, '/dashboard/overview')
api.add_resource(SalesOverview, '/dashboard/sales_overview')
api.add_resource(RecentActivities, '/dashboard/recent_activities')
api.add_resource(ProductPerformance, '/dashboard/product_performance')
api.add_resource(TerritoryList, '/territories')
api.add_resource(SalesRepList, '/sales_reps')
api.add_resource(SalesRepPerformance, '/sales_rep_performance/<int:user_id>')
api.add_resource(SalesRepPerformanceOne, '/onesales_rep_performance/<int:user_id>')
api.add_resource(SalesRepResource, '/sales-rep', '/sales-rep/<int:action>')

# Add the new HybridSearchResource
api.add_resource(HybridSearchResource, '/hybrid_search')

```
