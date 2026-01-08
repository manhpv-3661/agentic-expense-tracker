# Git Commit Conventions

## 📝 Commit Message Format

Follow the **Conventional Commits** specification for clear and structured commit messages.

### Standard Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Example

```
feat(auth): implement JWT authentication

- Add JWT strategy with Passport
- Create login and register endpoints
- Add password hashing with bcrypt
- Implement token validation middleware

Closes #15
```

---

## 🏷️ Commit Types

| Type       | Description             | Example                                              |
| ---------- | ----------------------- | ---------------------------------------------------- |
| `feat`     | New feature             | `feat(dashboard): add analytics charts`              |
| `fix`      | Bug fix                 | `fix(auth): resolve token expiration bug`            |
| `docs`     | Documentation only      | `docs: update README with setup instructions`        |
| `style`    | Code style/formatting   | `style(frontend): fix indentation in components`     |
| `refactor` | Code refactoring        | `refactor(backend): extract config to separate file` |
| `perf`     | Performance improvement | `perf(api): optimize database queries`               |
| `test`     | Add/update tests        | `test(auth): add unit tests for login`               |
| `chore`    | Maintenance tasks       | `chore: update dependencies`                         |
| `ci`       | CI/CD changes           | `ci: add GitHub Actions workflow`                    |
| `build`    | Build system changes    | `build: configure Webpack`                           |
| `revert`   | Revert previous commit  | `revert: revert "feat(auth): add OAuth"`             |

---

## 🎯 Scope

The scope specifies which part of the codebase is affected:

### Backend Scopes

- `backend` - General backend changes
- `auth` - Authentication module
- `users` - Users module
- `categories` - Categories module
- `transactions` - Transactions module
- `dashboard` - Dashboard module
- `database` - Database/TypeORM changes
- `config` - Configuration changes

### Frontend Scopes

- `frontend` - General frontend changes
- `ui` - UI components
- `pages` - Page components
- `api` - API client changes
- `auth` - Auth context/pages
- `dashboard` - Dashboard pages
- `categories` - Categories pages
- `transactions` - Transactions pages

### Infrastructure Scopes

- `docker` - Docker configuration
- `ci` - CI/CD pipelines
- `deploy` - Deployment scripts
- `deps` - Dependencies

---

## ✍️ Subject Line

- **Use imperative mood**: "add" not "added" or "adds"
- **Don't capitalize first letter**: "add feature" not "Add feature"
- **No period at the end**: "add feature" not "add feature."
- **Keep it short**: Max 50 characters
- **Be descriptive**: Make it clear what changed

### Good Examples ✅

```
feat(auth): add JWT token refresh endpoint
fix(dashboard): resolve chart rendering issue
docs: update deployment guide with Docker steps
refactor(backend): extract database config to separate file
```

### Bad Examples ❌

```
Update stuff
Fixed bug
WIP
asdf
Changed some files
```

---

## 📄 Body (Optional but Recommended)

- Explain **what** and **why**, not **how**
- Use bullet points for multiple changes
- Wrap at 72 characters per line
- Leave a blank line after subject

### Example

```
feat(transactions): add CSV export functionality

- Implement export endpoint in backend
- Add CSV generation with proper formatting
- Add download button in frontend
- Include all transaction fields in export
- Add error handling for large datasets

This allows users to export their transaction history
for external analysis or backup purposes.
```

---

## 🔗 Footer (Optional)

### Reference Issues

```
Closes #123
Fixes #456
Refs #789
```

### Breaking Changes

```
BREAKING CHANGE: API endpoint /auth/login now returns different response format

Before: { token: "..." }
After: { accessToken: "...", refreshToken: "..." }
```

### Multiple References

```
Closes #123, #456
Refs #789
```

---

## 📋 Complete Examples

### Simple Feature

```
feat(categories): add color picker component
```

### Feature with Details

