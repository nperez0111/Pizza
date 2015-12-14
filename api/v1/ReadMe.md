# All DataBases Implementation

## Ingredient DB

ID | Name | Symbol | Priority | Price | Units
---| --------|-------------|--------|---------|--------
Auto Increment | String | String | Integer | Decimal | Integer

## Sales DB

 ID | Type | Amount
 ---- | ----- | ------
 Auto Increment | Number(0=Cash,1=Cred) | Decimal

## User DB
ID | Phone Number | Address | Name | Email | Password
-----| ----------| --------|-------|-------|---------
Auto Increment | String | String | String | String | String

## Order DB
User Id | Order | Date | Price
--------| -------| -----|-----
Integer | String | Date?/String | Decimal

## TelePrompter DB
 Question | True | False | Order 
-------------|---------|--------|-----------
 Name Please? | 2 | 1 | 1 
 Phone Number Please? | 3 | 2 | 2 
 Delivery? | 4 | 5 | 3 
 Address? | 5 | 3 | 4 
What would you like? | 7 | 5 | 5
