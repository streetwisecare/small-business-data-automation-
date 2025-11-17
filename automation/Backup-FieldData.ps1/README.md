
This folder contains the automation logic used in the project.

- `Backup-FieldData.ps1`  
  Copies exported job/expense/report files from the website
  export folder into a date-stamped backup folder, generates
  integrity hashes, and deletes backups older than a set number
  of days.

The full web application code (front end and database logic) is
kept in a private repository. This public repository focuses on
the automation and documentation required for the course project.
