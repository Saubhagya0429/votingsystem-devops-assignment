# voting system

## Group Information 
- **Student 1:** T.A. Saubhagya Nirmandi - ITBIN-2313-0073 - Role: Devops ENgineer 
- **Student 2:** [Full Name as in LMS] - [Student ID] - Role: [Role Name] 

## Project Description 
 The Online Voting System is a secure web-based application designed to conduct digital elections efficiently, transparently, and securely. The system allows registered voters to cast their votes remotely while ensuring data integrity, confidentiality, and authenticity of the election process.

This platform eliminates the need for physical polling stations and manual vote counting, reducing operational costs and human errors. It is designed with modern web technologies and secure authentication mechanisms to prevent unauthorized access, duplicate voting, and data manipulation.

## Live Deployment 
**Live URL:** https://votingsystem-devops-assignment.vercel.app/ 
 
## Technologies Used 
- HTML5, CSS3, JavaScript 
- [Any frameworks/libraries used] 
- GitHub Actions 
- [vercel.com] 

## Features 
- Secure online voting interface 
- Admin panel for managing voting process 
- Prevention of duplicate voting
- Real-time vote counting  
- Automated deployment using CI/CD pipeline  

## Branch Strategy 
We implemented the following branching strategy: 
- `main` - Production branch 
- `develop` - Integration branch 
- `feature/*` - Feature development branches 

All features were developed in separate feature branches and merged into the develop branch after testing. The main branch contains the stable production-ready version.

## Individual Contributions 

### [T.A Saubhagya Nirmandi] 
- Repository setup and configuration 
- GitHub Actions CI/CD pipeline implementation 
- Deployment setup and management 
- Configured Vercel integration  
- Managed branch protection rules 

### [Student 2 Name] 
- [List specific features developed] 
- [List specific commits/contributions] 

## Setup Instructions 

### Prerequisites 
- Node.js (version 18 or higher) 
- Git 

### Installation 
```bash 
# Clone the repository 
git clone [https://github.com/Saubhagya0429/votingsystem-devops-assignment.git] 
# Navigate to project directory 
cd [votingsystem-devops-assignment
] 
# Install dependencies 
npm install 
# Run development server 
npm run dev 
# Deployment Process 
[Explain how your CI/CD pipeline works] 
# Challenges Faced 
[Optional: Describe any challenges and how you resolved them] 
# Build Status 
--- 
## 
 Step-by-Step Implementation Guide 
### Phase 1: Setup (0-15 minutes) 
#### Step 1: Team Formation & Planning 
1. Form your team (2-3 students) 
2. Assign roles based on strengths 
3. Choose your project type 
4. Decide on features to implement 
#### Step 2: Repository Creation (DevOps Engineer) 
1. Go to GitHub.com and sign in 
2. Click "New Repository" 
3. Name: `[project-name]-devops-assignment` 
4. Description: "Advanced Git & DevOps Assignment - [Group Number]" 
5. Select **PUBLIC** 
6. Initialize with README: **NO** (we'll create our own) 
7. Click "Create Repository" 
#### Step 3: Add Collaborators 
1. Go to Settings → Collaborators 
2. Add all team members by GitHub username 
3. Each member should accept the invitation 
#### Step 4: Clone Repository (All Members) 
```bash 
git clone https://github.com/[username]/[repo-name].git 
cd [repo-name] 
Step 5: Initial Setup (DevOps Engineer) 
# Create initial files 
touch README.md .gitignore 
# Create branch structure 
git checkout -b develop 
git push -u origin develop 
# Create GitHub Actions directory 
mkdir -p .github/workflows 
# Add initial commit 
git add . 
git commit -m "chore: initial repository setup" 
git push origin develop 
Phase 2: Development (15-75 minutes) 
Step 6: Create Feature Branches (Each Developer) 
Each team member should: 
# Update local repository 
git checkout develop 
git pull origin develop 
# Create your feature branch 
git checkout -b feature/[your-feature-name] 
# Example: 
# git checkout -b feature/homepage-layout 
# git checkout -b feature/contact-form 
# git checkout -b feature/navigation-menu 
Step 7: Develop Your Features (Each Developer) 
Guidelines for commits: 
● Commit frequently (every significant change) 
● Write meaningful commit messages 
● Follow commit message conventions: 
○ feat: new feature 
○ fix: bug fix 
○ docs: documentation changes 
○ style: formatting changes 
○ refactor: code refactoring 
○ test: adding tests 
○ chore: maintenance tasks 
Example workflow: 
# Make changes to your files 
# ... 
# Check status 
git status 
# Add files 
git add . 
# Commit with meaningful message 
git commit -m "feat: add homepage hero section" 
# Push to your feature branch 
git push origin feature/[your-feature-name] 
Step 8: Create Pull Requests (Each Developer) 
1. Go to GitHub repository 
2. Click "Pull Requests" → "New Pull Request" 
3. Base: develop ← Compare: feature/[your-feature-name] 
4. Title: Clear description of what you've done 
5. Description: Detail the changes, any issues encountered 
6. Assign reviewers (your team members) 
7. Create Pull Request 
Pull Request Template: 
## Description 
[What does this PR do?] 
## Changes Made - Change 1 - Change 2 - Change 3 
## Screenshots (if applicable) 
[Add screenshots] 
## Testing - [ ] Tested locally - [ ] No console errors - [ ] Responsive on mobile 
## Related Issues 
Closes #[issue-number] (if applicable) 
Step 9: Code Review & Merge (All Members) 
Reviewers should: 
1. Check the code quality 
2. Test the changes locally 
3. Leave comments or approve 
4. The DevOps Engineer handles the final merge 
Merging process: 
# Switch to develop 
git checkout develop 
# Merge feature branch (after PR approval) 
git merge feature/[feature-name] --no-ff 
# Push to remote 
git push origin develop 