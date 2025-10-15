# ✅ Testing Checklist - Consistency.ai

Use this checklist to verify all features are working correctly.

## 🔧 Pre-Testing Setup

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] Database has been seeded with colleges and admin user
- [ ] No console errors in browser
- [ ] No errors in backend terminal

---

## 🔐 Authentication Testing

### Registration
- [ ] Navigate to `/register`
- [ ] Registration form displays correctly
- [ ] All fields are visible (Name, Email, Password, Confirm Password, Phone, Year, Department, College)
- [ ] College dropdown shows all seeded colleges
- [ ] "SCIENT INSTITUTE OF TECHNOLOGY" appears as default option
- [ ] Password confirmation validation works
- [ ] Email validation works
- [ ] Registration creates new student account
- [ ] Success toast notification appears
- [ ] Redirects to student dashboard after registration
- [ ] JWT token is stored in localStorage

### Login
- [ ] Navigate to `/login`
- [ ] Login form displays correctly
- [ ] Email and password fields are visible
- [ ] Admin credentials work (admin@consistency.ai / admin123)
- [ ] Student credentials work
- [ ] Invalid credentials show error message
- [ ] Admin redirects to `/admin/dashboard`
- [ ] Student redirects to `/student/dashboard`
- [ ] Success toast notification appears
- [ ] JWT token is stored in localStorage

### Logout
- [ ] Logout button visible in navbar
- [ ] Clicking logout clears token
- [ ] Redirects to login page
- [ ] Can't access protected routes after logout

---

## 🎓 Student Features Testing

### Student Dashboard
- [ ] Dashboard loads without errors
- [ ] Welcome message shows student name
- [ ] All 4 stat cards display:
  - [ ] Hours This Week
  - [ ] Entries Today
  - [ ] Current Streak
  - [ ] Total Entries
- [ ] Weekly performance chart renders
- [ ] Chart shows data (if entries exist)
- [ ] Quick action cards are clickable
- [ ] Links navigate to correct pages

### Student Profile
- [ ] Navigate to `/student/profile`
- [ ] Profile card shows student info
- [ ] All form fields are populated with current data
- [ ] Name field is editable
- [ ] Email field is read-only
- [ ] Phone field is editable
- [ ] Year dropdown works
- [ ] Department field is editable
- [ ] College field is read-only
- [ ] All professional link fields are editable:
  - [ ] GitHub
  - [ ] LeetCode
  - [ ] HackerRank
  - [ ] LinkedIn
  - [ ] Resume
- [ ] "Visit" buttons work (open in new tab)
- [ ] "Passionate About" textarea works
- [ ] "Save Changes" button updates profile
- [ ] Success notification appears on save
- [ ] Updated data persists after refresh

### Daily Entries
- [ ] Navigate to `/student/entries`
- [ ] "Add Entry" button is visible
- [ ] Clicking "Add Entry" opens modal
- [ ] Modal shows all form fields:
  - [ ] Date (auto-filled with today)
  - [ ] Hours and Minutes inputs
  - [ ] Concepts textarea
  - [ ] GitHub repo link
  - [ ] LeetCode link
  - [ ] HackerRank link
  - [ ] Doubts textarea
  - [ ] Problems practiced textarea
  - [ ] Mood dropdown (Excellent, Good, Average, Poor)
  - [ ] Learning type dropdown (Self-study, Peer-learning, Mentor-guided)
  - [ ] Tag/Topic field
  - [ ] Screenshot URL field
- [ ] "Add Entry" button saves entry
- [ ] Success notification appears
- [ ] Modal closes after save
- [ ] New entry appears in table
- [ ] Table shows all entries
- [ ] Edit button opens modal with entry data
- [ ] Update works correctly
- [ ] Delete button shows confirmation
- [ ] Delete removes entry from table
- [ ] Empty state message shows when no entries

