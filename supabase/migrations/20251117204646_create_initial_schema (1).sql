/*
  # Initial FieldFlow Schema

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - Client's full name
      - `email` (text) - Client's email address
      - `phone` (text) - Client's phone number
      - `address` (text) - Client's address
      - `notes` (text) - Additional notes about client
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `jobs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `client_id` (uuid, references clients)
      - `title` (text) - Job title/description
      - `description` (text) - Detailed job description
      - `status` (text) - Status: scheduled, in_progress, completed, cancelled
      - `scheduled_date` (timestamptz) - When job is scheduled
      - `completed_date` (timestamptz) - When job was completed
      - `amount` (numeric) - Job amount
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `invoices`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `client_id` (uuid, references clients)
      - `job_id` (uuid, references jobs, nullable)
      - `invoice_number` (text) - Unique invoice number
      - `amount` (numeric) - Invoice total amount
      - `status` (text) - Status: draft, sent, paid, overdue
      - `issue_date` (date) - Date invoice was issued
      - `due_date` (date) - Date payment is due
      - `paid_date` (date, nullable) - Date invoice was paid
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'scheduled' NOT NULL,
  scheduled_date timestamptz NOT NULL,
  completed_date timestamptz,
  amount numeric(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  invoice_number text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  status text DEFAULT 'draft' NOT NULL,
  issue_date date DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  paid_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, invoice_number)
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own clients"
  ON clients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients"
  ON clients FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_date ON jobs(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
