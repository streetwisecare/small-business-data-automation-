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

## Backup Behavior

Creates a timestamped backup folder

Copies all important folders into:

/Backups/YYYY-MM-DD/

Prevents overwriting existing backups

Protects the business from:

Data loss

Accidental changes

System failures

## Backup Example

        /Backups
        /2025-11-17
        /Clients
        /Invoices
        /Expenses
        /Reports
        /Schedules

## Expected Outcome 
Expected Outcome

After running the automation:

✔ All files are correctly sorted

✔ Backups are properly timestamped

✔ Logs are cleaned

✔ Business data remains organized with zero manual effort

## Database Scema Diagram 

 <img width="640" height="790" alt="Image" src="https://github.com/user-attachments/assets/dae5d87f-ad9a-41b5-b5c4-54403a740de9" />

## Folder Structure Diagram

<img width="640" height="790" alt="Image" src="https://github.com/user-attachments/assets/b53c15ba-85db-45c4-9c83-11f7f149c9d5" />

## Workflow Diagram 

<img width="640" height="790" alt="Image" src="https://github.com/user-attachments/assets/10b78ee0-c3f5-4aa7-8bf6-b3fcccdd82dd" />



