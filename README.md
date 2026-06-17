## Requisitos

* Node 18+
* Docker
* Ambiente linux (WSL, por exemplo)

### 1. Instruções gerais

```bash
Seguir o passo a passo na ordem
Rodar apenas um comando por vez
Utilizar um ambiente Linux (WSL, por exemplo)
Clonar o repositório
```

### 2. Backend

```bash
cd backend
npm install
Adicionar arquivo ".env" na raiz -> colocar DATABASE_URL="postgresql://postgres:postgres@localhost:5432/engsoft"
docker compose up -d
npx prisma migrate dev
npx prisma generate
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Execução

```bash
Para executar o backend, estar em /backend e rodar o comando "npm run dev"
Para executar o frontend, estar em /frontend e rodar o comando "npm run dev"

Ambos os serviços devem ester rodando para o funcionamento da aplicação
```
