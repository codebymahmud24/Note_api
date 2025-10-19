# 📝 Notes App Backend

A **NestJS backend** for a Notes application featuring JWT authentication, note CRUD, tag management, and Dockerized deployment with PostgreSQL.

---

## 🚀 Features

- **User Authentication**
  - Register & login with **JWT**
- **Notes Management**
  - Create, read, update, delete notes
  - Pin & archive notes
- **Tag Management**
  - Add, remove, assign tags
  - Filter notes by tags
- **Search & Pagination**
  - Search notes by title
  - Pagination for notes listing
- **Swagger API Documentation**
  - Auto-generated documentation for all endpoints

---

## 🛠 Tech Stack

| Layer                  | Technology       |
|------------------------|----------------|
| Backend                | NestJS, TypeScript |
| ORM                    | Drizzle ORM     |
| Database               | PostgreSQL      |
| Authentication         | JWT             |
| Validation             | class-validator |
| Containerization       | Docker & Docker Compose |
| API Documentation      | Swagger         |

---

## 🗂 Project Structure

src/

├── auth/ # JWT Authentication modules

├── notes/ # Notes CRUD, pin & archive

├── tags/ # Tag management

├── db/ # Database & schema managemen

├── common/ # DTOs, validators, pipes

└── main.ts # App entry


---

## 📦 Getting Started

### Prerequisites

- Node.js >= 18.x  
- Docker & Docker Compose  

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/codebymahmud24/Note_api
cd <repo-folder>


Create .env file

DATABASE_URL=postgres://postgres:postgres@localhost:5432/notes_db
JWT_SECRET=your_jwt_secret
PORT=3000

⚡ Useful Commands
# Run backend locally
npm run start

# Run in production
npm run build
npm run start:prod

# Run dockerized app
docker-compose up --build

# Stop containers
docker-compose down

```

### 🔗 Services

Backend: http://localhost:3000

PostgreSQL: Port 5432

Swagger API Documentation: http://localhost:3000/api/docs

📸 Screenshots
<img width="1900" height="879" alt="Swagger UI" src="https://github.com/user-attachments/assets/a7af9115-2cb3-4214-8afd-1f814957c388" />
