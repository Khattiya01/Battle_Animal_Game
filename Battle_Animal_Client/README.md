## Getting Started

Installing
```bash
npm install
```

check env check created database
if local database coppy env.dev to .env.local and env 
if prd database
if local database coppy env.prd to .env.local and env 

setup the database and seeds
1) create a new database
2) run db
```bash
npm run db:generate
npm run db:migrate
npm run db:seeds
```

if setup the database error 
delete file migrations
path : \migrations

run the development server
```bash
npm run dev
```
