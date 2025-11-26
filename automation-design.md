## Automation Design 

The automation system is designed to:

✔ Automatically sort business files (clients, invoices, expenses, schedules) into clean folders
✔ Generate regular backups to prevent data loss
✔ Remove or archive old logs to keep storage clean
✔ Provide a predictable structure for a small business workflow

## Folder Structure 

The automated system uses the following folder layout:

    Business-Data

    Clients

    Invoices
    
    Expenses
    
    Reports
    
    Schedules
    
    Backups
    
    Logs
    
    Incoming

This keeps all business categories separated, consistent, and easy to navigate.

## File Sorting Automation 

Incoming files (CSV, JSON, PDF, etc.) are first placed in the /Incoming folder.
A PowerShell automation script analyzes each file and moves it into the correct folder based on keywords or filename patterns.

Sorting Rules

File Type     	   Example Filename	      Destination Folder

    Client files	clients_sample.csv	/Clients
    Expense files	expenses_sample.csv	/Expenses
    Invoice files	invoice_2025-01.csv	/Invoices
    Report files	reports_sample.json	/Reports
    Schedule files	schedule_sample.csv	/Schedules

## Backup Automation 

Backups run on a daily or weekly schedule.

Backup Behavior

Creates a timestamped backup folder

Copies all important folders into:

/Backups/YYYY-MM-DD/


Prevents overwriting existing backups

Protects the business from:

Data loss

Accidental changes

System failures

Backup Example

        /Backups
        /2025-11-17
        /Clients
        /Invoices
        /Expenses
        /Reports
        /Schedules



