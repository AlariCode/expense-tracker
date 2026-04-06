# План: JWT-авторизация в NestJS backend с CQRS

## Контекст

Backend — свежий NestJS 11 скелет без моделей и модулей. Нужно добавить систему авторизации: модуль пользователя (User) и модуль аутентификации (Auth) с JWT. Взаимодействие между модулями — через CQRS (`@nestjs/cqrs`): Commands для мутаций, Queries для чтения.

## 1. Установка зависимостей

```bash
cd backend
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer @nestjs/cqrs
npm install -D @types/passport-jwt @types/bcrypt
```

## 2. Переменные окружения

Добавить в `.env` и `.env.example`:

```
JWT_SECRET="your-strong-secret-key-change-in-production"
JWT_EXPIRATION="1d"
```

## 3. Prisma — модель User

Файл: `backend/prisma/schema.prisma`

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

Затем: `npx prisma migrate dev --name add-user-model`

## 4. Структура файлов

```
src/
  prisma/
    prisma.module.ts                — @Global модуль, экспортирует PrismaService
    prisma.service.ts               — extends PrismaClient, $connect() в onModuleInit
  user/
    user.module.ts                  — регистрирует CqrsModule, хэндлеры, репозиторий
    user.repository.ts              — Prisma-запросы к таблице users
    commands/
      create-user.command.ts        — Command: { name, email, password }
      create-user.handler.ts        — хэширует пароль, вызывает repository.create()
    queries/
      get-user-by-email.query.ts    — Query: { email }
      get-user-by-email.handler.ts  — вызывает repository.findByEmail()
      get-user-by-id.query.ts       — Query: { id }
      get-user-by-id.handler.ts     — вызывает repository.findById()
    dto/
      create-user.dto.ts            — name, email, password с валидаторами
  auth/
    auth.module.ts                  — импортирует UserModule, CqrsModule, JwtModule.registerAsync
    auth.controller.ts              — POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
    auth.service.ts                 — register, login, generateToken (использует CommandBus/QueryBus)
    strategies/
      jwt.strategy.ts               — PassportStrategy, извлекает Bearer token
    guards/
      jwt-auth.guard.ts             — AuthGuard('jwt')
    decorators/
      current-user.decorator.ts     — param decorator для request.user
    dto/
      register.dto.ts               — name, email, password
      login.dto.ts                  — email, password
```

## 5. CQRS: детали реализации

### User module — Commands

**CreateUserCommand** — создание пользователя:

```typescript
// create-user.command.ts
export class CreateUserCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}

// create-user.handler.ts — @CommandHandler(CreateUserCommand)
// Хэширует пароль через bcrypt.hash(password, 10)
// Вызывает userRepository.create({ name, email, password: hashedPassword })
// Возвращает User (без пароля)
```

### User module — Queries

**GetUserByEmailQuery** — поиск по email:

```typescript
// get-user-by-email.query.ts
export class GetUserByEmailQuery {
  constructor(public readonly email: string) {}
}
// handler вызывает userRepository.findByEmail(email)
```

**GetUserByIdQuery** — поиск по id:

```typescript
// get-user-by-id.query.ts
export class GetUserByIdQuery {
  constructor(public readonly id: number) {}
}
// handler вызывает userRepository.findById(id)
```

### Auth module — использование шин

**AuthService** вместо прямого вызова UserService использует CommandBus и QueryBus:

```typescript
// auth.service.ts
class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Проверяем существование через QueryBus
    const existing = await this.queryBus.execute(new GetUserByEmailQuery(dto.email));
    if (existing) throw new ConflictException('User already exists');
    // Создаём через CommandBus
    const user = await this.commandBus.execute(
      new CreateUserCommand(dto.name, dto.email, dto.password),
    );
    return {
      accessToken: this.generateToken(user),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.queryBus.execute(new GetUserByEmailQuery(dto.email));
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      accessToken: this.generateToken(user),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
```

### UserModule — регистрация хэндлеров

```typescript
@Module({
  imports: [CqrsModule],
  providers: [UserRepository, CreateUserHandler, GetUserByEmailHandler, GetUserByIdHandler],
  exports: [CqrsModule], // чтобы AuthModule мог использовать шины
})
export class UserModule {}
```

## 6. Модификация существующих файлов

- **`src/app.module.ts`** — imports: ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UserModule, AuthModule
- **`src/main.ts`** — добавить ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })

## 7. Связи модулей

```
AppModule → ConfigModule (global), PrismaModule (global), UserModule, AuthModule
UserModule → CqrsModule, UserRepository, CommandHandlers, QueryHandlers
AuthModule → UserModule, CqrsModule, JwtModule
AuthController → AuthService → CommandBus/QueryBus → Handlers → UserRepository → PrismaService
```

## 8. Порядок реализации

1. Установить зависимости (включая @nestjs/cqrs)
2. Обновить .env / .env.example
3. Добавить модель User в Prisma, запустить миграцию
4. Создать PrismaModule + PrismaService
5. Создать User модуль: repository → commands → queries → module
6. Создать Auth модуль: dto → strategy → guard → decorator → service → controller → module
7. Обновить AppModule и main.ts

## 9. Верификация

- `npm run build` в backend — компилируется без ошибок
- `npm run start:dev` — сервер стартует
- `POST /api/auth/register` с `{ name, email, password }` — возвращает `{ accessToken, user }`
- `POST /api/auth/login` с `{ email, password }` — возвращает `{ accessToken, user }`
- `GET /api/auth/me` с `Authorization: Bearer <token>` — возвращает данные пользователя
- Повторная регистрация с тем же email — 409 Conflict
- Неверный пароль при логине — 401 Unauthorized
