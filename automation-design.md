Automation Design

This document explains how the automated data-organization and backup system works for the landscaping business.
The goal is to keep business files organized, backed up, and easy to find without needing manual sorting.

1. Automation Goals

The automation system is designed to:

✔ Automatically sort business files (clients, invoices, expenses, schedules) into clean folders

✔ Generate regular backups to prevent data loss

✔ Remove or archive old logs to keep storage clean

✔ Provide a predictable structure for a small business workflow

2. Folder Structure

The automated system uses the following folder layout:

/Business-Data
    /Clients
    /Invoices
    /Expenses
    /Reports
    /Schedules
    /Backups
    /Logs


This structure keeps all business categories separated and easy to navigate.

3. File Sorting Automation

Incoming files (CSV, JSON, PDF, etc.) are placed in an /Incoming folder.
The automation script checks each file and moves it based on keywords or filename patterns.

Sorting Rules

File Type	Example Name	Destination
Client files	clients_sample.csv	/Clients
Expense files	expenses_sample.csv	/Expenses
Invoice files	invoice_2025-01.csv	/Invoices
Reports	reports_sample.json	/Reports
Schedule files	schedule_sample.csv	/Schedules

This ensures files are never mixed or lost.

4. Backup Automation

Backups run on a daily or weekly schedule.

Backup Behavior

Creates a timestamped backup folder

Copies all important folders into /Backups/YYYY-MM-DD/

Ensures no files are overwritten

Protects the business from data loss, accidental edits, or system failure

Example structure:

/Backups
    /2025-11-17/
        Clients/
        Invoices/
        Expenses/
        Reports/
        Schedules/

5. Log Cleanup Automation

The system automatically:

✔ Compresses old logs

✔ Deletes logs older than a set number of days (example: 30 days)

✔ Keeps storage clean

This prevents unnecessary old files from taking up space.

6. Sample Data Used for Testing

The automation was tested using sample data:

clients_sample.csv

expenses_sample.csv

invoices_sample.csv

reports_sample.json

schedule_sample.csv

These represent real business documents used in a landscaping workflow.

7. Expected Outcome

After running the automation:

✔ All files are correctly sorted
✔ Backups are properly timestamped
✔ Logs are cleaned
✔ Business data stays organized with zero manual effort
