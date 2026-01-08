# NestJS Architecture Standards

This project follows **official NestJS best practices** and **modular architecture patterns**.

## 📁 Project Structure

```
backend/src/
├── config/                      # Configuration files (centralized)
│   ├── configuration.ts         # Main config loader
│   ├── database.config.ts       # Database configuration factory
│   └── jwt.config.ts           # JWT configuration factory
├── common/                      # Shared resources
│   ├── decorators/             # Custom decorators (@CurrentUser)
│   ├── guards/                 # Custom guards (optional)
│   ├── filters/                # Exception filters (optional)
│   ├── interceptors/           # Interceptors (optional)
│   └── pipes/                  # Custom pipes (optional)
├── modules/                     # Feature modules
│   ├── users/
│   │   ├── entities/           # TypeORM entities
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── users.service.ts    # Business logic
│   │   ├── users.controller.ts # HTTP routes
│   │   └── users.module.ts     # Module definition
│   ├── auth/
│   │   ├── strategies/         # Passport strategies
│   │   ├── guards/            # Auth guards
│   │   ├── dto/
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   ├── categories/
│   ├── transactions/
│   └── dashboard/
├── types/                       # TypeScript type definitions
│   └── express.d.ts            # Express Request augmentation
├── app.module.ts               # Root module
└── main.ts                     # Application entry point
```

## 🎯 NestJS Best Practices Applied

### 1. **Configuration Management**

✅ **Centralized configuration** using `@nestjs/config`

- Single source of truth in `config/configuration.ts`
- Type-safe configuration access via nested objects
- Environment-specific settings
- Factory functions for module configs

```typescript
// ❌ BAD: Direct process.env access
const port = process.env.PORT;

// ✅ GOOD: ConfigService with typed access
const port = configService.get<number>("port");
```

### 2. **Module Organization**

✅ **Feature-based modules** (not layer-based)

- Each module is self-contained
- Clear module boundaries
- Dependency injection between modules
- Exports only what's needed

```typescript
// ❌ BAD: Monolithic structure
src/
├── controllers/
├── services/
└── entities/

// ✅ GOOD: Modular structure
src/modules/
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
└── auth/
```

### 3. **Decorators Over Middleware**

✅ **Use NestJS decorators** instead of Express directly

```typescript
// ❌ BAD: Using Express Response directly
@Get('export')
async export(@Res() res: Response) {
  res.header('Content-Type', 'text/csv');
  res.send(data);
}

// ✅ GOOD: Using NestJS @Header decorator
@Get('export')
@Header('Content-Type', 'text/csv')
@Header('Content-Disposition', 'attachment; filename="data.csv"')
async export(): Promise<string> {
  return data;
}
```

### 4. **Custom Decorators**

✅ **Create reusable decorators** for common patterns

```typescript
// ❌ BAD: Accessing request directly
@Get('me')
getProfile(@Req() req: Request) {
  return req.user;
}

// ✅ GOOD: Custom decorator
@Get('me')
getProfile(@CurrentUser() user: User) {
  return user;
}
```

### 5. **Type Safety**

✅ **Proper TypeScript types** everywhere

- No `any` types
- Type augmentation for Express (`types/express.d.ts`)
- DTOs with validation decorators
- Return type annotations

```typescript
// ❌ BAD: No type safety
async findAll(userId, filters): Promise<any> {
  // ...
}

// ✅ GOOD: Strict typing
async findAll(
  userId: string,
  filters: FilterTransactionDto
): Promise<TransactionListResponse> {
  // ...
}
```

### 6. **Dependency Injection**

✅ **Constructor-based DI** (NestJS standard)

```typescript
// ❌ BAD: Manual instantiation
const service = new UsersService();

// ✅ GOOD: Constructor injection
constructor(
  private readonly usersService: UsersService,
  private readonly configService: ConfigService,
) {}
```

### 7. **Guards & Strategies**

✅ **Passport integration** with proper strategy pattern

```typescript
// JWT Strategy validates tokens
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("jwt.secret"),
    });
  }
}

// Guard applies strategy to routes
@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {}
```

### 8. **Configuration Factories**

✅ **Async module registration** with factories

```typescript
// ❌ BAD: Inline configuration
JwtModule.register({
  secret: "hardcoded",
  signOptions: { expiresIn: "7d" },
});

// ✅ GOOD: Factory with ConfigService
JwtModule.registerAsync({
  useFactory: getJwtConfig,
  inject: [ConfigService],
});
```

### 9. **DTOs with Validation**

✅ **class-validator** for automatic validation

```typescript
export class CreateTransactionDto {
  @IsIn(["income", "expense"])
  type: "income" | "expense";

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsDateString()
  date: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

### 10. **Global Pipes**

✅ **ValidationPipe** configured globally in `main.ts`

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip non-DTO properties
    forbidNonWhitelisted: true, // Throw error on extra properties
    transform: true, // Auto-transform types
  })
);
```

## 🚫 Anti-Patterns Avoided

### ❌ Don't use Express types directly

```typescript
// BAD
import { Request, Response } from "express";

// GOOD
import type { Request } from "express"; // Only for type augmentation
// Use @CurrentUser() decorator instead
```

### ❌ Don't bypass NestJS request/response cycle

```typescript
// BAD
@Get()
getData(@Res() res: Response) {
  res.json(data); // Bypasses NestJS interceptors
}

// GOOD
@Get()
getData(): DataDto {
  return data; // Let NestJS handle serialization
}
```

### ❌ Don't hardcode configuration

```typescript
// BAD
const secret = "my-secret";

// GOOD
const secret = configService.get<string>("jwt.secret");
```

### ❌ Don't mix concerns

```typescript
// BAD: Business logic in controller
@Controller("users")
export class UsersController {
  @Get()
  async findAll() {
    // Database queries here
  }
}

// GOOD: Delegate to service
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
```

## 📚 Official References

- [NestJS Documentation](https://docs.nestjs.com/)
- [Configuration](https://docs.nestjs.com/techniques/configuration)
- [Database](https://docs.nestjs.com/techniques/database)
- [Authentication](https://docs.nestjs.com/security/authentication)
- [Validation](https://docs.nestjs.com/techniques/validation)
- [Custom Decorators](https://docs.nestjs.com/custom-decorators)

## ✅ Compliance Checklist

- [x] Modular architecture with feature modules
- [x] Centralized configuration management
- [x] Type-safe everywhere (no `any`)
- [x] Custom decorators for common patterns
- [x] Proper use of NestJS decorators over Express
- [x] Constructor-based dependency injection
- [x] DTOs with validation decorators
- [x] Global validation pipe
- [x] Passport strategies for auth
- [x] Configuration factories for async modules
- [x] No direct Express usage in controllers
- [x] Separation of concerns (controller → service → repository)

## 🎓 Key Principles

1. **Convention over Configuration**: Follow NestJS naming and structure conventions
2. **Dependency Injection**: Always use DI, never instantiate manually
3. **Type Safety**: Leverage TypeScript to its fullest
4. **Modularity**: Keep modules focused and independent
5. **Decorators**: Use NestJS decorators, not Express middleware
6. **Configuration**: Centralize and type-safe all configs
7. **Validation**: Automatic validation at boundaries (DTOs)
8. **Guards**: Declarative authorization with guards
9. **Interceptors**: Use for cross-cutting concerns
10. **Testing**: Structure enables easy unit testing

---

**This architecture ensures:**

- ✅ Maintainability
- ✅ Scalability
- ✅ Testability
- ✅ Type safety
- ✅ NestJS idiomatic code
