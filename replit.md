# GhotokBari.com.bd - Matrimonial Matching System

## Overview

This is a full-stack matrimonial matching system for GhotokBari.com.bd, a Bangladesh-based matrimonial platform. The application provides profile management, intelligent matching algorithms, and a comprehensive dashboard for managing matrimonial data.

## Recent Changes (July 14, 2025)

✓ Successfully migrated project from Replit Agent to standard Replit environment
✓ Configured external Neon PostgreSQL database connection via .env file
✓ Generated and pushed database schema using Drizzle ORM migrations
✓ Verified database connectivity and admin authentication working
✓ All tables (users, profiles, matches, custom_options) created in Neon database

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom brand theming
- **State Management**: TanStack Query for server state and React Context for authentication
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with session storage
- **File Handling**: Multer for profile pictures and document uploads
- **API Design**: RESTful endpoints with proper error handling

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Neon serverless with connection pooling

## Key Components

### Authentication System
- Simple username/password authentication
- Admin credentials: admin12345/admin12345
- Session-based authentication with secure cookies
- Protected routes with authentication middleware

### Profile Management
- Complete CRUD operations for matrimonial profiles
- File upload support for profile pictures and documents
- Structured profile data including age, gender, profession, height
- Search and filtering capabilities

### Matching Algorithm
- Intelligent compatibility scoring based on traditional matrimonial preferences
- Gender-based matching (opposite gender only)
- Age compatibility (3-6 year differences for male-female matches)
- Height compatibility (6-8 inch differences)
- Profession-based compatibility scoring

### Dashboard Interface
- Comprehensive statistics display
- Profile management with search and filters
- Matching system with lottery-style animations
- Settings panel for account management
- Responsive design with mobile sidebar

## Data Flow

1. **Authentication Flow**: User logs in → Session created → JWT-like session management → Protected access to dashboard
2. **Profile Creation**: Form submission → File upload processing → Database storage → Profile listing update
3. **Matching Process**: Input criteria → Algorithm processing → Compatible profile search → Results with compatibility scores
4. **Data Persistence**: All operations use Drizzle ORM → PostgreSQL database → Real-time updates via TanStack Query

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **bcrypt**: Password hashing for security
- **multer**: File upload handling
- **express-session**: Session management

### Development Dependencies
- **vite**: Development server and build tool
- **typescript**: Type safety and development experience
- **tsx**: TypeScript execution for Node.js

### UI Enhancement
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **date-fns**: Date manipulation utilities
- **lucide-react**: Icon library

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- tsx for backend TypeScript execution
- Concurrent development with proper error handling
- Replit integration with development banners

### Production Build
- Vite builds optimized React application to `dist/public`
- esbuild bundles Express server to `dist/index.js`
- Static file serving from Express for SPA deployment
- Environment variable configuration for database connections

### Database Management
- Drizzle migrations for schema changes
- Environment-based database URL configuration
- Connection pooling for production scalability

The architecture emphasizes type safety, modern development practices, and scalable deployment while maintaining simplicity for a matrimonial platform's specific needs.