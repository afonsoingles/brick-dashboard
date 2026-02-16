# Brick Dashboard

A modern, responsive React dashboard with a professional authentication system built with Vite and TypeScript.

## Features

- 🔐 Multi-step authentication with password and OTP support
- 📱 Fully responsive design (mobile and desktop)
- ⚡ Built with Vite for fast development and production builds
- 🎨 Material-UI components with Lucide icons
- 🍪 Session persistence with cookies
- 🎯 Clean, maintainable code structure

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (already provided with defaults):
   ```
   VITE_API_URL=http://localhost:3001/api
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/           # Reusable React components
│   ├── Auth/            # Authentication flow components
│   │   ├── EmailStep.tsx
│   │   ├── AuthMethodStep.tsx
│   │   ├── PasswordStep.tsx
│   │   └── OTPStep.tsx
│   ├── ThemeProvider.tsx # Material-UI theme configuration
│   └── Toast.tsx         # Toast notification system
├── pages/               # Page components
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   └── UserViewPage.tsx
├── utils/              # Utility functions and hooks
│   ├── api/
│   │   └── authApi.ts   # Authentication API (mock)
│   └── auth/
│       └── authContext.tsx # Auth context and hooks
├── styles/             # Global styles
│   └── index.css
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## Authentication Flow

### Login Process

1. **Email Step**: User enters email address
2. **Method Selection**: System checks available auth methods and displays options
3. **Authentication**: 
   - Password: User enters password
   - OTP: One-time code sent to email

### Mock Credentials

**For testing purposes, use:**

- **Email**: `test@example.com`, `otp-only@example.com`, or `password-only@example.com`
- **Password**: `password`
- **OTP**: `123456`

### Error Handling

- Account not found → "Please send an email to the printer and wait ~2 minutes"
- Invalid credentials → Specific error messages per field

## Environment Variables

### Required

- `VITE_API_URL` - Base URL for authentication API (default: `http://localhost:3001/api`)

When the real API is ready, update this variable to point to your backend endpoint.

## API Integration

The authentication API is currently mocked in `src/utils/api/authApi.ts`. To integrate with a real API:

1. Update `VITE_API_URL` in `.env`
2. Replace mock implementations in `authApi.ts` with actual axios calls
3. Ensure your API follows the expected request/response interfaces

### Expected API Endpoints

```
POST /auth/check-methods
Request: { email: string }
Response: { email: string, methods: Array<{method: 'password' | 'otp'}> }

POST /auth/request-otp
Request: { email: string }
Response: { message: string }

POST /auth/verify-password
Request: { email: string, password: string }
Response: { token: string, email: string }

POST /auth/verify-otp
Request: { email: string, code: string }
Response: { token: string, email: string }
```

## Technologies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Material-UI (MUI)** - Component library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **js-cookie** - Cookie management

## Responsive Design

The application is designed to work seamlessly on:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktop screens (1024px and up)

All components use MUI's responsive grid and breakpoint system.

## Development Notes

- Keep auth logic in `authContext.tsx` for global state
- Create reusable components in `components/` directory
- Use Lucide icons for consistency
- Follow Material-UI theming guidelines
- Test both mobile and desktop views during development

## License

MIT
