# 📹 Screen Recording & Testing Guide for Biloki Admin Assessment

## ⏱️ Pre-Recording Checklist

- [ ] Close all unnecessary applications
- [ ] Set screen resolution to 1920x1080 (or document current resolution)
- [ ] Test microphone if using audio recording
- [ ] Have OBS Studio or ffmpeg installed
- [ ] Ensure sufficient disk space for video (~2-5GB for 3 hours)
- [ ] Start the Laravel server: `php artisan serve`
- [ ] Open browser to http://localhost:8000

## 🎬 Option 1: OBS Studio (Recommended)

### Setup
1. Open OBS Studio
2. **Add Display Capture Source**:
   - Click `+` under Sources
   - Select "Display Capture"
   - Choose your main display
   - Set resolution match

3. **Add Audio Source** (Optional):
   - Click `+` under Sources
   - Select "Audio Input Capture"
   - Choose system audio

4. **Configure Recording Settings**:
   - Settings → Output → Recording
   - Set format: MP4
   - Set encoder: H.264
   - Set bitrate: 5000-8000 kbps

### Recording Workflow
```
1. Click "Start Recording" (show timestamp)
2. Navigate to http://localhost:8000
3. Follow testing script below
4. When done, click "Stop Recording"
5. Find video in: ~/Videos/ (default)
```

## 🎬 Option 2: Linux Command Line with ffmpeg

```bash
# Full screen recording
ffmpeg -f x11grab -s 1920x1080 -i :0 -f pulse -i default \
  -c:v libx264 -crf 23 -c:a aac ~/biloki_test.mp4

# Stop with Ctrl+C when done
```

## ✅ Testing Script (Show During Recording)

### 1. **Authentication & Login** (2 min)
```
URL: http://localhost:8000
- Show login page
- Login: admin@biloki.local / password
- Show Dashboard with admin links
- Explain the 3 main modules
```

### 2. **Products Module** (12 min)
```
1. Navigate to Products (click Products card)
2. Show List View:
   - Show table with 15 products
   - Show pagination controls
   - Show status badges (green=active, red=inactive)
   
3. Search Functionality:
   - Search for "ipsum" (shows filtered results)
   - Clear search (shows all again)
   - Search for "SKU-" (shows SKU search working)
   
4. Create New Product:
   - Click "+ New Product" button
   - Fill form:
     - Name: "Test Product XYZ"
     - SKU: "TESTXYZ-001"
     - Price: 49.99
     - Description: "Test product for demo"
     - Status: Active
   - Click "Create"
   - Show success notification
   - Verify new product appears in list
   
5. Edit Product:
   - Click "Edit" on any product
   - Change price to 59.99
   - Click "Update"
   - Show updated price in table
   
6. Delete Product:
   - Click "Delete" on the test product
   - Confirm in alert
   - Product removed from list
```

### 3. **Clients Module** (12 min)
```
1. Navigate to Clients (from Products list)
2. Show List View:
   - Show 20 clients in table
   - Show columns: Name, Email, Type, City, Status
   - Show filter options
   
3. Search Functionality:
   - Search for "company" (shows company clients)
   - Search by email part
   - Clear search
   
4. Create New Client:
   - Click "+ New Client"
   - Fill form:
     - Name: "Test Company LLC"
     - Email: "test-company@example.com"
     - Type: Company
     - Phone: "+1234567890"
     - City: "San Francisco"
     - Status: Active
   - Click "Create"
   - Show success and new entry in list
   
5. Edit Client:
   - Click "Edit" on new client
   - Update city to "Los Angeles"
   - Click "Update"
   
6. Filter by Type:
   - Filter by "company" type (if implemented)
   - Show only companies
```

### 4. **Stock Management** (12 min)
```
1. Navigate to Stock (from Clients)
2. Show List View:
   - Show all stock entries
   - Show columns: Product, Qty, Reserved, Available, Location
   - Highlight products with low stock (red background)
   
3. Low Stock Filter:
   - Check "Low Stock Only"
   - Show only items below reorder level
   - Uncheck to show all
   
4. Adjust Stock:
   - Click "Adjust" on any stock item
   - Enter adjustment: +100 (showing add)
      OR: -50 (showing remove)
   - Enter reason: "Received shipment" / "Sold"
   - Click "Confirm"
   - Show updated quantities
   
5. Edit Stock Parameters:
   - Click "Edit" on stock item
   - Update reorder level: 20
   - Update warehouse location: "C1"
   - Click "Update"
   - Show changes reflected
   
6. Create New Stock:
   - Click "+ New Stock"
   - Select product
   - Set initial quantity: 100
   - Set reorder level: 15
   - Click "Create"
```

