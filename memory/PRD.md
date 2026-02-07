# Eri's Shoppe - Multi-Service Business Website

## Original Problem Statement
Create a website for "Eri's Shoppe", a multi-service business offering car services (with driver and self-drive), computer/PC services, and freelancing/consulting.

**IMPORTANT PIVOT**: Due to hosting cost concerns, the project pivoted from a full-stack React/Flask application to a **simple, multi-page static website** using only HTML, CSS (Tailwind via CDN), and vanilla JavaScript. This allows free deployment to GitHub Pages.

## Current Architecture (Static Website)

### Tech Stack
- **Frontend**: Static HTML files
- **Styling**: Tailwind CSS via CDN
- **Fonts**: Google Fonts (Inter)
- **JavaScript**: Vanilla JS for interactivity (search, mobile menu)
- **Backend**: None (static site)
- **Database**: None

### File Structure
```
/app
├── index.html          # Main landing page
├── car-services.html   # Car services gallery page
├── pc-services.html    # PC services gallery page
├── softwares.html      # Software catalog page (NEW)
└── README.md           # User instructions
```

## Contact Information
- **Business Name**: Eri's Shoppe
- **Phone/WhatsApp**: 0909 967 4035
- **Email**: rensengamboa@gmail.com
- **Facebook**: https://www.facebook.com/share/1CY9rHL23i/
- **Messenger**: https://m.me/xerlinx27
- **Service Area**: Luzonwide

## Completed Features (Feb 7, 2026)

### 1. Main Landing Page (index.html)
- Responsive navigation with mobile menu
- Hero section with CTA buttons
- Services section (Car, PC, Consulting)
- Car service pricing tables
- Contact section with multiple channels (WhatsApp, Call, SMS, Email)
- Professional footer with social links
- Right-click and F12 disabled

### 2. Car Services Page (car-services.html)
- Photo gallery with clickable images
- Search/filter functionality
- Location-based filtering
- Links to Google Photos albums
- Back navigation

### 3. PC Services Page (pc-services.html)
- Edit sections with clear placeholders
- Photo gallery with search
- Service categories (Custom Builds, Repairs, Software)
- "See Available Softwares" button → links to softwares.html
- Call-to-action section

### 4. Software Catalog Page (softwares.html) - NEW
- Software product catalog with images
- "Available On-site/Remote" status badges (3 types)
- "Get Quote" buttons linking to Messenger
- Search bar with real-time filtering
- "No results" message when search finds nothing
- Professional purple color scheme (matches site style)
- 6 placeholder software items with templates for adding more
- Back navigation to PC Services

## User Editability Features
All HTML files include:
- Clear `<!-- EDIT HERE -->` comments
- Purple dashed border `.edit-section` areas
- `.edit-label` tags showing what to change
- Copy-paste templates for adding items
- Instructions for badge types and Messenger links

## How to Deploy to GitHub Pages
1. Create a GitHub repository
2. Upload all HTML files to the root
3. Go to Settings → Pages
4. Select "main" branch, root folder
5. Save - site will be live at `username.github.io/repo-name`

## Backlog / Future Tasks

### P0 - Saved for Later (Full-Stack Features)
- Backend with FastAPI
- Database (MongoDB)
- Booking system with calendar
- Admin dashboard
- Email notifications
- Payment integration

### P1 - Static Site Enhancements
- Add more software items to catalog
- Custom domain setup guide
- SEO optimization
- Performance optimization
- Add testimonials section
- Add more service photos

## Third-Party Integrations
- **Tailwind CSS**: https://cdn.tailwindcss.com
- **Google Fonts**: Inter font family
- **External Links**: Facebook, Messenger, WhatsApp

## Testing Status
- All HTML files validated and working
- Search functionality tested
- Navigation links verified
- Mobile responsiveness confirmed

## Last Updated
February 7, 2026 - Added softwares.html page with software catalog
