# Small Business Data Automation (FieldFlow)

## 🌐 Live Website Access
https://fieldflowmanager.org/

A small data-management system designed to keep a landscaping business organized.  
It will sort the important business files into clearly named folders, make regular
backups to prevent data losses, and keep old logs neat so that information remains
easy to find and manage.

---

## 🌿 Purpose
Every day, a landscaping business invoices, job notes, schedules, and 
many other files. This tool keeps the files organized and safely backed up 
so the business never loses critical information.

## ✨ Features
📊 Dashboard - Total revenue, Total jobs (and completed jobs) ,Total clients,
Completion rate, Total expenses, Net profit, Pending invoices, and some Quick-action buttons


📅 Scheduling - Create and assign jobs; assign jobs to dates, time, and staff;
and display upcoming jobs in calendar or list format.


🧑‍🤝‍🧑 Clients - Adding new clients, Viewing client profiles, Tracking client history (jobs, 
invoices, communications and information)


🧾 Invoices - Creating invoices, Viewing paid, pending, and overdue invoices, Sending invoices
to clients, Connecting payments to jobs


💸Expenses - Adding new expenses, Categorizing spending, Linking expenses to jobs,
Viewing cost summaries


📑 Reports - Financial reports, Job performance reports, Profit/loss summaries,
Client activity reports


## 📌 Project Overview
This project automates organizing, storing, and protecting small-business data.
The system sorts the incoming files into appropriate folders: clients, invoices,
expenses, schedules, reports. It stores structured business records in a secure
cloud PostgreSQL database. It generates timestamped backups, thus protecting 
against data loss. It cleans old logs to maintain the system. It provides a 
simple web interface for business operations.


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


## 🛠️ Methodology


Local Environment:

Windows system used for automation scripts

Web Environment:

Website hosted using modern frontend stack (TypeScript + HTML)

Supabase PostgreSQL database used for structured data storage


Tools, Frameworks & Datasets

Component	                     Purpose

PowerShell-----Automation scripts (sorting, backups, logs)

Supabase (PostgreSQL)------Secure cloud database

TypeScript-----Frontend logic

CSV sample datasets-----Demonstrate file sorting & database imports

Draw.io diagrams-----Workflow visualization

GitHub------Version control + documentation

## Data Flow Diagram 

<img width="512" height="768" alt="Image" src="https://github.com/user-attachments/assets/5fc6234a-0d15-4a2d-af12-1dcf054e09b3" />

## Database Architecture Diagram 

<img width="512" height="768" alt="Image" src="https://github.com/user-attachments/assets/53b6bc6d-1423-4ffd-a6f9-2c519ba85aa2" />


## 🔥 Conclusion 

This project demonstrates how automation and structured data storage can
significantly enhance the security, organization, and reliability of small-business
operations. This system applies cybersecurity concepts like least privilege, encrypted
storage, forensic logging, backups, and data integrity in a simulated real-world operational workflow.
