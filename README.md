```mermaid
graph TD
    A["📘 Financial Ledger Dashboard<br/>GET /ledger<br/><br/>User sees:<br/>• Total Income vs Total Expenses summary<br/>• Recent transactions list<br/>• Filters (by date, type, category)<br/>• Button: Add New Transaction"]

    B["📄 Transaction Details Page (Optional)<br/>GET /transactions/:id<br/><br/>User sees:<br/>• Type (Income or Expense)<br/>• Category<br/>• Amount<br/>• Description<br/>• Transaction Date<br/>• Edit / Delete buttons"]

    E["➕ Add New Transaction Form<br/>POST /transactions<br/><br/>Form fields:<br/>• Type (Income | Expense)<br/>• Category (changes based on selected Type)<br/>• Amount (number)<br/>• Description (text)<br/>• Date (calendar select)<br/>• Submit / Cancel"]

    F["✏️ Edit Transaction Form<br/>PUT /transactions/:id<br/><br/>Pre-filled fields:<br/>• Type (locked or changeable)<br/>• Category<br/>• Amount<br/>• Description<br/>• Date<br/>• Update / Delete / Cancel buttons"]

    I["🗑️ Delete Confirmation<br/>DELETE /transactions/:id<br/><br/>User sees:<br/>• Summary: Type + Amount + Category + Date<br/>• Confirm / Cancel<br/>• Warning: Action cannot be undone"]

    %% Navigation Flow
    A -->|"View details"| B
    A -->|"Add Transaction"| E

    E -->|"Save Successful"| A
    E -->|"Cancel"| A

    B -->|"Edit Transaction"| F
    F -->|"Update Successful"| B
    F -->|"Cancel"| B
    
    B -->|"Delete Transaction"| I
    I -->|"Confirm Delete"| A
    I -->|"Cancel"| B

    B -->|"Back to Dashboard"| A

    %% Styling
    classDef primaryPage fill:#e8f5e8,stroke:#27ae60,stroke-width:3px
    classDef formPage fill:#fff3cd,stroke:#ffc107,stroke-width:2px
    classDef deletePage fill:#f8d7da,stroke:#dc3545,stroke-width:2px

    class A,B primaryPage
    class E,F formPage
    class I deletePage
