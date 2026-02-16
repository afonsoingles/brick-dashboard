# Brick Dashboard - Agent Instructions

This document serves as the ground truth for coding standards, commands, and architecture decisions for the Brick Dashboard project.

## Project Overview

**Brick Dashboard** is a React/TypeScript printing management system with authentication, user management, and admin controls.

- **Framework**: React 18 + TypeScript
- **UI Library**: Material-UI (MUI)
- **Styling**: MUI System (sx prop)
- **Icons**: Lucide React
- **Router**: React Router v6
- **Build Tool**: Vite

## Color Scheme

- **Dark Background**: `#0f172a`
- **Card Background**: `#1e293b`
- **Border Color**: `#334155`
- **Hover Border**: `#475569`
- **Text Primary**: `#f1f5f9`
- **Text Secondary**: `#94a3b8`
- **Accent (Primary)**: `#6366f1` (Indigo)
- **Accent (Success)**: `#10b981` (Green)
- **Accent (Warning)**: `#f59e0b` (Amber - Admin sections)
- **Accent (Danger)**: `#ef4444` (Red)
- **Dark Text**: `#1f2937`

## File Structure

```
src/
├── pages/
│   ├── LoginPage.tsx           # Login flow
│   ├── Dashboard.tsx            # Main dashboard router
│   ├── DashboardHome.tsx        # Home with admin panel
│   ├── PrinterJobs.tsx          # Print jobs listing
│   ├── AdminUsers.tsx           # User management
│   ├── AdminJobs.tsx            # Job approval workflow
│   ├── AdminCredits.tsx         # Credit management
│   └── UserSettings.tsx         # Personal user settings
├── components/
│   ├── DashboardNav.tsx         # Top navigation bar
│   ├── Toast.tsx                # Toast notifications
│   └── ThemeProvider.tsx        # Theme setup
├── utils/
│   ├── api/
│   │   └── authApi.ts           # API client & endpoints
│   ├── auth/
│   │   └── authContext.ts       # Auth state management
└── App.tsx                      # Route definitions
```

## Navbar Specifications

- **Height**: 64px minimum
- **Logo**: 40x40px with "Brick Dashboard" text (hidden on mobile)
- **Button Styling**:
  - Responsive: `fontSize: { xs: '11px', sm: '13px' }`
  - Responsive padding: `padding: { xs: '4px 8px', sm: '6px 12px' }`
  - Icon size: 16px
  - Icon margin right: 6px

### Admin Button

- **Container**: `border: '2px dashed #f59e0b'` with `borderRadius: '8px'`
- **Padding**: `{ xs: '2px 4px', sm: '4px 8px' }`
- **Display**: Hidden text on mobile (icon only)

### Logout Button

- **Position**: Far right (separated with flex layout)
- **Color**: `#94a3b8`, hover → `#ef4444`
- **Behavior**: Always show icon, no text

## Authentication API Endpoints

### Already Implemented

- `POST /v1/auth/methods` - Check available auth methods
- `POST /v1/auth/otp/send` - Request OTP
- `POST /v1/auth/otp/verify` - Verify OTP with `attempt_id`
- `POST /v1/auth/password` - Password authentication
- `POST /v1/auth/logout` - Revoke session
- `GET /v1/auth/me` - Get current user data

### Expected Response Format

```typescript
{
  success: boolean
  message?: string
  token?: string
  attempt_id?: string
  user?: UserData
}
```

## Admin Components

### Admin Panel Section

- **Border**: `border: '2px dashed #f59e0b'`
- **Background**: `backgroundColor: 'rgba(245, 158, 11, 0.05)'`
- **Title Color**: `#f59e0b`
- **Typography**: Responsive variants `{ xs: 'subtitle1', sm: 'h6' }`

### Admin-Only Features

✓ Manage Users (CRUD)
✓ Approve/Reject Print Jobs
✓ Manage User Credits (infinite toggle)
✓ Global Settings (auto-reject/mark pending)
✓ Printer Settings (CUPS data)

