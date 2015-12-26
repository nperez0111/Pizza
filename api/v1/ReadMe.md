# All DataBases Implementation

## Ingredient DB

ID | Symbol | Priority | Price | Units
---| -------------|--------|---------|--------
Auto Increment | Integer of Symbol | Integer | Decimal | Integer

## Symbol DB

 ID | Name | Symbol
 --- | ---- | ------
 Integer | String | String

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
Integer | String of Symbols | Date?/String | Decimal

## TelePrompter DB
 Question | True | False | Order 
-------------|---------|--------|-----------
String | Integer of Order | Integer of Order | Integer
 Name Please? | 2 | 1 | 1 
 Phone Number Please? | 3 | 2 | 2 
 Delivery? | 4 | 5 | 3 
 Address? | 5 | 3 | 4 
What would you like? | 7 | 5 | 5

## Specials DB
Name | Order String | Price
-----| ------------ | -----
String | String of Symbols | Decimal

## quickOrders{Drinks | Pizza | Salad | Wings}
OrderName | Name
---------- | ----
String (Primary Key) | String (Unique)
