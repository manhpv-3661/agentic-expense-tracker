# Expense Tracker – Specification

## Goal

Help individuals track personal income and expenses to better understand monthly spending habits.

## Users

- Individual users who want to manage personal finances.

## Core Features

1. **Create Transactions**

   - Type: Income / Expense
   - Amount, Date, Description
   - Category (Food, Transport, Utilities, etc.)

2. **Categorize Transactions**

   - Users can assign a category for each transaction
   - Option to create custom categories

3. **View Dashboard**

   - Daily, Weekly, Monthly summary of income and expenses
   - Simple charts (optional)

4. **Search & Filter**

   - Filter by date, category, amount

5. **Export**
   - Export transactions as CSV

## Non-Goals

- No bank integration
- No multi-currency support
- No AI-based prediction (optional feature)

## Success Criteria

- Users can easily add transactions in under 30 seconds
- Dashboard loads and displays data within 2 seconds
- Export CSV works for up to 10,000 transactions
- Mobile responsive design

## Constraints

- Must be deployable to Vercel or Cloudflare Workers
- Must support modern browsers (Chrome, Firefox, Safari, Edge)
- No budget constraints (using free tiers)
