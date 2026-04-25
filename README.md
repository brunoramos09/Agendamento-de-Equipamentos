## Requisitos

* Node 18+
* Docker

### 1. Banco

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
npm install
. env -> colocar DATABASE_URL="postgresql://postgres:postgres@localhost:5432/engsoft"
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```
