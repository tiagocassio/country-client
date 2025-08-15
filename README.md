# World Countries API Client

A Next.js client application that consumes a World Countries API.

## Prerequisites

Before running this client application, you need to have the Rails API running. The API should be accessible at `http://localhost:3000`.

### Rails API Setup

1. Navigate to the Rails API directory:
   ```bash
   cd ../country_api
   ```

2. Install dependencies and start the server:
   ```bash
   bundle install
   docker compose up -d
   ```

   The API will be available at `http://localhost:3000`

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3001`

## Authentication

The client application uses JWT-based authentication with the Rails API. Users must create an account and sign in to access the countries data.

### User Registration
- Navigate to `/register` to create a new account
- Provide email and password (minimum 6 characters)
- Email verification is required (check your email)

### User Login
- Navigate to `/login` to sign in
- Use your registered email and password
- Upon successful authentication, you'll be redirected to the countries page

### Authentication Flow
1. User visits the home page
2. If not authenticated, they are redirected to the login page
3. After authentication, they can access the countries explorer
4. Authentication token is stored in localStorage
5. API requests include the authentication token in headers

## API Endpoints

The client application consumes the following Rails API endpoints:

- `POST /sign_up` - User registration
- `POST /sign_in` - User authentication
- `GET /v1/countries` - List all countries (requires authentication)
- `GET /v1/countries/:id` - Get detailed information about a specific country (requires authentication)

## Testing the Application

### 1. Start the Rails API
```bash
cd ../country_api
rails server
```

### 2. Start the Next.js Client
```bash
npm run dev
```

### 3. Test Authentication
1. Open `http://localhost:3001` in your browser
2. Click "Create Account" to register a new user
3. Check your email for verification (if required)
4. Sign in with your credentials
5. Explore the countries!

### 4. Test API Endpoints
You can test the API endpoints directly using curl:

```bash
# Register a new user
curl -X POST http://localhost:3000/sign_up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","password_confirmation":"password123"}'

# Sign in
curl -X POST http://localhost:3000/sign_in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get countries (use the token from the sign_in response)
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3000/v1/countries
```
