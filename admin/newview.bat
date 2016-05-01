@echo off
set arg1=%1
 touch "app/scripts/%arg1%.js"
 echo var %arg1% = Base.extend( {oninit: function () {},data: function () {}} ); >> "app/scripts/%arg1%.js"
 touch "app/views/%arg1%.html"
 echo Good Luck kiddo >> "app/views/%arg1%.html"
 subl "app/scripts/%arg1%.js"
 call brackets "app/views/%arg1%.html"