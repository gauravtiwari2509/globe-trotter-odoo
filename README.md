# Globe-Trotter



*Team Name:* Team Vortex  

*Team Members:* Gaurav Tiwari, Vivek Tiwari, Abhimanyu Kumar



---



*Project Name:* Globe-Trotter

*Short Description:*  

Globe-Trotter is a personalized, intelligent travel planning platform that empowers users to design, organize, and share customized itineraries, explore destinations, and manage trip budgets with ease.

*Project Video:* [Globe-Trotter](https://drive.google.com/drive/folders/1UOJwdBEpum0LTfoxMgLjxTRRBHKwQFO8?usp=sharing)



## 🌟 Features



### ✨ Core Features

- *AI-Powered Trip Planning*: Get intelligent recommendations for destinations, activities, and itineraries using Google's Gemini AI

- *Multi-Step Trip Creation*: Intuitive 4-step process for creating personalized trips

- *Smart Itinerary Management*: Organize trips with stops, activities, and detailed scheduling

- *Budget Tracking*: Comprehensive expense management with categories and real-time tracking

- *User Authentication*: Secure signup/signin with OTP verification

- *Role-Based Access*: Different dashboards for Users, Moderators, and Admins



### 🎯 User Features

- *Personalized Dashboard*: View trips, manage profile, and track expenses

- *Trip Discovery*: Explore public itineraries and get inspired

- *Community Features*: Share trips, comment on activities, and connect with fellow travelers

- *Profile Management*: Customize profile with avatar, bio, and preferences

- *Favorites System*: Save and organize favorite trips



### 🛠 Admin Features

- *User Management*: Monitor and manage user accounts

- *Analytics Dashboard*: Track user trends, popular cities, and activities

- *Content Moderation*: Manage public content and user-generated data

- *System Overview*: Comprehensive admin dashboard with insights



### 🚀 Technical Features

- *Real-time Updates*: Live data synchronization across the platform

- *Responsive Design*: Mobile-first approach with Tailwind CSS

- *File Upload*: S3 integration for media management

- *Email Notifications*: OTP delivery and trip updates via email

- *Search & Filter*: Advanced search capabilities for trips and activities



## 🛠 Tech Stack



### Frontend

- *Next.js* - Used Next.Js for api and client

- *TypeScript* - used typescript for language which provide type safety

- *Tailwind CSS* - Utility-first CSS framework

- *Lucide React* - Icon library

- *React Hook Form* - Form management

- *Zod* - Schema validation

- *React Query (TanStack)* - To manage server side state: data fetching and caching

- *React Toastify* - Toast notifications

- *AWS S3* - Toast notifications

- *Prisma* - Database ORM

- *PostgreSQL* - Primary database

- *NextAuth.js* - Authentication framework

- *bcryptjs* - Password hashing

- *Nodemailer* - Email functionality




### AI & External Services

- *Google Gemini AI* - AI-powered recommendations



### Development Tools

- *ESLint* - Code linting

- *Turbopack* - Fast bundler for development

- *Faker.js* - Mock data generation for testing



## 📋 Prerequisites



Before running this project, make sure you have the following installed:



- *Node.js* (v18 or higher)

- *pnpm* (recommended) or npm

- *PostgreSQL* database

- *Git*



## 🚀 Installation



1. *Clone the repository*

   bash

   git clone <repository-url>

   cd globe-trotter-odoo

   



2. *Install dependencies*

   bash

   pnpm install

   



3. *Set up environment variables*

   Create a .env.local file in the root directory:

   env

   DATABASE_URL=

    NEXT_PUBLIC_BASE_URL=

    NEXTAUTH_SECRET=

    NEXTAUTH_URL=

    EMAIL_USER=

    EMAIL_PASS=

    AWS_ACCESS_KEY_ID=

    AWS_SECRET_ACCESS_KEY=

    AWS_BUCKET_NAME=

    NEXT_PUBLIC_GEMINI_API_KEY=

   



4. *Set up the database*

   bash

   # Generate Prisma client

   pnpm prisma generate

   

   # Run database migrations

   pnpm prisma migrate dev

   

   # (Optional) Seed the database with sample data

   pnpm run seed

   



5. *Start the development server*

   bash

   pnpm dev

   



6. *Open your browser*

   Navigate to [http://localhost:3000](http://localhost:3000)



## 🔧 Available Scripts



- pnpm dev - Start development server with Turbopack

- pnpm build - Build the application for production

- pnpm start - Start the production server

- pnpm lint - Run ESLint for code linting

- pnpm seed - Seed the database with sample data



## 🗄 Database Schema



The application uses PostgreSQL with the following main entities:



- *User*: Authentication and user management

- *Profile*: User profile information

- *Trip*: Trip itineraries and metadata

- *TripStop*: Individual stops within a trip

- *TripActivity*: Activities at each stop

- *Expense*: Budget tracking and expense management

- *City/Country*: Geographic data

- *ActivityTemplate*: Predefined activity templates

- *Media*: File and image management

- *Comment*: Social features and user interactions



## 🔐 Authentication & Authorization



The application implements a role-based access control system:



- *USER*: Regular users with trip planning capabilities

- *MODERATOR*: Content moderation and user management

- *ADMIN*: Full system administration and analytics



Authentication flow:

1. User registration with email verification

2. OTP-based email verification

3. Secure login with NextAuth.js

4. Role-based route protection



## 🤖 AI Integration



The platform leverages Google's Gemini AI for:



- *Destination Recommendations*: Smart suggestions based on preferences

- *Activity Recommendations*: Personalized activity suggestions

- *Itinerary Optimization*: AI-powered trip planning assistance

- *Cost Estimation*: Intelligent budget recommendations



## 🎨 UI/UX Features



- *Responsive Design*: Mobile-first approach

- *Modern UI*: Clean, intuitive interface with Tailwind CSS

- *Loading States*: Smooth loading animations and feedback

- *Error Handling*: User-friendly error messages

- *Toast Notifications*: Real-time feedback for user actions

- *Form Validation*: Client-side validation with Zod schemas



## 🔒 Security Features



- *Password Hashing*: bcryptjs for secure password storage

- *JWT Tokens*: Secure session management

- *Input Validation*: Zod schema validation

- *SQL Injection Protection*: Prisma ORM with parameterized queries



## 👥 Team



- *Gaurav Tiwari* - Full Stack Development

- *Vivek Tiwari* - Full Stack Development

- *Abhimanyu Kumar* - Full Stack Development



## 📞 Support



For support and questions:

- Create an issue in the GitHub repository

- Contact the development team

- Check the documentation for common issues


---



author: Gaurav TIwari
