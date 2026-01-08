# Spec-Kit README

## 📋 Purpose

The **spec-kit** folder contains workflow tools, templates, and utilities for managing the development process of the Agentic Expense Tracker project.

## 📁 Structure

```
spec-kit/
├── README.md                 # This file
├── SUMMARY.md               # Project summary and status
├── WORKFLOW.md              # Development workflow guide
├── GIT_COMMIT.md            # Git commit conventions
├── task-manager.py          # Python task management script
├── task-runner.js           # JavaScript task runner
├── features/                # Feature specifications (SDD)
│   ├── README.md           # Features index
│   ├── 01-authentication.md  # Auth & User Management spec
│   ├── 02-categories.md      # Categories Management spec
│   ├── 03-transactions.md    # Transactions Management spec
│   └── 04-dashboard.md       # Dashboard Analytics spec
├── prompts/                 # AI prompts and templates
│   └── ai-prompts.md       # Collection of AI prompts
└── templates/               # Project templates
    └── spec-template.md    # Specification template
```

## 🎯 What This Folder Is For

### 1. **Task Management**

- `task-manager.py` - Python script to track and manage development tasks
- `task-runner.js` - JavaScript task runner for automation

### 2. **Development Workflow**

- `WORKFLOW.md` - Step-by-step workflow for development
- `GIT_COMMIT.md` - Git commit message conventions

### 3. **AI Assistance**

- `prompts/ai-prompts.md` - Reusable AI prompts for common tasks
- Templates for consistent code generation

### 4. **Feature Specifications (SDD)**

- `features/` - Detailed specifications for all features
- `features/README.md` - Index of all feature specs
- Written specs for Authentication, Categories, Transactions, Dashboard

### 5. **Documentation Templates**

- `templates/spec-template.md` - Template for feature specifications
- Standardized format for documentation

## 🚀 Usage

### Task Manager (Python)

```bash
# List all tasks
python spec-kit/task-manager.py list

# Add a new task
python spec-kit/task-manager.py add "Implement user authentication"

# Mark task as complete
python spec-kit/task-manager.py complete 1

# Show task status
python spec-kit/task-manager.py status
```

### Task Runner (JavaScript)

```bash
# Run all tasks
node spec-kit/task-runner.js

# Run specific task
node spec-kit/task-runner.js build

# Watch mode
node spec-kit/task-runner.js watch
```

## 📝 Current Project Status

**Project**: Agentic Expense Tracker
**Status**: ✅ **100% Complete** (All 65 tasks finished)
**Architecture**: NestJS Backend + Next.js Frontend

### Completed Features

- ✅ Backend: 5 modules (Auth, Users, Categories, Transactions, Dashboard)
- ✅ Frontend: 8 pages with shadcn/ui
- ✅ Database: PostgreSQL with TypeORM
- ✅ Authentication: JWT with Passport
- ✅ Documentation: 7 comprehensive guides

### Active Development

- 🔄 Frontend: Installing shadcn/ui dependencies
- 🔄 Frontend: Fixing TypeScript errors

## 🔧 Tools Included

### 1. Task Manager Script

Tracks development tasks, their status, and completion:

- [x] Backend setup
- [x] Database schema
- [x] Authentication
- [x] CRUD operations
- [x] Frontend pages
- [x] UI components

### 2. Workflow Guide

Step-by-step process for:

- Planning features
- Writing specs
- Implementing code
- Testing
- Committing changes
- Deploying

### 3. AI Prompts

Reusable prompts for:

- Code generation
- Bug fixing
- Refactoring
- Documentation
- Testing

### 4. Templates

Standardized templates for:

- Feature specifications
- API documentation
- Component documentation
- Test cases

## 📚 Related Documentation

- **Feature Specs**: `/spec-kit/features/` - Complete feature specifications (reverse-engineered)
- **Main Docs**: `/docs/` - Technical documentation
- **Backend Docs**: `/backend/README.md` - NestJS setup
- **Frontend Docs**: `/frontend/README.md` - Next.js setup
- **Database**: `/docs/schema.sql` - Database schema
- **Testing**: `/docs/TESTING_GUIDE.md` - Testing instructions

## 🎓 Best Practices

1. **Before Starting**: Read `WORKFLOW.md`
2. **When Adding Features**: Use `templates/spec-template.md` to write spec FIRST
3. **Check Existing Specs**: See `features/` for examples
4. **When Committing**: Follow `GIT_COMMIT.md` conventions
5. **When Stuck**: Check `prompts/ai-prompts.md` for AI assistance
6. **Specification-Driven Development**: Write specs before code!

## 🤝 Contributing

This is a template/utility folder. The actual project code is in:

- `/backend/` - NestJS application
- `/frontend/` - Next.js application
- `/docs/` - Project documentation

## 📞 Support

For project-specific help, refer to:

- `PROJECT_COMPLETE.md` - Overall project summary
- `NEXT_STEPS.md` - What to do next
- `docs/TESTING_GUIDE.md` - How to test the application
