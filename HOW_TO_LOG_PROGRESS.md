# 📊 How to Log Progress in Momentum - Complete Guide

## 🎯 **UI Navigation Flow**

```
1. Login/Register at http://localhost:3000
         ↓
2. Dashboard - See your stats
         ↓
3. Click "Goals" in navbar OR "View All Goals" button
         ↓
4. Click "View Progress" button on any goal card
         ↓
5. Click "+ Log Progress" button (top right)
         ↓
6. Fill in the form and submit!
```

---

## 📱 **Step-by-Step Visual Guide**

### **Step 1: Access Your Goals**

From the **Dashboard** or **Navbar**, click on **"Goals"**

Your goals will be displayed as cards showing:
- Goal title
- Category badge (fitness/nutrition/job_search)
- Status badge (active/completed/paused)
- Target value
- Start/end dates
- Three buttons: **"View Progress"** | "Edit" | "Delete"

---

### **Step 2: Open Progress Tracker**

Click the **"View Progress"** button on any goal card.

You'll see the **Progress Tracker** page with:
- Goal title and description at the top
- Three stat cards showing:
  - Total Progress
  - Average per Day
  - Target
- **"+ Log Progress"** button (top right - THIS IS THE KEY!)
- Table of existing progress entries

---

### **Step 3: Click "+ Log Progress"**

The button is located in the top right of the "Progress Entries" section.

A **modal popup form** will appear with fields:
- **Date*** (required) - defaults to today
- **Value*** (required) - the number (e.g., 5.2)
- **Unit** (optional) - e.g., miles, kg, calories
- **Notes** (optional) - any comments

---

### **Step 4: Fill Out the Form**

**Example for Fitness Goal:**
```
Date: 2026-01-14 (today)
Value: 5.2
Unit: miles
Notes: Great morning run! Beautiful weather.
```

**Example for Nutrition Goal:**
```
Date: 2026-01-14
Value: 1800
Unit: calories
Notes: Stayed under goal, felt good all day
```

**Example for Job Search Goal:**
```
Date: 2026-01-14
Value: 3
Unit: applications
Notes: Applied to Google, Meta, and Amazon
```

---

### **Step 5: Submit**

Click **"Log Progress"** button at the bottom of the form.

Success! You'll see:
- ✅ Form closes automatically
- ✅ New entry appears in the table
- ✅ Stats are updated immediately
- ✅ Charts refresh with new data

---

## 🖼️ **What You Should See**

### **Dashboard Page**
```
┌─────────────────────────────────────────────────┐
│  Welcome back, [Your Name]! 👋                  │
│  Here's an overview of your progress            │
├─────────────────────────────────────────────────┤
│  [Total Goals]  [Active]  [Completed]  [Entries]│
│       5            3          2           15     │
├─────────────────────────────────────────────────┤
│  Quick Actions:                                  │
│  [➕ New Goal]  [📊 View All Goals]             │
└─────────────────────────────────────────────────┘
```

### **Goals Page**
```
┌────────────────────────────────────────────────┐
│ Run 100 Miles This Month                       │
│ [Fitness] [Active]                             │
│                                                 │
│ Target: 100 miles                              │
│ Start: Jan 1, 2026                             │
│                                                 │
│ [View Progress] [Edit] [Delete]  ← CLICK THIS! │
└────────────────────────────────────────────────┘
```

### **Progress Tracker Page**
```
┌────────────────────────────────────────────────┐
│ ← Back to Goals                                 │
│                                                 │
│ Run 100 Miles This Month                       │
│ Track your daily running progress               │
├────────────────────────────────────────────────┤
│ [Total: 45.5 mi] [Avg: 5.7 mi] [Target: 100]  │
├────────────────────────────────────────────────┤
│ Progress Entries          [+ Log Progress] ← ! │
├────────────────────────────────────────────────┤
│ Date         │ Value    │ Notes                │
│ Jan 14, 2026 │ 5.2 mi   │ Morning run         │
│ Jan 13, 2026 │ 6.5 mi   │ Evening run         │
│ Jan 12, 2026 │ 4.8 mi   │ Easy pace           │
└────────────────────────────────────────────────┘
```

