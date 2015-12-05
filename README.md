# Pizza [![Build Status](https://magnum.travis-ci.com/nperez0111/Pizza.svg?token=FShSV6j2VC5qSNKU1zXv)](https://magnum.travis-ci.com/nperez0111/Pizza)

Pizza Web App, Point of Sale and API
## Pizza Admin Page

This is the admin dashboard of the pizza Api in order to control every aspect to the site.

## Pizza API

Currently the API is built out using a REST API made by yours truly,

Methods Available to the API
 - GET -GETTER
  - VIA
   - /tableName
    - /search
     - /identifierRow
     - /identifierRow/value
    - /sortBy
     - /identifierRow
     - /identifierRow/SORT[DESC OR ASC]
 - POST -SETTER
  - VIA
   - /tableName/identifierRow/value
   - /tableName/identifier
 - PUT -ADD
  - VIA
   - /tableName
 - LOGIN
  - VIA
   - /login
 - LOGOUT
  - VIA
   - /logout
