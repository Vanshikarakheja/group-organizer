
# Group Organizer

A modern sports and event group management platform built with Next.js, Supabase, and Tailwind CSS.

## Live Demo

https://group-organizer.vercel.app/

---

## Features

### Authentication

* Google Sign-In using Supabase Authentication
* Automatic profile creation
* Secure user sessions

### Group Management

* Create and manage groups
* View group details
* Configure group settings
* Generate invite links

### Membership Management

* Join groups using invite links
* Member approval workflow
* View group members
* Promote and manage members

### Game Management

* Create games/events
* View upcoming games
* Manage game information

### RSVP System

* Confirm attendance for games
* Track participant responses

### Attendance Tracking

* Mark attendance for events
* Maintain participation records

### Payment Tracking

* Record participant payments
* Track payment status
* Store transaction references

### Announcements

* Post announcements for group members
* View announcement history
* Group-wide communication

### Dashboard

* View all joined groups
* Quick access to group management
* Modern responsive interface

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Supabase
* PostgreSQL

### Authentication

* Supabase Auth
* Google OAuth

### Deployment

* Vercel

---

## Database Structure

### Profiles

Stores user profile information.

### Groups

Stores group information and settings.

### Memberships

Manages group membership and roles.

### Games

Stores game and event details.

### RSVPs

Tracks player responses for games.

### Payments

Tracks payment records and status.

### Announcements

Stores group announcements.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Vanshikarakheja/group-organizer.git
```

Navigate to project folder:

```bash
cd group-organizer
```

Install dependencies:

```bash
npm install
```

Create environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Project Workflow

1. User logs in using Google.
2. User creates a group.
3. Invite link is generated.
4. Members request to join.
5. Organizer approves requests.
6. Games are created.
7. Members RSVP for games.
8. Attendance is tracked.
9. Payments are recorded.
10. Announcements are shared with members.

---

## Author

**Vanshika Rakheja**

Built as a full-stack sports and group management platform using Next.js and Supabase.

