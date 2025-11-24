# Small Business Data Automation

## 🌐 Live Website Access
https://fieldflowmanager.org/

A small data-management system designed to keep a landscaping business organized.  
It automatically sorts important business files into clear folders, creates regular
backups to prevent data loss, and keeps old logs tidy so information stays easy
to find and manage.

---

## 🌿 Purpose
Landscaping businesses invoices, job notes, schedules, and other
files every day. This tool keeps those files organized and safely backed up so
the business never loses important information.

## ✨ Features
📊 Dashboard - Total revenue, Total jobs (and completed jobs) ,Total clients,
Completion rate, Total expenses, Net profit, Pending invoices, and some Quick-action buttons


📅 Schedule - Create and manage jobs, Assign jobs to dates, times, and staff, View upcoming 
jobs in a calendar or list format


🧑‍🤝‍🧑 Clients - Adding new clients, Viewing client profiles, Tracking client history (jobs, 
invoices, communications and information)


🧾 Invoices - Creating invoices, Viewing paid, pending, and overdue invoices, Sending invoices
to clients, Connecting payments to jobs


💸Expenses - Adding new expenses, Categorizing spending, Linking expenses to jobs,
Viewing cost summaries


📑 Reports - Financial reports, Job performance reports, Profit/loss summaries,
Client activity reports


## 📌 Project Overview
This project automates the organization, storage, and protection of small-business data.
The system:
Sorts incoming files into appropriate folders (clients, invoices, expenses, schedules, reports)
Stores structured business records in a secure cloud PostgreSQL database
Generates timestamped backups to protect against data loss
Cleans old logs to its maintain system 
Provides a simple web interface for business operations


## 🔐 Project Relevance (Cybersecurity & Forensics)

Although this project is business-focused, it directly overlaps very well with cybersecurity and digital forensics.

✔ Data Integrity -

Automated sorting

backup versioning

and a database schema rules prevent corruption and preserve chronological accuracy which is needed for forensic investigations.

✔ Confidentiality & Privacy -

Role-Based Access Control (RLS) prevents unauthorized data access

Database uses encryption at rest + HTTPS encryption in transit

Data minimization principles reduce risk exposure

✔Availability -

Backups preserve business continuity during:

hardware failure

accidental deletion

ransomware events

system misconfigurations

✔ Forensic Traceability -

Timestamps in logs, backups, and database entries allow investigators to reconstruct events

Organized folder structure makes evidence easier to find

Historical backups serve as immutable snapshots