### 5. **Dark Mode & Responsiveness** (5 min)
```
1. Test Dark Mode:
   - If available, toggle dark mode
   - Show interface looks good
   
2. Responsive Design:
   - Resize browser window to mobile width (375px)
   - Show tables stack
   - Buttons remain clickable
   - Forms are readable
```

### 6. **Error Handling** (3 min)
```
1. Try creating product with duplicate SKU
   - Show validation error message
   
2. Try creating client with invalid email
   - Show validation error
   
3. Try deleting item, then click cancel
   - Show nothing happens
```

## 📊 Expected Results

All of the following should work during recording:

- [x] Login with admin credentials
- [x] View all 3 modules (Products, Clients, Stock)
- [x] Search functionality on all pages
- [x] Create operations with validation
- [x] Edit operations and version updates
- [x] Delete operations with confirmation
- [x] Status filtering and badges
- [x] Pagination display
- [x] Error messages for validation
- [x] Success notifications
- [x] Responsive design
- [x] Dark/Light mode toggle
- [x] Pagination navigation

## 💾 File Organization

```
~/
├── Biloki/                          # Your project folder
│   ├── database/database.sqlite    # SQLite with 52 records
│   ├── git log (3 commits)         # See git history
│   └── npm run build               # Compiled assets
│
└── biloki_test.mp4                 # Screen recording (1-3 hours)
```

## 📤 Submission Package

Package for WeTransfer:

```
biloki_submission.zip
├── Biloki/                         # Entire project folder
│   ├── .git/                       # Full git history
│   ├── app/                        # PHP code
│   ├── resources/                  # React code
│   ├── database/                   # SQLite database + migrations
│   ├── README.md
│   ├── DEVELOPMENT.md
│   └── package.json
│
└── biloki_assessment.mp4           # Screen recording
```

## 🚀 Quick Server Start

```bash
cd ~/Documents/roger/Biloki

# Terminal 1: Start PHP server
php artisan serve
# Should show: "INFO Server running on [http://127.0.0.1:8000]"

# Terminal 2: Watch for frontend changes (optional)
npm run dev
```

## ✨ Tips for Best Recording

1. **Clear Desktop**: Minimize taskbar, close irrelevant windows
2. **Good Lighting**: If using webcam, ensure adequate lighting
3. **Audio Quality**: Speak clearly if narrating
4. **Network**: Ensure localhost is accessible (no VPN interfering)
5. **Performance**: Close heavy applications to prevent lag
6. **Test First**: Do a quick manual test before recording
7. **Timestamps**: Note when you're doing important actions
8. **Show Everything**: Demonstrate all major features

## 🐛 Troubleshooting

### "Server not responding"
```bash
# Restart server
php artisan serve
```

### "API endpoint not found"
```bash
# Clear route cache
php artisan route:clear
php artisan config:clear
```

### "Database is empty"
```bash
# Reseed database
php artisan migrate:fresh
php artisan db:seed
```

### "Records showing stale data"
```bash
# Refresh page (Ctrl+Shift+R)
# Or restart browser
```

## 📋 Recording Checklist

During recording, ensure you demonstrate:

- [x] Login/Authentication
- [x] Dashboard navigation
- [x] Product CRUD (Create, Read, Update, Delete)
- [x] Product search and filtering
- [x] Client CRUD operations
- [x] Client type and status filtering
- [x] Stock list with status
- [x] Low stock filtering
- [x] Stock adjustment
- [x] Error validation
- [x] Success notifications
- [x] Pagination
- [x] Responsiveness
- [x] Clean code navigation (show git log)

## 🎬 Recording Duration

- **Total Recommended**: 30-60 minutes
- **Per Module**: ~10-15 minutes
- **Buffer**: 5-10 minutes for exploration

Total: Can be done in 1-2 hours (leaving 1-2 hours unused of the 3-hour limit)

---

**Good luck with your assessment! 🚀**

For any issues, refer to README.md and DEVELOPMENT.md in the project root.
