# Pizza [![Build Status](https://magnum.travis-ci.com/nperez0111/Pizza.svg?token=FShSV6j2VC5qSNKU1zXv)](https://magnum.travis-ci.com/nperez0111/Pizza)

Pizza Web App, Point of Sale and API
## Pizza Admin Page

This is the admin dashboard of the pizza Api in order to control every aspect to the site.

## Pizza API

Currently the API is built out using a REST API made by yours truly,

## Methods Available to the API
 
 URL | Method | Responses
 ----| ------ | ---------
/tableName | GET | Whole table
/tableName/search/identifierRow | GET | List of rows with identifierRow
/tableName/search/identifierRow/value | GET | ~~List of rows with identifierRow containing value value~~ (Check This)
/tableName/sortBy/identifierRow | GET | List rows sorted ascending by identifierRow
/tableName/sortBy/identifierRow/SORT[ASC OR DESC] | GET | Same as above but, allows specifying order
/tableName/identifier | POST | Update identifier's row with JSON data
/tableName/identifierRow/value | POST | Update identifierRow with provided value
/tableName | PUT | Add JSON data to tableName
/tableName/identifier | DELETE | Delete row with 'identifier' as the identifier
/login | LOGIN | Obviously Login
/logout | LOGIN | Obviously to Logout