### Student Analytics
- [ ] Navigate to `/student/analytics`
- [ ] All 4 stat cards display
- [ ] Last 7 Days chart renders
- [ ] Platform usage chart shows data
- [ ] Mood distribution pie chart renders
- [ ] Topics covered chart shows data
- [ ] Insights section displays:
  - [ ] Most Used Platform
  - [ ] Most Common Mood
  - [ ] Top Topic
- [ ] Charts are responsive
- [ ] Tooltips work on hover

---

## 🧑‍💼 Admin Features Testing

### Admin Dashboard
- [ ] Login as admin
- [ ] Navigate to `/admin/dashboard`
- [ ] All 4 stat cards display:
  - [ ] Total Students
  - [ ] Active Today
  - [ ] Total Entries
  - [ ] This Week
- [ ] College distribution chart renders
- [ ] Top performers table shows data
- [ ] Table shows rank, name, email, college, year, hours, entries
- [ ] Special styling for top 3 ranks
- [ ] Data updates when students add entries

### Student Management
- [ ] Navigate to `/admin/students`
- [ ] All students display as cards
- [ ] Each card shows:
  - [ ] Avatar with initial
  - [ ] Name
  - [ ] Email
  - [ ] Year
  - [ ] College
  - [ ] Department (if exists)
  - [ ] View Profile button
  - [ ] Call button (if phone exists)
- [ ] Search bar filters by name/email in real-time
- [ ] College filter dropdown works
- [ ] Year filter dropdown works
- [ ] Filters work together
- [ ] Reset filters works
- [ ] Clicking "View Profile" opens modal
- [ ] Modal shows complete student info
- [ ] Modal shows all student entries
- [ ] Professional links are clickable
- [ ] Can add remarks on entries
- [ ] Remark saves successfully
- [ ] Remark appears in entry details
- [ ] Modal is scrollable
- [ ] Close button closes modal

### Leaderboard
- [ ] Navigate to `/admin/leaderboard`
- [ ] Timeframe filter shows options (All, Month, Week)
- [ ] Top 3 podium displays correctly:
  - [ ] 1st place with gold styling
  - [ ] 2nd place with silver styling
  - [ ] 3rd place with bronze styling
- [ ] Full leaderboard table shows all students
- [ ] Table sorted by total hours (descending)
- [ ] Rank column shows position
- [ ] Hours column highlights total hours
- [ ] Changing timeframe updates data
- [ ] Data is accurate

### Admin Settings
- [ ] Navigate to `/admin/settings`
- [ ] "Add College" button visible
- [ ] Clicking opens modal
- [ ] Can enter college name
- [ ] Submit creates new college
- [ ] New college appears in table
- [ ] Success notification appears
- [ ] Table shows all colleges
- [ ] Edit button opens modal with college data
- [ ] Update works correctly
- [ ] Delete button shows confirmation
- [ ] Delete removes college
- [ ] Active/Inactive toggle works
- [ ] Status updates immediately

---

## 🎨 UI/UX Testing

### Navigation
- [ ] Navbar appears on all pages
- [ ] Logo/brand name visible
- [ ] User name displayed in navbar
- [ ] Dark/Light mode toggle works
- [ ] Logout button works
- [ ] Sidebar appears for authenticated users
- [ ] Sidebar shows correct menu items based on role
- [ ] Active page is highlighted
- [ ] Hamburger menu works on mobile
- [ ] Sidebar slides in/out smoothly
- [ ] Clicking menu items navigates correctly
- [ ] Mobile overlay closes sidebar

### Dark/Light Mode
- [ ] Toggle button in navbar
- [ ] Clicking changes theme
- [ ] All pages support both modes
- [ ] Text is readable in both modes
- [ ] Cards have proper backgrounds
- [ ] Charts adapt to theme
- [ ] Preference persists after refresh
- [ ] Icon changes (sun/moon)

