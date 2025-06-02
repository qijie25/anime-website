# anime-website

## Overview

Anime-website is a full-stack web application where users can browse anime, upload profile pictures, rate anime, and engage with a community through messaging.

## Installation

**NOTE:** This project utilizes [NodeJS](https://nodejs.org/en). Please install it before attempting to run Anime-website.

1. **Clone this repository and `cd` into the directory**

```bash
git clone https://github.com/qijie25/anime-website.git
cd anime-website
```

2. **Run `npm install` to install all the `node_modules` dependencies.**
3. **Create and setup .env file**

```env
# .env.development
# PostgreSQL connection string for Prisma
# Format: postgresql://username:password@host:port/database
DATABASE_URL="postgresql://postgres:password@localhost:5432/dbname"

# Port to run the development server
PORT=3000

# JWT (JSON Web Token) secret key used for signing tokens
JWT_SECRET_KEY=your_secret_key

# JWT token expiration time (e.g., 1h = 1 hour, 7d = 7 days)
JWT_EXPIRES_IN=1h

# JWT signing algorithm (usually HS256 for HMAC SHA-256)
JWT_ALGORITHM=HS256

# Cloudinary credentials for uploading images (used in anime creation and profile picture uploads)
# To use this feature:
# 1. Create a free Cloudinary account: https://cloudinary.com/users/register_free
# 2. Go to your Cloudinary Dashboard
# 3. Copy your API Key and API Secret into the fields below
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

4. **Run database migration and seed commands**

```bash
npm run migration:dev
npm run seed:dev
```

5. **Start the web server**
   To start the server, run:

```bash
npm start
```

**Note on Image Uploading**
This project uses [Multer & Cloudinary](https://cloudinary.com/) to handle image uploads for anime covers and user profile pictures.
To enable this functionality, create a free Cloudinary account and set `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in your `.env.development` file.

## Note on package-lock.json

This project uses `package-lock.json` to ensure consistent dependency versions. Please do not delete or modify it unless you're intentionally updating packages.

## Features

- User registration & login with JWT authentication
- Admin dashboard for managing anime
- Anime rating system
- Image uploads using Cloudinary
- Real-time messaging using Socket.io
- Search and filter functionality

## Scripts

| Command                    | Description                                      |
| -------------------------- | ------------------------------------------------ |
| `npm start`                | Start development server with `.env.development` |
| `npm run migration:dev`    | Run Prisma migrations in development             |
| `npm run seed:dev`         | Seed development database                        |
| `npm run migration:reset`  | Reset and reapply migrations                     |
| `npm run migration:deploy` | Apply migrations in production                   |
| `npm run seed:deploy`      | Seed production database                         |

## Tech Stack

- Node.js
- Express
- PostgreSQL + Prisma
- Cloudinary (for image uploads)
- Socket.io
- Multer
- JSON Web Tokens (JWT)
