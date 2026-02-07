# 🏪 Eri's Shoppe - GitHub Deployment Guide

## 📁 Files to Upload

Upload these **3 files** to your GitHub repository root:

1. **index.html** - Main homepage
2. **car-services.html** - Car services photo gallery
3. **pc-services.html** - PC services photo gallery

## 🚀 How to Deploy

### Step 1: Create GitHub Repository
1. Go to https://github.com
2. Click "New Repository"
3. Name it: `eris-shoppe` or any name you like
4. Make it **Public**
5. Click "Create Repository"

### Step 2: Upload Files
1. Click "Upload files" button
2. Drag and drop all 3 HTML files
3. Write commit message: "Initial upload"
4. Click "Commit changes"

### Step 3: Enable GitHub Pages
1. Go to **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Branch: **main**
4. Folder: **/ (root)**
5. Click **Save**
6. Wait 2-3 minutes

Your site will be live at: `https://YOUR_USERNAME.github.io/eris-shoppe/`

## ✏️ How to Edit

### Change Images
1. Find the section you want to edit (highlighted in blue/purple borders)
2. Look for: `<img src="..."`
3. Replace the URL with your image link
4. Save and commit

### Change Text
1. Find the text you want to change
2. Edit directly in GitHub
3. Commit changes
4. Site updates automatically!

### Add Google Photos Links
In **pc-services.html** and **car-services.html**:
- Find: `onclick="window.open('https://photos.app.goo.gl/YOUR_ALBUM_LINK', '_blank')"`
- Replace `YOUR_ALBUM_LINK` with your actual Google Photos shared album link

### Add More Gallery Photos
Copy this template and paste it in the gallery section:

```html
<div class="gallery-item relative group" 
     data-project="Your Project Name" 
     data-location="Your Location"
     onclick="window.open('https://photos.app.goo.gl/YOUR_LINK', '_blank')">
    <img src="YOUR_IMAGE_URL" 
         alt="Description" 
         class="rounded-lg w-full h-64 object-cover shadow-lg group-hover:shadow-2xl transition-all">
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
        <p class="text-white font-semibold">Your Project Name</p>
        <p class="text-gray-300 text-sm">📍 Your Location</p>
    </div>
</div>
```

## ✨ Features

✅ **Working Contact Buttons:**
- WhatsApp: Opens chat with 0909 967 4035
- Call: Opens phone dialer
- SMS: Opens messaging app
- Email: Opens Gmail to rensengamboa@gmail.com
- Facebook: Links to your profile

✅ **Gallery Pages:**
- Search functionality (by project or location)
- Click photos to open Google Photos albums
- Highlighted edit sections for easy updates
- Back button to homepage

✅ **Security:**
- Right-click disabled
- F12 / Dev Tools disabled
- Source code protection

✅ **Custom Icons:**
- 🏪 Main page (Shoppe icon)
- 🚗 Car services page
- 💻 PC services page

## 📞 Contact Info

- Phone/WhatsApp: 0909 967 4035
- Email: rensengamboa@gmail.com
- Facebook: https://www.facebook.com/share/1CY9rHL23i/
- Coverage: Luzonwide

## 🎉 You're Ready!

Just upload the 3 HTML files to GitHub and enable Pages. That's it! 

Your professional business website will be live and FREE to host! 🚀
