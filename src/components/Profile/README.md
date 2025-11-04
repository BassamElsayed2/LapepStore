# Profile Component

A comprehensive user profile management component for the e-commerce application.

## Features

### Profile Information Tab
- View and edit full name
- Update email address
- Manage phone number
- Real-time validation
- Success/error notifications

### Change Password Tab
- Change password securely
- Current password verification
- New password confirmation
- Password strength validation (minimum 6 characters)
- Success/error notifications

## Usage

The profile page is accessible at: `/{locale}/profile`

For example:
- English: `/en/profile`
- Arabic: `/ar/profile`

## Authentication

The component uses the `useAuth` hook to:
- Get current user information
- Update profile data
- Change password
- Handle authentication state

## Multilingual Support

The component supports both English and Arabic languages using `next-intl`:
- All text labels are translated
- RTL support for Arabic
- Toast messages in both languages

## Styling

- Uses Tailwind CSS for styling
- Responsive design (mobile, tablet, desktop)
- Modern shadow and border effects
- Smooth transitions and hover effects
- Consistent with the app's design system

## Form Validation

### Profile Form
- Full name: Required
- Email: Required, valid email format
- Phone: Optional

### Password Form
- Current password: Required
- New password: Required, minimum 6 characters
- Confirm password: Must match new password

## State Management

- Local state for form data
- Loading states during API calls
- Form submission handling
- Error handling with user feedback

## Components Used

- `Breadcrumb`: For navigation breadcrumbs
- `useAuth`: Custom hook for authentication
- `useLocale`: For internationalization
- `toast`: For notifications

## API Integration

The component integrates with the following API endpoints:
- `updateProfile`: Updates user profile information
- `changePassword`: Changes user password

## Security

- Password fields use proper autocomplete attributes
- Passwords are never displayed or logged
- Token-based authentication
- Server-side validation

