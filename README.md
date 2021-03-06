# Pizza POS System [![Build Status](https://travis-ci.org/nperez0111/Pizza.svg?branch=master)](https://magnum.travis-ci.org/nperez0111/Pizza) [![Stories in Ready](https://badge.waffle.io/nperez0111/Pizza.svg?label=ready&title=Ready)](http://waffle.io/nperez0111/Pizza)

Pizza Web App, Point of Sale and API
<a href="https://github.com/nperez0111/Pizza"> <img src="images/main.png" width="846"> </a>

## Why all of this?
I was tasked with making a full on POS system and I decided I'd take a crack at it not knowing how much time it was going to take and believe me it was a lot of time to even get this far. This is not one of my best projects but it definitely taught me a lot. 
 * Maybe really look into how hard it is to make the thing you are trying to make
 * Don't focus on bells and whistles when your core functionality doesn't work
 * It's cool to try and think ahead but the more time you think ahead the more time you are not building (I overthink a lot so this is just to myself really)
 * Don't try to build everything yourself - or more succintly, don't reinvent the wheel, building a PHP API RESTful endpoint  was cool and all but definitely was not worth the time it took.I also didn't even build it to half the standard of something else and authentication is just horrid and insecure.
 
 But I made part of the project and maybe one day will be able to remake it properly. Yea this is all unmmaintained code now just way too insecure of stuff.

## Pizza Admin Page

<a href="https://github.com/nperez0111/Pizza/tree/master/admin"> <img src="images/tables.png" width="846"> </a>

This is the admin dashboard of the pizza Api in order to control every aspect to the site. Of course able to change all settings and able to edit databases in a user friendly manner.

<a href="https://github.com/nperez0111/Pizza/tree/master/admin"> <img src="images/builder.png" width="846"> </a>

It also has a Pizza builder made via manipulating an SVG.

<a href="https://github.com/nperez0111/Pizza/tree/master/admin"> <img src="images/selecter.png" width="846"> </a>

It also has a GUI to select and add orders into the API database system in order to place orders.

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
/columns | GET | select multiple columns
/placeOrder | PUT | place an order
/tableName/identifier | POST | Update identifier's row with JSON data
/tableName/identifierRow/value | POST | Update identifierRow with provided value
/tableName | PUT | Add JSON data to tableName
/tableName/identifier | DELETE | Delete row with 'identifier' as the identifier
/login | LOGIN | Obviously Login
/logout | LOGIN | Obviously to Logout

## Install Steps

1. Get Nodejs
2. Save this Repository
3. Open Command line 
4. Get into the admin folder ````cd admin````
5. Install all the dependencies ````npm install````
6. Install bower and grunt command line ````npm install grunt-cli bower````
7. Install bower's dependencies ````bower install````
8. Run the Web Server ````grunt serve````

## As for the API

1. Run the API on a domain
2. Link to the directory of where the api is stored in the ``Base.js`` file
3. Enjoy
 
