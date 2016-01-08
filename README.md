# Pizza [![Build Status](https://travis-ci.org/nperez0111/Pizza.svg?branch=master)](https://magnum.travis-ci.com/nperez0111/Pizza) [![Stories in Ready](https://badge.waffle.io/nperez0111/Pizza.svg?label=ready&title=Ready)](http://waffle.io/nperez0111/Pizza)

Pizza Web App, Point of Sale and API
## Pizza Admin Page

This is the admin dashboard of the pizza Api in order to control every aspect to the site. Of course able to change all settings and able to edit databases in a user friendly manner.

## Pizza API

Currently the API is built out using a REST API made by yours truly,

### Methods Available to the API
 
 URL | Method | Responses
 ----| ------ | ---------
/tableName | GET | Whole table
/tableName/search/identifierRow | GET | List of rows with identifierRow
/tableName/search/identifierRow/value | GET | List of rows with identifierRow containing value value
/tableName/sortBy/identifierRow | GET | List rows sorted ascending by identifierRow
/tableName/sortBy/identifierRow/SORT[ASC OR DESC] | GET | Same as above but, allows specifying order
/join | GET | allows JOIN Syntax based upon JSON Request
/tableName/identifier | POST | Update identifier's row with JSON data
/tableName/identifierRow/value | POST | Update identifierRow with provided value
/tableName | PUT | Add JSON data to tableName
/tableName/identifier | DELETE | Delete row with 'identifier' as the identifier
/login | LOGIN | Obviously Login
/logout | LOGIN | Obviously to Logout

## Install Steps
1. Get Nodejs
2. Save this Repository somehow
3. Open Command line 
4. Get into the admin folder ````cd admin````
5. Install all the dependencies ````npm install````
6. Install bower and grunt command line ````npm install grunt-cli bower````
7. Install bower's dependencies ````bower install````
8. Run the Web Server ````grunt serve````
