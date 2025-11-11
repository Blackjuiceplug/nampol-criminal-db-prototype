# 🚨 Nampol Criminal Database System

<div align="center">

**A Comprehensive Police Database Management System for Namibian Law Enforcement**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.2+-green?logo=django)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

*A modern web application designed to help Namibian police manage criminal records, evidence, officers, and generate actionable analytics for better law enforcement.*

[Features](#-features) • [Screenshots](#-screenshots) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🛡️ Overview

**Nampol Criminal Database System** is a powerful, secure, and user-friendly platform built specifically for the Namibian Police Force. It provides comprehensive tools to manage criminal records, track evidence, monitor officer activities, and generate data-driven insights for strategic decision-making.

### Why Nampol Criminal DB?

- 🗂️ **Centralized Records** - All criminal data in one secure location
- 🔍 **Advanced Search** - Quick retrieval of criminal profiles and case history
- 📊 **Analytics & Insights** - Data-driven decision making for crime prevention
- 🔐 **Secure Evidence Management** - Chain of custody tracking for legal integrity
- 👮 **Officer Management** - Track assignments, performance, and accountability
- 🇳🇦 **Built for Namibia** - Designed with local law enforcement needs in mind

---

## ✨ Features

### Core Functionality

| Feature | Description | Status |
|---------|-------------|--------|
| 🗃️ **Criminal Records Management** | Create, update, and maintain comprehensive criminal profiles with photos, fingerprints, and case history | ✅ Active |
| 📂 **Evidence Tracking** | Secure storage and chain of custody management for physical and digital evidence | ✅ Active |
| 👮 **Officer Management** | Officer profiles, assignments, certifications, and performance tracking | ✅ Active |
| 📊 **Analytics Dashboard** | Crime statistics, trends, hotspot mapping, and predictive analytics | ✅ Active |
| 🔍 **Advanced Search** | Multi-criteria search across criminals, cases, and evidence | ✅ Active |
| 📸 **Photo & Document Management** | Upload and manage mugshots, ID documents, and evidence photos | ✅ Active |
| 🔔 **Notifications & Alerts** | Real-time alerts for wanted criminals, case updates, and evidence movements | ✅ Active |
| 📝 **Case Linking** | Connect related cases, criminals, and evidence for better investigation | ✅ Active |
| 🔒 **Role-Based Access Control** | Granular permissions for different user roles (Admin, Detective, Officer, Viewer) | ✅ Active |
| 📤 **Export & Reporting** | Generate PDF reports, Excel exports for court proceedings | ✅ Active |

### Analytics & Intelligence

| Feature | Description | Status |
|---------|-------------|--------|
| 📈 **Crime Trends** | Visualize crime patterns over time by type, location, and severity | ✅ Active |
| 🗺️ **Hotspot Mapping** | Geographic visualization of crime concentration areas | ✅ Active |
| 🎯 **Predictive Analytics** | AI-powered insights for crime prediction and resource allocation | 🔄 In Development |
| 📊 **Officer Performance** | Track case resolution rates, response times, and productivity | ✅ Active |
| 🔗 **Network Analysis** | Visualize criminal networks and associations | 🔄 In Development |

---

## 📸 Screenshots

<div align="center">

### Dashboard & Overview

<table>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/home.png" alt="Home Dashboard" width="100%"/>
      <p align="center"><b>Home Dashboard</b><br/>Quick overview of system statistics and recent activities</p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/overview.png" alt="System Overview" width="100%"/>
      <p align="center"><b>System Overview</b><br/>Comprehensive metrics and key performance indicators</p>
    </td>
  </tr>
</table>

### Records Management

<table>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/criminal_profile.png" alt="Criminal Profile" width="100%"/>
      <p align="center"><b>Criminal Profile</b><br/>Detailed criminal records with photos and case history</p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/add_records.png" alt="Add Records" width="100%"/>
      <p align="center"><b>Add New Record</b><br/>Intuitive form for entering new criminal records</p>
    </td>
  </tr>
</table>

### Evidence & Officers

<table>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/evidances.png" alt="Evidence Management" width="100%"/>
      <p align="center"><b>Evidence Management</b><br/>Secure tracking of evidence with chain of custody</p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/officers.png" alt="Officer Management" width="100%"/>
      <p align="center"><b>Officer Management</b><br/>Officer profiles, assignments, and performance tracking</p>
    </td>
  </tr>
</table>

### Analytics & Insights

<table>
  <tr>
    <td align="center">
      <img src="docs/screenshots/analytics.png" alt="Analytics Dashboard" width="100%"/>
      <p align="center"><b>Analytics Dashboard</b><br/>Data-driven insights with interactive charts and crime trend analysis</p>
    </td>
  </tr>
</table>

</div>

---

## 🛠️ Tech Stack

### Backend

```
Language:        Python 3.9+
Framework:       Django 4.2+
API:             Django REST Framework (DRF)
Database:        MYSQL 8+
Authentication:  JWT (JSON Web Tokens)
Storage:         AWS S3 / Local Storage
Task Queue:      Celery + Redis
```

### Frontend

```
Framework:       React 18+
Styling:         Tailwind CSS 3.0+
State:           Redux / Context API
Routing:         React Router v6
HTTP Client:     Axios
Charts:          Recharts / Chart.js
Maps:            Leaflet / Google Maps
UI Components:   Headless UI / shadcn/ui
```

### DevOps & Tools

```
Containerization:  Docker + Docker Compose
CI/CD:             GitHub Actions
Testing:           pytest, Jest, React Testing Library
Code Quality:      ESLint, Prettier, Black, isort
Version Control:   Git + GitHub
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Tailwind)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │ Records  │  │Evidence  │  │Analytics │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (HTTPS)
┌────────────────────────┴────────────────────────────────────┐
│              Backend (Django + DRF)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │  Models  │  │   Views  │  │Serializer│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Criminals   │  │   Evidence   │  │   Officers   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### Prerequisites

- Python 3.9 or higher
- Node.js 16+ and npm/yarn
- PostgreSQL 14+
- Redis (for Celery tasks)
- Git

### Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/Blackjuiceplug/nampol-criminal-db-prototype.git
cd nampol-criminal-db-prototype
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << 'EOF'
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/nampol_db
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_STORAGE_BUCKET_NAME=nampol-evidence

# Redis
CELERY_BROKER_URL=redis://localhost:6379/0
EOF

# Create database
createdb nampol_db

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
# or
yarn install

# Create .env file
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
EOF

# Start development server
npm start
# or
yarn start
```

#### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Admin Panel:** http://localhost:8000/admin

### Using Docker (Recommended for Production)

```bash
# Build and start all services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access at http://localhost:3000
```

---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Django Settings
DEBUG=False
SECRET_KEY=your-super-secret-key-change-this-in-production
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nampol_db

# Security
CORS_ALLOWED_ORIGINS=https://yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com

# File Storage
MEDIA_ROOT=/var/www/media
MEDIA_URL=/media/

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
REACT_APP_MAPS_API_KEY=your_google_maps_api_key
```

---

## 📚 API Documentation

### Authentication

```bash
# Login
POST /api/auth/login/
{
  "username": "officer123",
  "password": "securepassword"
}

# Response
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "officer123",
    "role": "detective"
  }
}
```

### Criminals API

```bash
# List all criminals
GET /api/criminals/

