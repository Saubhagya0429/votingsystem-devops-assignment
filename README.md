# voting system

## Group Information 
- **Student 1:** T.A. Saubhagya Nirmandi - ITBIN-2313-0073 - Role: Devops ENgineer 
- **Student 2:** W.M.P.Praboadhi - ITBIN-2313-0084- Role: Fullstack Developer 

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

### [W.M.P.Praboadhi] 
- Develop voting interface(index.html, vote.html)
- Designed UI using CSS
- Implemented client-side validation using JavaScript
- Created feature branches and merge via pull requests

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
-This project uses a CI/CD pipeline to automate the build and deployment process.
-Code Push to GitHub
-Whenever code is pushed to the develop or main branch, the CI/CD workflow is triggered automatically.
-Continuous Integration (CI)
-Install project dependencies using npm install
-Run linting and validation checks
-Verify build process
-Build Stage
-Prepare production-ready build files
-Ensure environment variables (e.g., JWT secret, database URL) are configured securely using GitHub Secrets
-Continuous Deployment (CD)
-If the CI stage passes successfully, the application is automatically deployed to the configured hosting platform vercel.
-The latest stable version becomes live after successful deployment.
-This pipeline ensures reliable, automated, and consistent deployments without manual intervention.
# Challenges Faced 
-Handling JWT Authentication:
-Managing secure storage and validation of tokens required careful handling of localStorage and protected routes.
-Preventing Multiple Votes:
-Ensuring users could vote only once required backend validation and proper frontend checks.
-Role-Based Access Control:
-Restricting admin pages to authorized users required decoding and validating user roles from JWT tokens.
-Merge Conflicts During Development:
-While working with multiple feature branches, conflicts occurred. These were resolved by manually reviewing differences and ensuring the correct final logic was preserved.-
# Build Status 
-Authentication System	
-Voting Functionality	
-Admin Dashboard	
-UI/UX Improvements
-CI/CD Pipeline Integration	
-Production Deployment 
---

## Docker Setup Instructions

This project is containerized using Docker to ensure consistent deployment.

### Prerequisites

Make sure Docker Desktop is installed.

To check:

docker --version
docker-compose --version

---

### Build and Run Using Docker

Run the following command inside the project folder:
## Build Docker Image
docker build -t votingapp .

## Run with Docker
docker run -p 3000:80 votingapp

## Using Docker Compose
docker-compose up --build

This will:
- Build the Docker image
- Create the container
- Start the NGINX server
- If port 3000 is busy, change it in docker-compose.yml
- Rebuild container after changing files: docker-compose build
- Check logs: docker logs voting_system_container

---

### Access the Application

Open your browser and go to:

http://localhost:3000

---

### Stop the Application

To stop the container:

docker-compose down

