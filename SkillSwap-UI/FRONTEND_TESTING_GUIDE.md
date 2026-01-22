# Frontend Testing Guide (Without Backend)

## 🚀 Quick Start - Run Frontend Only

### 1. Start the Development Server

```bash
cd client
npm install  # If you haven't already
npm run dev
```

The frontend will run on `http://localhost:5173` (default Vite port).

---

## ✅ What You Can Test Without Backend

### **1. Landing Page** ✅
- **Route**: `/`
- **Status**: Works completely (no backend needed)
- **What to check**:
  - Navigation works
  - UI renders correctly
  - Links to signin/signup work

### **2. Sign In / Sign Up Pages** ⚠️
- **Routes**: `/signin`, `/signup`
- **Status**: UI works, but authentication will fail without backend
- **What to check**:
  - Forms render correctly
  - Validation works (password mismatch, email format)
  - Error messages display when API calls fail
- **Expected behavior without backend**: 
  - You'll see error messages like "API 500: Connection refused" or similar
  - Forms still validate input correctly

### **3. Protected Routes** ⚠️
- **Routes**: `/dashboard`, `/profile`, `/resume`, `/tests`, `/sessions`
- **Status**: Protected - requires authentication
- **Without backend**: These pages will redirect to `/signin` because you can't authenticate

---

## 🧪 How to Test Protected Pages Without Backend

### **Option 1: Mock Authentication (Quick Test)**

You can temporarily bypass authentication by modifying the browser's localStorage:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this command:
```javascript
localStorage.setItem('skillswap_jwt_token', 'mock-token-12345');
localStorage.setItem('skillswap_auth_user', JSON.stringify({ email: 'test@example.com' }));
```
4. Refresh the page
5. Now you can navigate to protected routes (but API calls will still fail)

### **Option 2: Check UI Only (Safest)**

All pages will show **loading states** and **error messages** when API calls fail. You can:

1. Use Option 1 to access protected routes
2. Navigate through all pages
3. Check that:
   - UI layouts render correctly
   - Forms display properly
   - Loading states appear
   - Error messages show when API calls fail

---

## 📋 Testing Checklist

### **Pages to Verify**:

1. **Profile Page** (`/profile`)
   - ✅ Tabs render (Basic Info, Skills, Preferences)
   - ✅ Forms display correctly
   - ⚠️ API calls will fail, but error messages will show

2. **Resume Page** (`/resume`)
   - ✅ All 4 tabs render (Education, Experience, Certifications, Coding Stats)
   - ✅ Add/Edit dialogs open correctly
   - ✅ Forms display with all fields
   - ⚠️ Save will fail, but forms work

3. **Test Portal** (`/tests`)
   - ✅ Generate Test dialog opens
   - ✅ Test History tab displays (empty state)
   - ⚠️ Test generation will fail

4. **Sessions Page** (`/sessions`)
   - ✅ Request Session dialog opens
   - ✅ Tabs render (All, Pending, Active, Completed)
   - ✅ Empty states display correctly
   - ⚠️ API calls will fail

5. **Dashboard** (`/dashboard`)
   - ✅ Stats cards render
   - ✅ Recommended swaps section displays
   - ✅ Active sessions section shows

---

## 🔍 Checking API Connection Errors

### In Browser DevTools:

1. **Open Network Tab** (F12 → Network)
2. **Try any action** (login, load profile, etc.)
3. **Check failed requests**:
   - Status: `Failed` or `CORS error` or `ERR_CONNECTION_REFUSED`
   - This confirms frontend is trying to connect to backend at `http://localhost:8080`

### In Console:

You'll see errors like:
```
API 500: Failed to fetch
or
API 500: Connection refused
```

This is **expected** when backend is not running - it means the frontend is correctly trying to connect!

---

## 🛠️ Troubleshooting

### **Frontend won't start**:
```bash
cd client
npm install  # Install dependencies
npm run dev
```

### **Port already in use**:
Vite will automatically use the next available port (e.g., 5174, 5175)

### **TypeScript errors**:
```bash
cd client
npm run build  # Check for compilation errors
```

### **Module not found errors**:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Current API Configuration

The frontend is configured to connect to:
- **API Base URL**: `http://localhost:8080`
- **Config Location**: `client/src/lib/api.ts` (line 1)

To change the API URL:
1. Edit `client/src/lib/api.ts`
2. Change `const API_BASE_URL = "http://localhost:8080";`
3. Or use environment variables

---

## ✅ Summary

**What Works** ✅:
- All UI components render
- Navigation and routing
- Form validation
- Loading states
- Error handling (shows errors when backend unavailable)

**What Needs Backend** ⚠️:
- Actual authentication
- Data persistence
- API data fetching
- Session management

**To Test Fully**: You need the backend running on `http://localhost:8080`

---

## 🎯 Next Steps

1. **Start frontend**: `cd client && npm run dev`
2. **Test UI**: Navigate through all pages
3. **Check errors**: Verify error messages appear when API calls fail
4. **Start backend**: When ready, start backend on port 8080
5. **Test integration**: Try actual authentication and data operations

