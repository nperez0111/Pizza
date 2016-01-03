# All DataBases Implementation

## Ingredient DB

ID | Symbol | Priority | Price | Units
---| -------------|--------|---------|--------
Auto Increment | Name of Symbol | Integer | Decimal | Integer

## Symbol DB

 ID | Name | Symbol
 --- | ---- | ------
 Integer | String | String

## Sales DB

 ID | Type | Amount
 ---- | ----- | ------
 Auto Increment | Tiny Int(0=Cash,1=Cred) | Decimal

## User DB
ID | Phone Number | Address | Name | Email | Password
-----| ----------| --------|-------|-------|---------
Auto Increment | String | String | String | String | String

## Orders DB
Id | OrderSymbols | DateOrdered | Price
--------| -------| -----|-----
Integer | String of Symbols | Date?/String | Decimal


## Settings DB
keyKey | val 
------ | -----
String | String

## TablesPrimaryKeys DB
TableName | primaryKeyArr
--------- | -------------
String (table) | String (True/False Array)

## QuickOrders{Drinks | Pizza | Salad | Wings} DB
OrderName | Name
---------- | ----
String (Primary Key) | String (Unique)

## PossibleChoices DB
SymbolID | HeadingID
------- | ---------
ID from symbols table | ID from choiceHeadings table

## choiceHeadings DB
ID | Title
--- | ----
Int | String
