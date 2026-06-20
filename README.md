# CaseVault

A full-stack web platform for showcasing case competition slides and presentations. Built as a technical task submission for E-Cell IIT (BHU) Varanasi's Tech Team Recruitment 2026.

**Live site:** [lustrous-rugelach-ea8bdf.netlify.app](https://lustrous-rugelach-ea8bdf.netlify.app)
**Repository:** [github.com/Grisham-Tech/casevault](https://github.com/Grisham-Tech/casevault)

---

## Overview

CaseVault lets users browse, search, and filter a gallery of case competition presentations without needing an account. Authenticated users can upload their own case studies, edit the details afterward, or delete their submissions. The project was built to satisfy a full-stack development task requiring secure authentication, a responsive UI, and a complete RESTful API for managing slide data.

---

## Features

- **Public gallery** — browse all slides with pagination, search, category filtering, and sorting (latest, oldest, title A-Z)
- **Authentication** — email/password registration and login using JWT-based sessions (NextAuth.js)
- **Protected upload flow** — only signed-in users can submit a new case study, including a preview thumbnail and the slide file itself (PDF/PPTX)
- **Edit and delete** — users can update or remove only the slides they personally uploaded
- **Cloud file storage** — preview images and slide documents are stored via Cloudinary
- **Responsive, dark-themed UI** — built with a custom design system, no UI component library

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React |
| Styling | Inline styles / custom CSS, Tailwind (base setup) |
| Backend | Next.js API Routes |
| Database | MongoDB Atlas (via Mongoose) |
| Authentication | NextAuth.js (Credentials provider, JWT strategy), bcryptjs for password hashing |
| File storage | Cloudinary |
| Deployment | Netlify |

---

## API Routes

| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/slides` | Public | Fetch all slides. Supports `page`, `limit`, `search`, `category`, `sort` query params |
| `GET` | `/api/slides/:id` | Public | Fetch a single slide by ID |
| `POST` | `/api/slides` | Protected | Upload a new slide (multipart form: title, description, tags, category, competition name, year, preview image, slide file) |
| `PUT` | `/api/slides/:id` | Protected | Update an existing slide's metadata |
| `DELETE` | `/api/slides/:id` | Protected | Delete a slide |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/[...nextauth]` | Public | Login session handling (NextAuth.js) |

Protected routes require an authenticated session. Slide editing and deletion are additionally restricted to the original uploader.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/   # NextAuth session handling
│   │   │   ├── login/           # Placeholder route (real logic in NextAuth)
│   │   │   └── register/        # User registration endpoint
│   │   └── slides/
│   │       ├── route.js         # GET (list) / POST (create)
│   │       └── [id]/route.js    # GET / PUT / DELETE single slide
│   ├── login/                   # Combined login + register page
│   ├── upload/                  # Protected upload form
│   ├── edit/[id]/                # Protected edit form
│   ├── page.js                   # Home page / gallery
│   └── layout.js
├── components/
│   ├── Navbar.jsx
│   ├── SlideCard.jsx
│   └── SessionProvider.jsx
├── lib/
│   ├── mongodb.js                # Database connection
│   └── cloudinary.js             # Cloudinary configuration
└── models/
    ├── User.js
    └── Slide.js
```

---

## Running Locally

### Prerequisites
- Node.js (LTS version)
- A MongoDB Atlas cluster
- A Cloudinary account

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/Grisham-Tech/casevault.git
   cd casevault
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=any_random_secret_string
   NEXTAUTH_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

---

## Notable Technical Decisions

- **NextAuth.js with the Credentials provider** was used instead of a hand-rolled JWT implementation, since it handles session management, CSRF protection, and cookie security out of the box.
- **Cloudinary's `resource_type: "auto"`** is used for slide file uploads rather than `"raw"`, since Cloudinary's free tier restricts direct delivery of raw PDF files by default for security reasons.
- **Public vs. protected routes** are enforced at the API level (checking `getServerSession()`), not just hidden in the UI, so the data layer stays secure regardless of how a request is made.
- **Pagination, search, and sorting** are handled server-side via MongoDB query parameters rather than client-side filtering, so the app scales reasonably as the number of slides grows.

---

## Known Limitations / Future Improvements

- No email verification on registration
- No password reset flow
- No image optimization/compression before upload
- Tags are plain comma-separated strings rather than a normalized, searchable taxonomy
- No automated tests yet

---

## Author

Built by Grisham Prateesh as a technical submission for E-Cell IIT (BHU) Varanasi's Tech Team Recruitment 2026.