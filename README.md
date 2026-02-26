# Exclusive Resorts - Itinerary Proposal System

A luxury concierge itinerary management system built with Next.js 16, TypeScript, Tailwind CSS, and SQLite.

## 🚀 Quick Start

Install dependencies and run the application:

```bash
npm install
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

### 3. Seed Database
Populate with test data (James Whitfield's reservation):
```bash
npx ts-node prisma/seed.ts
```

### 4. Start Development Server
```bash
npm run dev
```

## 🎯 Key Features

### For Concierges
- **Dashboard** (`/concierge`) - View all proposals and reservations
- **Build Itineraries** - Add items from 6 predefined categories:
  - 🍽️ Dining (Private chef dinner, restaurant reservation)
  - 🏄 Activities (Surf lesson, snorkeling, ATV tour)
  - 💆 Wellness (Spa treatment, yoga session, massage)
  - ⛵ Excursions (Whale watching, sailing charter, cultural tour)
  - 🚗 Transport (Airport transfer, private car, helicopter)
  - 🌅 Experiences (Sunset cocktails, bonfire on the beach, tequila tasting)
- **Preview** - View itinerary as member will see it
- **Send Proposals** - Email simulation (logs to database and console)

### For Members
- **View Itinerary** (`/proposals/[id]`) - Premium, luxury-styled proposal view
- **Timeline View** - Day-by-day itinerary breakdown
- **Total Cost** - Clear pricing breakdown
- **Approve** - Review and approve proposal
- **Pay & Lock In** - Complete booking with confirmation

## 🗂️ Project Structure

```
app/
├── api/                      # API routes
│   ├── proposals/           # Proposal CRUD + send
│   └── reservations/        # Reservation endpoints
├── concierge/               # Concierge dashboard
│   ├── page.tsx            # Main dashboard
│   ├── proposals/[id]/     # Proposal editor
│   └── reservations/[id]/  # Reservation details
├── proposals/[id]/          # Member-facing itinerary view
│   ├── page.tsx            # Server component
│   └── MemberProposalClient.tsx  # Client component with actions
prisma/
├── schema.prisma            # Database schema
└── seed.ts                  # Seed data
```

## 🔌 API Endpoints

### Reservations
- `GET /api/reservations` - List all reservations
- `GET /api/reservations/:id` - Get reservation with member & proposals

### Proposals
- `GET /api/proposals` - List all proposals with items
- `POST /api/proposals` - Create new proposal
- `GET /api/proposals/:id` - Get proposal with full details
- `PATCH /api/proposals/:id` - Update proposal status
- `POST /api/proposals/:id/send` - Send proposal to member
- `POST /api/proposals/:id/items` - Add item to proposal

## 🗄️ Database Schema

Built with Prisma + SQLite:

- **Member** - Guest information
- **Reservation** - Trip details (destination, villa, dates)
- **Proposal** - Itinerary proposals with status tracking
- **ProposalItem** - Individual experiences/activities
- **SentEmail** - Email send log

Status flow: `DRAFT → SENT → APPROVED → PAID`

## 🎨 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with Prisma 7
- **SQLite Adapter**: better-sqlite3

## 🤔 Design Decisions

### Architecture
- **Server Components by default** - Used for data fetching, reduced client-side JS
- **Client Components for interactivity** - Buttons, forms, and state management
- **API Routes** - RESTful design with proper error handling
- **SQLite with Prisma** - Simple setup, perfect for demo, easily scalable to PostgreSQL

### UI/UX Choices
- **Two distinct experiences**:
  - Concierge: Efficient, functional, fast workflow
  - Member: Premium, luxurious, elegant presentation
- **Category-first design** - Predefined categories with icons for quick selection
- **Real-time updates** - Client-side state updates for responsive feel
- **Status badges** - Visual feedback on proposal state

### Data Modeling
- Normalized schema with proper relationships
- Status enum for type safety
- Separate SentEmail table for audit trail
- DateTime fields for scheduling and tracking

## 🚧 What I Would Improve Given More Time

### High Priority
1. **Optimistic UI updates** - Instant feedback before server confirmation
2. **Edit/delete items** - Currently can only add items
3. **Rich text editor** - Better formatting for descriptions
4. **Image uploads** - Support for activity photos
5. **Email templates** - Real email service integration (SendGrid/Resend)

### Medium Priority
6. **Multiple reservations** - Support for managing many members
7. **Filtering & search** - Find proposals by status, member, date
8. **Draft auto-save** - Prevent data loss while building proposals
9. **Price calculation** - Subtotals, taxes, service fees
10. **Calendar integration** - Visual date picker with availability

### Nice to Have
11. **Notifications** - Real-time updates when status changes
12. **Member notes** - Allow members to add requests/preferences
13. **PDF export** - Downloadable itinerary
14. **Analytics** - Track approval rates, popular activities
15. **Multi-language support** - i18n for international guests

## 🎯 What Was Most Interesting

**The dual UX challenge** - Building two completely different experiences for the same data was fascinating. The concierge needs efficiency and speed, while members need elegance and clarity. Balancing these opposing goals while maintaining code reusability was a great design exercise.

**Status state management** - Implementing the approval workflow (DRAFT → SENT → APPROVED → PAID) with proper validation and UI feedback taught me about state machines in a real-world context.

## 🏆 What Was Most Challenging

**Client vs Server Components in Next.js 16** - The App Router's approach to server/client boundaries required careful planning. Deciding where to fetch data (server) vs where to handle interactions (client) took iteration to get right.

**Date/time handling** - Managing timezones, formatting dates consistently between server/client, and grouping itinerary items by day required careful attention to edge cases.

## 🧪 Testing the Application

### Initial Setup
1. Visit `http://localhost:3000` or `/concierge` to see the dashboard
2. Click on the reservation for James Whitfield
3. Create a new proposal

### Building an Itinerary
1. Select a category (e.g., Dining 🍽️)
2. Fill in the activity details
3. Add multiple items across different dates
4. Preview the itinerary

### Sending & Approving
1. Click "Send to Member" in the concierge view
2. Open the member view (`/proposals/1`)
3. Click "Approve This Itinerary"
4. Click "Pay & Lock In Your Experience"
5. View the confirmation screen

### Check Console
Email send events are logged to the console when proposals are sent.

## 📝 Assumptions Made

1. **Single active reservation** - Simplified to one member with one reservation
2. **USD currency only** - No multi-currency support
3. **No authentication** - Public access to all routes (would add Auth.js/NextAuth in production)
4. **Simulated emails** - Database logging instead of actual email service
5. **No payment processing** - Status change only (would integrate Stripe in production)
6. **Fixed timezone** - No timezone conversion (would use user's timezone in production)

## 📦 Database File Location

SQLite database is created at: `prisma/dev.db`

To reset the database:
```bash
rm prisma/dev.db
npx prisma migrate dev
npx ts-node prisma/seed.ts
```

## 🤝 Submission

- **GitHub Repository**: [Your repo link]
- **Loom Walkthrough**: [Your video link]

---

Built with ❤️ for Exclusive Resorts