### Responsive Design
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] All layouts adapt properly
- [ ] Text is readable at all sizes
- [ ] Buttons are touchable on mobile
- [ ] Forms are usable on mobile
- [ ] Tables scroll horizontally if needed
- [ ] Modals fit on small screens
- [ ] Charts are responsive

### Notifications
- [ ] Success notifications are green
- [ ] Error notifications are red
- [ ] Notifications auto-dismiss after 3 seconds
- [ ] Close button works
- [ ] Multiple notifications stack correctly
- [ ] Notifications slide in smoothly

---

## 🔐 Security Testing

### Route Protection
- [ ] Cannot access `/student/*` when logged out
- [ ] Cannot access `/admin/*` when logged out
- [ ] Student cannot access `/admin/*` routes
- [ ] Admin CAN access both student and admin routes
- [ ] Unauthorized access redirects to login
- [ ] Token expiration logs user out

### Data Access
- [ ] Students can only see their own entries
- [ ] Students can only edit their own entries
- [ ] Students can only delete their own entries
- [ ] Admin can see all students' data
- [ ] Admin can add remarks on any entry
- [ ] Password is never shown in responses
- [ ] JWT token is verified on protected routes

---

## 📊 Data Validation Testing

### Entry Creation
- [ ] Cannot create entry without date
- [ ] Hours and minutes accept only numbers
- [ ] Negative values are rejected
- [ ] Required fields are enforced
- [ ] Optional fields can be empty

### Profile Update
- [ ] Cannot save empty name
- [ ] Email cannot be changed
- [ ] Phone number validation works
- [ ] URLs are validated (if implemented)

### College Management
- [ ] Cannot create college without name
- [ ] Duplicate college names are rejected
- [ ] Cannot delete college if students are using it

---

## 🧪 Edge Cases Testing

- [ ] Empty dashboard (no entries)
- [ ] Zero hours logged
- [ ] Very long text in textareas
- [ ] Special characters in inputs
- [ ] Multiple rapid submissions
- [ ] Network errors are handled gracefully
- [ ] Page refresh doesn't lose auth
- [ ] Browser back button works correctly
- [ ] Opening multiple tabs maintains state

---

## 📱 Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## ⚡ Performance Testing

- [ ] Dashboard loads in < 2 seconds
- [ ] Charts render smoothly
- [ ] No lag when typing
- [ ] Navigation is instant
- [ ] API calls complete quickly
- [ ] No memory leaks (check DevTools)
- [ ] Console has no errors
- [ ] Network requests are efficient

---

## 🎯 Acceptance Criteria

### Critical (Must Pass)
- [x] User can register
- [x] User can login
- [x] Student can add entry
- [x] Student can view analytics
- [x] Admin can view all students
- [x] Admin can view leaderboard
- [x] Dark mode works
- [x] Responsive on mobile

### Important (Should Pass)
- [x] Student can edit profile
- [x] Student can edit entries
- [x] Admin can add remarks
- [x] Admin can manage colleges
- [x] Charts display correctly
- [x] Notifications work
- [x] Protected routes work

### Nice to Have
- [x] Streak counter works
- [x] Filters work correctly
- [x] Search works in real-time
- [x] Smooth animations
- [x] Professional UI design

---

## 📝 Testing Notes

**Date Tested:** __________  
**Tested By:** __________  
**Version:** 1.0.0  

**Issues Found:**
- 
- 
- 

**Additional Comments:**
- 
- 
- 

---

## ✅ Final Checklist

- [ ] All authentication flows work
- [ ] All student features work
- [ ] All admin features work
- [ ] UI is responsive and professional
- [ ] Dark mode works perfectly
- [ ] No console errors
- [ ] No broken links
- [ ] Data persists correctly
- [ ] Security measures in place
- [ ] Documentation is complete

---

**Status:** □ All Tests Passed  □ Some Issues Found  □ Major Issues

**Overall Rating:** ☐☐☐☐☐ (Rate 1-5 stars)

---

🎉 **If all tests pass, the application is ready for use!**
