## Cashly 

![alt text](image.png)

## What is Cashly?
Cashly is an application that provides user with the ability to track their own inflows and outflows. Using the mechanics of making an account, initiating new transactions, and making a budget plan, Cashly is able to perform this action for users. We collaborated on this project to make a financial ledger application that suits users who are interested in part taking personal finance, as well as its a highly used application and contemporary to the finance world. 

## Backend Github Repository 
https://github.com/Ali-2298/financial-ledger-backend

## Libraries and Technologies
MERN Stack, Tailwind CSS. 

## Future Enhancements
In the future, we can enhance this application by visualizing our data through the reports or transactions made under each account. 

## Wireframes
```mermaid
graph TD
    %% Models
    USER["👤 User<br/>Owns accounts, transactions, budgets"]

    ACCOUNT["🏦 Account<br/>Fields:<br/>• accountName<br/>• accountType<br/>• balance<br/>• accountNumber<br/>• owner (User ref)"]

    TRANSACTION["💳 Transaction<br/>Fields:<br/>• type<br/>• category<br/>• description<br/>• amount<br/>• transactionDate<br/>• owner (User ref)<br/>• account (Account ref)"]

    BUDGET["💰 Budget<br/>Fields:<br/>• description<br/>• transactionDate<br/>• balance<br/>• owner (User ref)<br/>• accountId (Account ref)"]

    %% User owns models
    USER --> ACCOUNT
    USER --> TRANSACTION
    USER --> BUDGET

    %% Account CRUD
    ACC_LIST["📄 Account List (Read)<br/>GET /accounts"]
    ACC_ADD["➕ Add Account (Create)<br/>POST /accounts"]
    ACC_EDIT["✏️ Edit Account (Update)<br/>PUT /accounts/:id"]
    ACC_DELETE["🗑️ Delete Account (Delete)<br/>DELETE /accounts/:id"]

    ACCOUNT --> ACC_LIST
    ACC_LIST --> ACC_ADD
    ACC_LIST --> ACC_EDIT
    ACC_LIST --> ACC_DELETE
    ACC_ADD --> ACC_LIST
    ACC_EDIT --> ACC_LIST
    ACC_DELETE --> ACC_LIST

    %% Transaction CRUD
    TRANS_LIST["📄 Transaction List (Read)<br/>GET /transactions<br/>Filtered by account"]
    TRANS_ADD["➕ Add Transaction (Create)<br/>POST /transactions"]
    TRANS_EDIT["✏️ Edit Transaction (Update)<br/>PUT /transactions/:id"]
    TRANS_DELETE["🗑️ Delete Transaction (Delete)<br/>DELETE /transactions/:id"]

    TRANSACTION --> TRANS_LIST
    TRANS_LIST --> TRANS_ADD
    TRANS_LIST --> TRANS_EDIT
    TRANS_LIST --> TRANS_DELETE
    TRANS_ADD --> TRANS_LIST
    TRANS_EDIT --> TRANS_LIST
    TRANS_DELETE --> TRANS_LIST

    %% Budget CRUD
    BUDGET_LIST["📄 Budget List (Read)<br/>GET /budgets<br/>Per account"]
    BUDGET_ADD["➕ Add Budget (Create)<br/>POST /budgets"]
    BUDGET_EDIT["✏️ Edit Budget (Update)<br/>PUT /budgets/:id"]
    BUDGET_DELETE["🗑️ Delete Budget (Delete)<br/>DELETE /budgets/:id"]

    BUDGET --> BUDGET_LIST
    BUDGET_LIST --> BUDGET_ADD
    BUDGET_LIST --> BUDGET_EDIT
    BUDGET_LIST --> BUDGET_DELETE
    BUDGET_ADD --> BUDGET_LIST
    BUDGET_EDIT --> BUDGET_LIST
    BUDGET_DELETE --> BUDGET_LIST

    %% References
    ACC_LIST -->|Transactions belong to account| TRANS_LIST
    ACC_LIST -->|Budgets belong to account| BUDGET_LIST

    %% Styling
    classDef user fill:#ffe8d6,stroke:#ff7f50,stroke-width:3px
    classDef account fill:#e8f5e8,stroke:#27ae60,stroke-width:2px
    classDef transaction fill:#fff3cd,stroke:#ffc107,stroke-width:2px
    classDef budget fill:#d0ebff,stroke:#1c7ed6,stroke-width:2px

    class USER user
    class ACCOUNT,ACC_LIST,ACC_ADD,ACC_EDIT,ACC_DELETE account
    class TRANSACTION,TRANS_LIST,TRANS_ADD,TRANS_EDIT,TRANS_DELETE transaction
    class BUDGET,BUDGET_LIST,BUDGET_ADD,BUDGET_EDIT,BUDGET_DELETE budget
