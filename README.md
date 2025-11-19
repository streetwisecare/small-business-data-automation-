# Small Business Data Automation

## 🌐 Live Website Access
https://fieldflowmanager.org/

A small data-management system designed to keep a landscaping business organized.  
It automatically sorts important business files into clear folders, creates regular
backups to prevent data loss, and keeps old logs tidy so information stays easy
to find and manage.

---

## 🌿 Purpose
Landscaping businesses generate photos, invoices, job notes, schedules, and other
files every day. This tool keeps those files organized and safely backed up so
the business never loses important information.

## ✨ Features
- Organizes business data into a clean, consistent folder structure  
- Creates daily backup copies to a safe location  
- Keeps older logs archived and tidy  
- Helps ensure important files can be restored when needed  

## 📁 Project Structure
scripts/ → automation files used by the system
docs/ → setup steps, explanations, screenshots, timeline
sample-data/ → optional example invoices

## 📦 Data Storage, Database Structure & Privacy Controls

This section explains how the system stores business information, how the database is structured, and what privacy and security measures protect the data. This connects directly to cybersecurity concepts such as integrity, confidentiality, data retention, and forensic traceability.

1. How Information Is Stored

The project uses two layers of data organization:

A. Local File Storage (Automation System)

The automation scripts organize local business files into a consistent directory layout:

/Business-Data/
   /Clients
   /Invoices
   /Expenses
   /Reports
   /Schedules
   /Logs
   /Backups

Incoming files (CSV, JSON, PDF, images, etc.) are detected and sorted automatically into the correct folder based on keywords.

## 🌐 Database Storage (Web App)

The website portion of the project uses a Supabase PostgreSQL database to store structured business data.

The database includes these tables:

Table	Purpose
clients	Basic customer information (name, contact, address, notes)
invoices	Invoice totals, payment status, due dates
expenses	Business costs such as supplies, gas, labor, etc.
reports	Job summaries and work logs
schedule	Appointments and upcoming jobs

Each record is stored with:

UUID primary keys

Timestamps (created_at, updated_at)

User/session tracking

Validated schema rules

This ensures data is not lost, altered incorrectly, or corrupted.

## 🔐 Data Integrity 
Some of the Data Integrity Controls Include

Schema Validation

Each table defines valid data types (e.g., text, numeric, date).
Invalid entries are rejected automatically.

Timestamps

Every change is recorded with exact time, which is important for:

Tracking updates, Forensic reconstruction, Log correlation

Predictable File Naming

Example:

invoice_2025-01-03_ClientName.pdf  
expense_fuel_2025-01-10.csv  
schedule_2025-01-17.json


Predictable filenames allow:

Easy indexing

Automated sorting

Quick discovery during audits

It Even Has Automated Backups

The system generates timestamped backup directories, ensuring files are never overwritten.
