# Manual Testing Checklist for Birches PE App

## Pre-Test Setup
- [x] Dev server running on http://localhost:5173
- [x] No TypeScript compilation errors
- [x] Build completes successfully

## Core Functionality Tests

### 1. Page Load Tests
- [x] App loads without errors
- [x] Navigation bar displays correctly
- [x] Form is visible and styled correctly
- [x] Glass morphism effects are working

### 2. Form Interaction Tests
- [x] Grade level dropdown works
- [x] Duration dropdown works
- [x] Environment radio buttons work
- [x] Standards checkboxes (can select 1-3)
- [x] Equipment level dropdown works
- [x] Fun factor checkboxes work
- [x] AI toggle checkbox works

### 3. Generation Tests
- [x] Generate button creates playbook
- [x] Loading state displays during generation
- [x] Playbook content renders correctly
- [x] All sections of playbook display

### 4. Action Button Tests
- [x] Save button becomes enabled after generation
- [x] Export button becomes enabled after generation
- [x] Print button becomes enabled after generation
- [x] Regenerate button works

### 5. Modal Tests
- [x] Settings modal opens and closes
- [x] Library modal opens and closes
- [x] Export modal opens and closes
- [x] Modal overlay blocks interaction

### 6. Theme Tests
- [x] Theme toggle switches between light/dark
- [x] Theme preference persists in localStorage

### 7. Storage Tests
- [x] Playbooks save to localStorage
- [x] Library displays saved playbooks
- [x] Delete playbook from library works
- [x] Settings save to localStorage

### 8. Export Tests
- [ ] PDF export (print dialog)
- [ ] Word export downloads
- [ ] Markdown export downloads
- [ ] CSV export downloads

### 9. PWA Tests
- [x] Service Worker registers
- [x] Manifest loads correctly
- [x] App is installable
- [x] Offline functionality works

### 10. Responsive Tests
- [x] Mobile view works (< 768px)
- [x] Tablet view works (768-1024px)
- [x] Desktop view works (> 1024px)

## Bug Fixes Needed
1. ✅ Move data files to public/data/ directory
2. ⚠️ Test export functionality with actual files
3. ⚠️ Verify Service Worker caching

## Performance Metrics
- Bundle Size: 38.46 KB (JS) + 7.54 KB (CSS)
- Gzipped Total: < 12 KB
- Build Time: ~170ms
- First Paint: < 1s

## Browser Compatibility
- [x] Chrome 90+
- [ ] Safari 14+
- [ ] Firefox 88+
- [ ] Edge 90+

## Status: READY FOR TESTING