# Get criminal by ID
GET /api/criminals/{id}/

# Create new criminal record
POST /api/criminals/
{
  "first_name": "John",
  "last_name": "Doe",
  "id_number": "85010112345",
  "date_of_birth": "1985-01-01",
  "gender": "M",
  "nationality": "Namibian",
  "physical_description": "Height: 180cm, Build: Medium",
  "criminal_history": "Previous convictions...",
  "photo": "base64_encoded_image"
}

# Update criminal record
PUT /api/criminals/{id}/

# Delete criminal record
DELETE /api/criminals/{id}/
```

### Evidence API

```bash
# List all evidence
GET /api/evidence/

# Create evidence entry
POST /api/evidence/
{
  "case_number": "CASE-2024-001",
  "evidence_type": "Physical",
  "description": "Weapon found at crime scene",
  "location_found": "123 Independence Ave, Windhoek",
  "collected_by": 5,
  "date_collected": "2024-11-12T10:30:00Z",
  "photos": ["base64_image1", "base64_image2"]
}

# Track evidence movement
POST /api/evidence/{id}/transfer/
{
  "transferred_to": 3,
  "reason": "Required for laboratory analysis",
  "location": "Forensic Lab"
}
```

### Analytics API

```bash
# Get crime statistics
GET /api/analytics/statistics/
?start_date=2024-01-01&end_date=2024-12-31

# Get crime trends
GET /api/analytics/trends/
?type=theft&period=monthly

