-- Expense Tracker Database Schema

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'tag',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_category UNIQUE(user_id, name, type)
);

CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Default categories for seeding
INSERT INTO categories (id, user_id, name, type, color, icon, is_default) VALUES
-- These will be inserted per user, this is just a template
-- Expense categories
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'Food & Dining', 'expense', '#EF4444', 'utensils', true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'Transportation', 'expense', '#F59E0B', 'car', true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'Shopping', 'expense', '#EC4899', 'shopping-cart', true),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'Entertainment', 'expense', '#8B5CF6', 'film', true),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'Bills & Utilities', 'expense', '#6366F1', 'file-text', true),
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'Healthcare', 'expense', '#10B981', 'heart', true),
-- Income categories
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'Salary', 'income', '#059669', 'dollar-sign', true),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'Freelance', 'income', '#0891B2', 'briefcase', true),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'Investment', 'income', '#7C3AED', 'trending-up', true),
('00000000-0000-0000-0000-00000000000A', '00000000-0000-0000-0000-000000000000', 'Other Income', 'income', '#06B6D4', 'plus-circle', true);
