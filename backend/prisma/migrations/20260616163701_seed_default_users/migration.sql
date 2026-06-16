INSERT INTO "User"
(
  "id",
  "name",
  "email",
  "password",
  "role",
  "createdAt",
  "updatedAt"
)
VALUES
(
  1,
  'Admin',
  'admin@teste.com',
  '123456',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "User"
(
  "id",
  "name",
  "email",
  "password",
  "role",
  "createdAt",
  "updatedAt"
)
VALUES
(
  2,
  'Usuário',
  'user@teste.com',
  '123456',
  'NORMAL',
  NOW(),
  NOW()
)
ON CONFLICT ("email") DO NOTHING;