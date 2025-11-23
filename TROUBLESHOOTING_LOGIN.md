# Login/Registration Troubleshooting Guide

## Issues Fixed:

### 1. ✅ Wrong Navigation Route
- **Problem**: Login was navigating to `/kyc/details` which doesn't exist
- **Fix**: Changed to navigate to `/user` after successful login

### 2. ✅ Error Message Format Mismatch
- **Problem**: Frontend was looking for `e.response?.data?.message` but backend returns `error`
- **Fix**: Updated to check both `error` and `message` fields

### 3. ✅ Better Error Handling
- Added console.error for debugging
- Added token validation before navigation
- Better error messages

## Common Issues to Check:

### 1. **Backend Server Not Running**
```bash
cd backend
node server.js
```
Should see: "Server running on http://localhost:5000"

### 2. **MongoDB Not Connected**
Check if MongoDB is running and MONGO_URI is correct in `.env` file:
```
MONGO_URI=mongodb://localhost:27017/kyc_app
```

### 3. **CORS Issues**
If you see CORS errors in browser console:
- Backend has `app.use(cors())` which should allow all origins
- Check browser console for specific CORS errors

### 4. **Network Errors**
- Check if backend is accessible at `http://localhost:5000`
- Try accessing `http://localhost:5000/all-docs` in browser
- Check browser Network tab for failed requests

### 5. **Token Not Saving**
- Check browser localStorage: `localStorage.getItem("token")`
- Clear localStorage and try again

### 6. **Password Validation**
- Backend doesn't enforce minimum length
- Frontend shows "Must be at least 6 characters" but backend accepts any length
- Consider adding backend validation

## Testing Steps:

1. **Test Registration:**
   - Go to `/register`
   - Fill in name, email, password
   - Submit
   - Should redirect to `/user` dashboard

2. **Test Login:**
   - Go to `/login`
   - Use registered email and password
   - Submit
   - Should redirect to `/user` dashboard

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

4. **Check Backend Logs:**
   - Look at terminal where server is running
   - Check for error messages
   - Check MongoDB connection status

## Debug Commands:

```bash
# Check if backend is running
curl http://localhost:5000/all-docs

# Check MongoDB connection
# In MongoDB shell or Compass, check if database exists

# Check environment variables
cd backend
cat .env  # Make sure all required vars are set
```

