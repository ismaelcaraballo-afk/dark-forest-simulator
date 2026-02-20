# Dark Forest Simulator

## Overview

The Dark Forest Simulator is an interactive educational web application that explores the "Dark Forest" theory from science fiction through scenario-based decision-making exercises. The application presents users with various educational contexts (business strategy, philosophy & ethics, science & SETI, policy & governance) and guides them through decision scenarios that demonstrate concepts of cooperation, caution, and aggression in uncertain environments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based architecture
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, modern UI design
- **Build Tool**: Vite for fast development and optimized production builds
- **State Management**: React hooks (useState) for local component state management
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management and caching

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Structure**: RESTful API design with `/api` prefix for all endpoints
- **Build Process**: esbuild for fast server-side bundling and compilation
- **Development**: tsx for TypeScript execution in development mode

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL for cloud-based data persistence
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Development Storage**: In-memory storage implementation for development/testing

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL store for persistent user sessions
- **User Schema**: Basic user model with username/password authentication
- **Security**: Session-based authentication with secure cookie handling

### Component Architecture
- **UI Components**: Comprehensive shadcn/ui component library including forms, dialogs, navigation, data display, and feedback components
- **Accessibility**: Radix UI primitives ensure ARIA compliance and keyboard navigation
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Theme Support**: CSS custom properties for consistent theming and dark mode support

### Development Architecture
- **TypeScript Configuration**: Strict type checking with modern ES module support
- **Path Aliases**: Organized import structure with `@/` for client code and `@shared/` for shared types
- **Code Organization**: Separation of concerns with dedicated directories for components, pages, hooks, and utilities
- **Development Tools**: Hot module replacement, runtime error overlays, and development banners for enhanced developer experience

## External Dependencies

### UI and Styling
- **shadcn/ui**: Complete component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Lucide React**: Consistent icon library for UI elements
- **class-variance-authority**: Type-safe variant management for component styling

### State Management and Data Fetching
- **TanStack Query**: Server state management with caching, synchronization, and background updates
- **React Hook Form**: Performant forms with minimal re-renders and built-in validation
- **Hookform Resolvers**: Integration between React Hook Form and validation libraries

### Database and Backend
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL database platform
- **Drizzle Zod**: Schema validation integration between Drizzle and Zod
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Development and Build Tools
- **Vite**: Fast build tool with hot module replacement and optimized bundling
- **esbuild**: Fast JavaScript/TypeScript bundler for production builds
- **tsx**: TypeScript execution environment for development
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins

### Utilities and Validation
- **Zod**: TypeScript-first schema validation library
- **clsx**: Utility for constructing className strings conditionally
- **date-fns**: Modern JavaScript date utility library
- **nanoid**: Secure, URL-friendly unique string ID generator

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting in development
- **@replit/vite-plugin-cartographer**: Development environment integration
- **@replit/vite-plugin-dev-banner**: Development mode indicators