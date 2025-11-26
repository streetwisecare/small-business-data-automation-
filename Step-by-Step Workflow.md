Step-by-Step Workflow

1- User uploads or places new files into the /Incoming folder

2- PowerShell script classifies files by type

3- Files are moved into /Clients, /Invoices, /Expenses, or /Schedules

4- File metadata is extracted and added to the Supabase database

5- System triggers a scheduled backup (daily/weekly)

6 -Backup folder created: /Backups/YYYY-MM-DD/

7- Log cleanup removes files older than X days

8 -Website displays data via Supabase queries
