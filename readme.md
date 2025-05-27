# Family Allowance Tracker

A comprehensive web application for managing children's allowances, savings, behavior tracking, and more!

## 🎯 Features

### For Parents
- **Complete Dashboard**: Manage all children's accounts from one place
- **Allowance Management**: Add/deduct money with automatic transaction logging
- **Behavior Tracking**: Award/deduct points and tablet tokens
- **Streak Monitoring**: Track consecutive good behaviors (chores, bedtime, homework)
- **Savings Overview**: See all children's investment allocations
- **Data Management**: Export/import backups, sync across devices

### For Kids
- **Personal Profiles**: Each child has their own colorful dashboard
- **Savings Management**: Move money between Cash, Money Market, S&P 500, and Tithe
- **Chore Logging**: Log completed chores and earn behavior points automatically
- **Real-time Balances**: See current allowance and savings
- **Sibling Viewing**: Can view (but not edit) siblings' progress

### Authentication System
- **Simple Login**: Username/password for each family member
- **Role-Based Access**: Parents get full control, kids get appropriate permissions
- **Session Persistence**: Stays logged in between visits

## 🔐 Default Accounts

**Parent Account:**
- Username: `parent`
- Password: `family123`
- Permissions: Full control over all accounts

**Kids Accounts:**
- **Alex**: `alex` / `alex5` (Age 5)
- **Jordan**: `jordan` / `jordan7` (Age 7) 
- **Riley**: `riley` / `riley9` (Age 9)
- Permissions: Can manage own savings, log chores, view siblings (read-only)

## 🚀 Quick Setup

### 1. Create GitHub Repository
```bash
git clone https://github.com/yourusername/family-allowance-tracker.git
cd family-allowance-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Local Development
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
family-allowance-tracker/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── src/
│   ├── App.jsx                 # Main React component
│   └── main.jsx                # React entry point
├── data/
│   └── ledger.json             # Family data storage
├── index.html                  # HTML template
├── package.json                # Dependencies
├── vite.config.js              # Build configuration
└── README.md                   # This file
```

## ⚙️ Configuration

### Customize Your Family Data
Edit `data/ledger.json` to match your family:
- Change kids' names, ages, and starting balances
- Adjust allowance amounts
- Set initial behavior points and streaks

### Update GitHub Settings
In `src/App.jsx`, update the GitHub configuration:
```javascript
const GITHUB_CONFIG = {
  owner: 'YOUR_GITHUB_USERNAME',     // Your GitHub username
  repo: 'family-allowance-tracker',  // Your repository name
  path: 'data/ledger.json',
  branch: 'main'
};
```

### Change Login Credentials
In `src/App.jsx`, modify the `userAccounts` object:
```javascript
const userAccounts = {
  parent: { 
    password: 'your-new-password', 
    role: 'parent', 
    name: 'Parent' 
  },
  // Update kid passwords and names
};
```

## 🌐 GitHub Pages Deployment

### Enable GitHub Pages
1. Go to repository Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: "gh-pages" 
4. Save

### Automatic Deployment
- Push to main branch triggers automatic deployment
- GitHub Actions builds and deploys to GitHub Pages
- Access at: `https://yourusername.github.io/family-allowance-tracker`

## 💾 Data Storage

### Local Development
- Uses browser localStorage
- Data persists between sessions
- Perfect for testing

### Production (GitHub Pages)
- Data stored in `data/ledger.json` in your repository
- Automatic sync across all family devices
- Parent changes automatically commit to GitHub
- Complete transaction history maintained

## 🎓 Educational Benefits

### Financial Literacy
- **Savings Categories**: Learn about different investment types
- **Compound Growth**: Understand how money grows over time
- **Budgeting**: Practice allocating money across categories
- **Delayed Gratification**: Save for bigger goals

### Responsibility & Behavior
- **Chore System**: Connect work with rewards
- **Streak Tracking**: Build consistent good habits
- **Point Systems**: Immediate feedback for behavior
- **Sibling Awareness**: See family progress together

## 🔧 Customization Ideas

### Add New Features
- Weekly/monthly allowance automation
- Savings goals with progress tracking
- Reward redemption system
- Email notifications for milestones
- Charts and graphs for progress visualization

### Modify Categories
- Add new savings types (bonds, crypto education, etc.)
- Create custom chore categories
- Add different point systems (kindness points, academic points)
- Implement seasonal challenges

## 🛠️ Troubleshooting

### App Not Loading
- Check all files are in correct locations
- Verify GitHub Pages is enabled and repository is public
- Ensure GitHub username/repo are correct in configuration

### Data Not Syncing
- Confirm GitHub configuration in `src/App.jsx`
- Check that `data/ledger.json` exists in repository
- Verify you're accessing via GitHub Pages URL (not local)

### Local Development Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📱 Mobile Friendly
- Responsive design works on tablets and phones
- Kids can access their profiles from any device
- Touch-friendly buttons and interfaces

## 🔒 Security Notes
- Repository must be public for GitHub Pages (data is visible)
- Uses simple authentication suitable for family use
- For private data, consider GitHub Pro with private repositories
- Passwords stored in plain text (easy to customize)

## 📞 Support
If you encounter issues:
1. Check browser console for error messages
2. Verify GitHub repository setup matches instructions
3. Test locally first with `npm run dev`
4. Check GitHub Actions logs for deployment issues

## 🎉 Getting Started
1. Fork this repository
2. Customize the family data and passwords
3. Enable GitHub Pages
4. Share the URL with your family
5. Start teaching financial responsibility!