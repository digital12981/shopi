# Replit.md - Shopee Delivery Partners

## Overview

This project is a comprehensive web platform for recruiting delivery partners for Shopee in the Brazilian market. It features a modern React frontend with TypeScript, an Express.js backend, and integrates with external payment services (For4Payments) for processing kit purchases. The application includes a multi-step registration process, payment integration, IP tracking, vehicle verification, and email notifications.

## System Architecture

The application follows a full-stack architecture with clear separation between frontend and backend concerns:

**Frontend**: React with TypeScript, built using Vite for fast development and optimized production builds
**Backend**: Express.js server with TypeScript, providing RESTful API endpoints
**Database**: PostgreSQL with Drizzle ORM for type-safe database operations
**Styling**: Tailwind CSS with custom Shopee branding
**UI Components**: Radix UI components with shadcn/ui design system

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks and context for local state
- **Forms**: React Hook Form with Zod schema validation
- **HTTP Client**: Axios for API communication
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database ORM**: Drizzle with PostgreSQL dialect
- **Authentication**: Custom IP tracking and ban system
- **External Integrations**: For4Payments API for PIX payments
- **Email Service**: SendGrid for transactional emails
- **CORS**: Configured for cross-origin requests

### Database Schema
The application uses several key entities:
- **States**: Brazilian states with vacancy counts
- **Candidates**: Registration data for delivery partners
- **Banned IPs**: IP blocking system for security
- **Payment Records**: Transaction tracking and status

### Payment Integration
- **Primary Provider**: For4Payments for PIX payment processing
- **Payment Flow**: Multi-step process with real-time status updates
- **Security**: Transaction tracking with IP-based fraud prevention
- **Validation**: CPF, email, and phone number validation

## Data Flow

1. **Registration Process**:
   - User selects state/region
   - Fills personal information form
   - Vehicle verification (optional integration with external API)
   - Payment processing for safety kit
   - Email confirmation and badge generation

2. **Payment Process**:
   - Generate PIX payment via For4Payments API
   - Real-time payment status monitoring
   - Automatic approval and email notifications
   - Badge generation upon successful payment

3. **Security Flow**:
   - IP tracking for all transactions
   - Automatic banning of suspicious IPs
   - Rate limiting and fraud detection

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React Router (Wouter), React Hook Form
- **UI Framework**: Radix UI primitives, Tailwind CSS
- **Backend**: Express.js, Cors, Compression
- **Database**: PostgreSQL, Drizzle ORM
- **Validation**: Zod for schema validation
- **HTTP Client**: Axios for API requests

### External Services
- **For4Payments**: PIX payment processing
- **SendGrid**: Email delivery service
- **Vehicle API**: External vehicle verification service
- **Facebook Pixel**: Conversion tracking for marketing

### Development Tools
- **TypeScript**: Type safety across the stack
- **Vite**: Build tool and development server
- **ESBuild**: Fast JavaScript bundling
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

The application supports multiple deployment strategies:

### 1. Unified Deployment (Recommended)
- **Platform**: Heroku with custom Vite server
- **Process**: Single dyno running Vite in development mode
- **Configuration**: `heroku-vite-server-standalone.js` for production-ready development server
- **Benefits**: Matches Replit preview exactly, simplified deployment

### 2. Separate Frontend/Backend
- **Frontend**: Netlify or Vercel for static hosting
- **Backend**: Heroku for API services
- **Configuration**: Separate build processes and CORS configuration
- **Benefits**: Optimized for static content delivery

### 3. Serverless Functions
- **Platform**: Vercel with serverless functions
- **Configuration**: Individual API endpoints as serverless functions
- **Benefits**: Automatic scaling and pay-per-use pricing

### Build Process
- Frontend builds to `dist/public` directory
- Backend builds with ESBuild to `dist` directory
- Environment variables managed through platform-specific configuration
- Database migrations handled via Drizzle Kit

## Changelog
- July 08, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.