### **Log Progress Form (Modal)**
```
┌────────────────────────────────────┐
│ Log Progress               [X]      │
├────────────────────────────────────┤
│ Date *                             │
│ [2026-01-14]                       │
│                                    │
│ Value *                            │
│ [5.2]                              │
│                                    │
│ Unit                               │
│ [miles]                            │
│                                    │
│ Notes                              │
│ [Great morning run!]               │
│                                    │
│ [Log Progress] [Cancel]            │
└────────────────────────────────────┘
```

---

## 🔍 **Troubleshooting: "I Don't See the Button!"**

### **Check #1: Are you logged in?**
- You must be logged in to see goals
- Check if you see your name in the navbar

### **Check #2: Do you have any goals?**
- Go to Dashboard → Click "New Goal"
- Create at least one goal first

### **Check #3: Are you on the right page?**
- URL should be: `http://localhost:3000/goals/[goal-id]/progress`
- You should see the goal title and a table

### **Check #4: Is the button visible?**
The **"+ Log Progress"** button is:
- Located in the top-right of the "Progress Entries" section
- Blue background (primary color)
- White text
- Right next to "Progress Entries" heading

### **Check #5: Browser console errors?**
Open browser DevTools (F12) and check Console tab for errors

---

## 🎨 **Button Location Details**

The "+ Log Progress" button appears at **line 150** in `ProgressTracker.tsx`:

```tsx
<button
  onClick={() => setShowForm(true)}
  className="bg-primary-600 hover:bg-primary-700 text-white 
             font-semibold py-2 px-4 rounded-lg shadow-md 
             transition duration-200"
>
  + Log Progress
</button>
```

**Visual location:**
- Section: "Progress Entries"
- Position: Top right corner
- Color: Blue/Primary
- Size: Medium button with padding

---

## 🚀 **Quick Test**

1. Open: `http://localhost:3000`
2. Login with test credentials or register
3. Click "Goals" in navbar
4. If no goals exist, click "+ New Goal" and create one
5. Click "View Progress" on the goal card
6. Look for "+ Log Progress" button (top right)
7. Click it and fill the form!

---

## 📊 **After Logging Progress**

You can:
- ✅ **Edit** any entry by clicking "Edit" in the table
- ✅ **Delete** entries by clicking "Delete"
- ✅ **View stats** updated automatically (Total, Average, Target)
- ✅ **See charts** with your progress over time
- ✅ **Track trends** (increasing/decreasing/stable)

---

## 💡 **Pro Tips**

1. **Quick Entry**: The date defaults to today, so just enter value and click submit!

2. **Multiple Entries**: Log progress for different dates by changing the date field

3. **One Entry Per Day**: You can only have one entry per goal per day (database constraint)

4. **Edit Instead**: If you already logged today, edit the existing entry instead

5. **Notes Help**: Add notes to remember context ("felt tired", "new PR!", etc.)

---

## 🎯 **Full User Flow Example**

Let's say you want to track running:

1. **Create Goal**: 
   - Title: "Run 100 miles in January"
   - Category: Fitness
   - Target: 100 miles

2. **Day 1** (Jan 1):
   - Go to goal → "+ Log Progress"
   - Value: 5.2, Notes: "First day, felt good!"

3. **Day 2** (Jan 2):
   - Value: 6.5, Notes: "Pushed harder today"

4. **Day 3** (Jan 3):
   - Value: 4.8, Notes: "Recovery run"

5. **View Progress**:
   - Total: 16.5 miles
   - Average: 5.5 miles/day
   - Target: 100 miles
   - Progress: 16.5% complete

---

## 📞 **Still Can't Find It?**

If the button is truly not visible:

1. Check browser zoom (should be 100%)
2. Try a different browser
3. Check if JavaScript is enabled
4. Look in browser console for errors
5. Restart the frontend server

Or share a screenshot and I'll help you locate it!

---

**The "+ Log Progress" button is definitely there - it's the blue button at the top right of the Progress Entries table!** 🎯