# Get hotspot data
GET /api/analytics/hotspots/
?region=windhoek
```

**Full API Documentation:** Available at `/api/docs/` (Swagger UI)

---

## 🛡️ Security

### Authentication & Authorization

- **JWT-based authentication** with access and refresh tokens
- **Role-Based Access Control (RBAC)** with granular permissions
- **Password hashing** using Django's PBKDF2 algorithm
- **Session management** with automatic timeout
- **Two-Factor Authentication (2FA)** (Planned)

### Data Protection

- **Encryption at rest** for sensitive data
- **HTTPS/TLS** for all data transmission
- **SQL injection prevention** via Django ORM
- **XSS protection** via Content Security Policy
- **CSRF protection** on all state-changing operations

### Audit Trail

- All data modifications are logged with:
  - User ID
  - Timestamp
  - Action performed
  - IP address
  - Changed fields

### Compliance

- **GDPR considerations** for personal data handling
- **Chain of custody** tracking for evidence
- **Data retention policies** (configurable)
- **Backup and disaster recovery** procedures

---

## 🗓️ Roadmap

### Phase 1: Core System (Current - Q4 2024)
- [x] Criminal records management
- [x] Evidence tracking
- [x] Officer management
- [x] Basic analytics dashboard
- [x] User authentication and authorization

### Phase 2: Enhanced Features (Q1 2025)
- [ ] Advanced search with AI-powered suggestions
- [ ] Facial recognition integration
- [ ] Fingerprint matching system
- [ ] Mobile app for field officers
- [ ] Real-time notifications via WebSocket

### Phase 3: Intelligence & Integration (Q2 2025)
- [ ] Predictive analytics with machine learning
- [ ] Criminal network analysis and visualization
- [ ] Integration with national ID database
- [ ] Integration with court management system
- [ ] API for inter-agency data sharing

### Phase 4: Advanced Capabilities (Q3 2025)
- [ ] Voice recognition for reports
- [ ] Automated report generation
- [ ] Multi-language support (English, Oshiwambo, Afrikaans)
- [ ] Advanced geospatial analysis
- [ ] AI-powered case recommendations

---

## 🤝 Contributing

We welcome contributions from developers, law enforcement professionals, and security experts!

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint and Prettier for JavaScript/React code
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and descriptive

### Code Quality Standards

```bash
# Backend
black .                    # Format Python code
isort .                    # Sort imports
flake8                     # Lint code
pytest                     # Run tests

# Frontend
npm run lint              # ESLint
npm run format            # Prettier
npm test                  # Jest tests
```

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ⚠️ Liability and warranty disclaimers apply

---

## 📧 Contact

**Developer:** Felix "Blackjuiceplug" Munjele  
**Email:** mundjelefelix@gmail.com  
**Location:** Windhoek, Namibia 🇳🇦  
**GitHub:** [@Blackjuiceplug](https://github.com/Blackjuiceplug)

### Project Links

- 🐛 [Report Issues](https://github.com/Blackjuiceplug/nampol-criminal-db-prototype/issues)
- 💡 [Request Features](https://github.com/Blackjuiceplug/nampol-criminal-db-prototype/issues/new)
- 📖 [Documentation](https://github.com/Blackjuiceplug/nampol-criminal-db-prototype/wiki)

---

## 🙏 Acknowledgments

- **Namibian Police Force** - For operational insights and requirements
- **Django Community** - For the robust web framework
- **React Community** - For the powerful frontend library
- **Open Source Contributors** - For the tools and libraries that made this possible

---

## ⚖️ Legal & Ethical Considerations

This system is designed to:
- Respect individual privacy rights
- Comply with Namibian data protection laws
- Maintain the presumption of innocence
- Ensure data accuracy and integrity
- Provide transparency and accountability

**Important:** This system should be used responsibly and in accordance with applicable laws and regulations.

---

## 📊 Project Statistics

![GitHub stars](https://img.shields.io/github/stars/Blackjuiceplug/nampol-criminal-db-prototype?style=social)
![GitHub forks](https://img.shields.io/github/forks/Blackjuiceplug/nampol-criminal-db-prototype?style=social)
![GitHub issues](https://img.shields.io/github/issues/Blackjuiceplug/nampol-criminal-db-prototype)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Blackjuiceplug/nampol-criminal-db-prototype)

---

<div align="center">

**Made with ❤️ in Namibia 🇳🇦**

*Empowering Law Enforcement Through Technology*

[⬆ Back to Top](#-nampol-criminal-database-system)

</div>