```
feat(dashboard): implement analytics dashboard

- Add summary cards for income, expense, balance
- Implement trends chart with Recharts
- Add category breakdown pie chart
- Add date range filter (week/month/year)
- Implement loading states and error handling

This provides users with visual insights into their
spending patterns and financial health.

Closes #45
```

### Bug Fix

```
fix(auth): resolve token expiration handling

The JWT token was not being properly refreshed when
expired, causing users to be logged out unexpectedly.
Now the token refresh logic correctly handles expired
tokens and maintains user session.

Fixes #67
```

### Refactoring

```
refactor(backend): migrate to centralized configuration

- Move all env vars to config/configuration.ts
- Create factory functions for TypeORM and JWT config
- Remove Express direct usage from controllers
- Add custom @CurrentUser() decorator

This improves code maintainability and follows
NestJS best practices more closely.

Refs #89
```

### Documentation

```
docs: add comprehensive testing guide

- Add manual testing instructions
- Add API testing examples with cURL
- Add common issues and solutions
- Add deployment checklist

This helps developers and users test the application
properly before deployment.
```

### Chore

```
chore(deps): update dependencies to latest versions

- Update NestJS to v11
- Update Next.js to v14
- Update TypeORM to v0.3
- Update all @types packages

All tests passing after update.
```

---

## 🚀 Workflow

### 1. Stage Your Changes

```bash
# Stage specific files
git add backend/src/modules/auth/auth.service.ts

# Stage all changes
git add .

# Stage with interactive mode
git add -p
```

### 2. Write Commit Message

```bash
# Using editor (recommended for long messages)
git commit

# Inline (for short messages)
git commit -m "feat(auth): add JWT authentication"

# With body
git commit -m "feat(auth): add JWT authentication" -m "
- Add JWT strategy with Passport
- Create login endpoint
- Add token validation
"
```

### 3. Review Before Push

```bash
# View commit history
git log --oneline -5

# View last commit details
git show

# Amend last commit (if needed)
git commit --amend
```

### 4. Push to Remote

```bash
# Push to feature branch
git push origin feature/auth-implementation

# Force push (if amended)
git push -f origin feature/auth-implementation
```

---

## 🎨 Commit Message Templates

### Feature Template

```
feat(scope): add [feature name]

- [Implementation detail 1]
- [Implementation detail 2]
- [Implementation detail 3]

[Optional: Why this feature was needed]

Closes #[issue number]
```

### Bug Fix Template

```
fix(scope): resolve [bug description]

[Explanation of what was wrong and how it was fixed]

Fixes #[issue number]
```

### Refactoring Template

```
refactor(scope): [refactoring description]

- [Change 1]
- [Change 2]
- [Change 3]

[Why this refactoring was done]

Refs #[issue number]
```

---

## ✅ Checklist Before Commit

- [ ] Code is working and tested
- [ ] No console.logs or debugging code
- [ ] No commented-out code
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Proper formatting (Prettier/ESLint)
- [ ] Only related changes in commit
- [ ] Commit message follows convention
- [ ] Subject line is clear and concise
- [ ] Body explains context (if needed)
- [ ] Issue reference added (if applicable)

---

## 🔍 Viewing Commit History

```bash
# Pretty log
git log --oneline --graph --decorate --all

# Log with body
git log --format=medium

# Log by author
git log --author="Your Name"

# Log with file changes
git log --stat

# Log for specific file
git log -- path/to/file.ts
```

---

## 💡 Tips

1. **Commit Often**: Small, focused commits are better than large ones
2. **One Purpose Per Commit**: Each commit should do one thing
3. **Test Before Commit**: Ensure code works before committing
4. **Write for Others**: Your future self will thank you
5. **Use Tools**: Git GUI tools can help format messages
6. **Be Consistent**: Follow the same style throughout project

---

## 📚 Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Commit Best Practices](https://chris.beams.io/posts/git-commit/)
- [Angular Commit Convention](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

---

**Remember**: Good commit messages are a love letter to your future self! 💌
