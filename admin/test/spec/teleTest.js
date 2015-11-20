(function() {
    'use strict';

    $.extend({
        el: function(el, props) {
            var $el = $(document.createElement(el));
            $el.attr(props);
            return $el;
        }
    });
    $.mockjax({
        url: "*/pizza/api/v1/undefined",
        responseText: {
            status: "success",
            message: JSON.stringify([{
                fname: "FAKE",
                lname: "OBJ",
                email: "nick@nickthesick.com"
            }, {
                fname: "NICK",
                lname: "POST",
                email: "rf@gh.co"
            }, {
                fname: "macaroni",
                lname: "maybe",
                email: "nick@nickthesick.c0"
            }, {
                fname: "yo",
                lname: "maybe",
                email: "nick@nickthesi"
            }]),
        }
    });
    describe('TelePrompter', function() {
        describe('Constructor', function() {
            it('Should exist', function() {
                expect(new Tele()).to.exist;
            });
            it('Should accept an object', function() {
                var table = new Tele({});
                expect(table).to.exist;
            });
        });
    });
})();