## Button & Form Styling Standards

### Primary Button
```typescript
variant="contained"
sx={{
  backgroundColor: '#6366f1',
  '&:hover': { backgroundColor: '#818cf8' },
  '&:disabled': { backgroundColor: '#475569' },
}}
```

### Secondary Button
```typescript
variant="outlined"
sx={{
  borderColor: '#334155',
  color: '#94a3b8',
}}
```

### Danger Button
```typescript
variant="contained"
sx={{
  backgroundColor: '#ef4444',
  '&:hover': { backgroundColor: '#dc2626' },
}}
```

### TextField Styling
```typescript
sx={{
  '& .MuiOutlinedInput-root': {
    color: '#f1f5f9',
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
}}
```

## Responsive Breakpoints

- **Mobile (xs)**: < 600px
- **Tablet (sm)**: 600px - 900px
- **Desktop (md)**: 900px+

Use MUI's responsive values: `{ xs: value, sm: value, md: value }`

## Mobile Compatibility

- All pages must be responsive with `{ xs, sm, md }` variants
- Navbar buttons show icons only on mobile, full text on desktop
- Container padding: `{ xs: '12px', sm: '16px' }`
- Grid layouts adapt: `gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }`
- Typography sizes scale: `variant: { xs: 'body2', sm: 'h6' }`

## Authentication Flow

1. User enters email → `checkAuthMethods`
2. Shows available methods (password/OTP)
3. If OTP: `requestOTP` → receives `attempt_id` → displays OTP input
4. `verifyOTP` with `attempt_id` and code
5. On success: store token in context, navigate to `/dashboard`
6. Dashboard: `getMe` called once (prevent double calls with `useRef`)
7. Logout: `logout` API call → clear auth context → redirect to login

## State Management

- **Auth Context**: Token, user, loading, login/logout methods
- **Page State**: Local useState for forms, modals, filters
- **Prevent Double API Calls**: Use `useRef` flag in useEffect

## Design Patterns

### Dialog/Modal Pattern
```typescript
const [openDialog, setOpenDialog] = useState(false)
<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>Title</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>Buttons</DialogActions>
</Dialog>
```

### Table Pattern
```typescript
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow sx={{ backgroundColor: '#0f172a' }}>
        <TableCell sx={{ color: '#94a3b8' }}>Header</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((item) => (
        <TableRow sx={{ '&:hover': { backgroundColor: '#263449' } }}>
          <TableCell sx={{ color: '#f1f5f9' }}>{item}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
```

## Git Workflow

- Commit messages: Descriptive and action-oriented
- Branch naming: Not specified (to be updated)
- No major breaking changes without discussion

## PrinterJobs Page Features

### User View
- Table showing user's print jobs with:
  - File name (with file icon)
  - Number of pages
  - Status (approved, pending, rejected)
  - Date/time sent
  - Download button (only if approved and within 24 hours)
  - Info icon (only if rejected) - shows rejection reason in dialog
- Credits remaining display at top
- Page accessible at `/dashboard/printer/jobs`
- Individual job details at `/dashboard/printer/jobs/:jobId`

### Admin Controls (Orange Dashed Section)
- Approve Job button
- Reject Job button
- Retain File Beyond 24h button
- Only visible to admin/superadmin users

## To-Do / Future Implementation

- [ ] Superadmin role enforcement (edit admin flags)
- [ ] Search/filter enhancements in tables
- [ ] Real API integration
- [ ] User access control for PrinterJobs (only user themselves + admins)
- [ ] Printer CUPS data endpoint integration
- [ ] User invitation system
- [ ] Audit logs for admin actions
- [ ] Advanced credit management rules
- [ ] File download implementation
- [ ] Job detail view with full metadata

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code (if configured)

## Last Updated

2026-02-15

---

**Note**: This document should be updated whenever:
- New pages are added
- API endpoints are modified
- Design changes are made
- New architectural patterns are established
