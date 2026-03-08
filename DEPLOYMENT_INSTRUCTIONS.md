# GitHub Pages Deployment Instructions

## Task 23.3: Deploy to GitHub Pages

### Prerequisites
- Git repository initialized
- GitHub account created
- All code committed to main branch

### Step 1: Push Code to GitHub

```bash
# If repository doesn't exist on GitHub yet:
# 1. Go to github.com and create a new repository named "witness-interactive"
# 2. Do NOT initialize with README (we already have one)

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/witness-interactive.git

# Push all code to main branch
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/witness-interactive`
2. Click **Settings** (top navigation)
3. Click **Pages** (left sidebar under "Code and automation")
4. Under "Source":
   - Select branch: **main**
   - Select folder: **/ (root)**
5. Click **Save**

### Step 3: Wait for Deployment

- GitHub will build and deploy your site (takes 1-2 minutes)
- You'll see a message: "Your site is live at https://YOUR_USERNAME.github.io/witness-interactive/"
- Click the URL to verify deployment

### Step 4: Verify Deployment

Test the deployed site:
- [ ] Landing screen loads correctly
- [ ] Timeline selector displays Pearl Harbor mission
- [ ] All three roles are playable
- [ ] Scenes display with choices
- [ ] Outcomes calculate correctly
- [ ] Historical ripple timeline animates
- [ ] Knowledge checkpoint works
- [ ] Results card displays
- [ ] No console errors
- [ ] Mobile responsive (test on phone)

### Troubleshooting

**Site shows 404 error:**
- Wait 2-3 minutes for initial deployment
- Check that branch is set to "main" in Pages settings
- Verify index.html is in root directory (not in a subfolder)

**CSS/JS not loading:**
- Check that all file paths are relative (no absolute paths)
- Verify all files are committed and pushed to GitHub
- Check browser console for 404 errors

**Game doesn't work:**
- Open browser console (F12) and check for JavaScript errors
- Verify all ES6 modules are loading correctly
- Test locally first to ensure no code issues

### Custom Domain (Optional)

To use a custom domain:
1. Add a CNAME file to repository root with your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings with custom domain

### Deployment Complete!

Once verified, your game is live and accessible to students worldwide at:
`https://YOUR_USERNAME.github.io/witness-interactive/`

Share this URL with teachers, students, and on social media!
