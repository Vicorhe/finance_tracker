# Example app with next-sass
This is a personal finance tracking application. 
It leverages Plaid to pull transactions from financial institutions.

## Prequisites
[Node](https://nodejs.org/en/)

[MySQL](https://dev.mysql.com/downloads/mysql/)

[Plaid Developer Account](https://dashboard.plaid.com/signup)

[MySQL Workbench](https://dev.mysql.com/downloads/workbench/) - optional 

## Set Up MySQL Workbench
Import SQL table structure.

## Create a Dedicated User to Access SQL Client
Grant this user the administrative role of DBA.

## Create a user in the user_table
Set an ID and a name.

## Set Environment Variables
Make a copy of `.env.local.example` and rename it to `.env.local`.
Fill in environment variables.

## Run Locally

```bash
npm i
npm run dev
```

