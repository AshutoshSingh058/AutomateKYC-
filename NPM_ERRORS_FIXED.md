# NPM Errors - Fixed Issues

## Common NPM Errors and Solutions

### 1. ✅ ESLint Config Error (FIXED)
**Problem**: The `eslint.config.js` was using incorrect imports and syntax for ESLint 9.x

**Error you might see:**
```
Cannot find module 'eslint/config'
SyntaxError: Unexpected token
```

**Fix Applied**: 
- Removed incorrect `defineConfig` and `globalIgnores` imports
- Updated to use flat config format for ESLint 9.x
- Changed `globalIgnores` to `ignores` array
- Fixed plugin configuration

### 2. Common NPM Issues to Check:

#### A. **Peer Dependency Warnings**
These are usually warnings, not errors. You can ignore them or install peer dependencies:
```bash
npm install --legacy-peer-deps
```

#### B. **Missing Dependencies**
If you see "Cannot find module" errors:
```bash
# Frontend
cd frontend/frontend
npm install

# Backend
cd backend
npm install
```

#### C. **Version Conflicts**
If packages have version conflicts:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### D. **React 19 Compatibility**
React 19 is very new. Some packages might not be fully compatible yet. If you see warnings about React versions, you can:
- Downgrade to React 18: `npm install react@^18 react-dom@^18`
- Or ignore the warnings (they're usually non-breaking)

### 3. **Backend Package Issues**

#### Express 5.x Compatibility
Express 5.x is in beta. If you see errors, consider downgrading:
```bash
cd backend
npm install express@^4.18.0
```

### 4. **Common Error Messages:**

#### "npm ERR! code ELIFECYCLE"
- Usually means a script failed
- Check the error message above it
- Try deleting `node_modules` and reinstalling

#### "npm ERR! code ENOENT"
- File or directory not found
- Check if you're in the correct directory
- Verify package.json exists

#### "npm ERR! code ERESOLVE"
- Dependency conflict
- Use `npm install --legacy-peer-deps`
- Or update conflicting packages

### 5. **Quick Fixes:**

```bash
# Clear npm cache
npm cache clean --force

# Delete and reinstall (Frontend)
cd frontend/frontend
rm -rf node_modules package-lock.json
npm install

# Delete and reinstall (Backend)
cd backend
rm -rf node_modules package-lock.json
npm install
```

### 6. **If Errors Persist:**

1. Check Node.js version:
   ```bash
   node --version
   ```
   Should be Node 18+ or 20+

2. Check npm version:
   ```bash
   npm --version
   ```
   Should be npm 9+ or 10+

3. Update npm:
   ```bash
   npm install -g npm@latest
   ```

## Current Status:
✅ ESLint config fixed
✅ All dependencies installed correctly
✅ No critical errors found

If you're seeing specific error messages, please share them and I can help fix them!

