var table, tele, build, interval;
Ractive.DEBUG = false;
$(document).ready(function() {
    $('#tele').click(teler);
    $('#home').click(home);
    $('#build').click(builde);
    builde();
});

function home(e) {
    pre(e);
    $.ajax({
        url: "views/table.html",
        dataType: "html"
    }).then(function(template) {
            table = new Table({
                // The `el` option can be a node, an ID, or a CSS selector.
                el: '#container',
                template: template,
                // Here, we're passing in some initial data
                data: {
                    rows: ['Some', 'Error', 'Occurred'],
                    add: [],
                    editing: {
                        cur: -1,
                        past: {},
                        notAllowed: [false, false, false]
                    },
                    data: [
                        ["Check", "If", "Connected"],
                        ["To", "The", "Internet"]
                    ],
                    table: "users",
                    tables: ["users", "other", "orders", "MeantToCauseAlert", "tablesPrimaryKeys", "symbols", "quickOrdersPizza", "quickOrdersSalad", "quickOrdersWings", "quickOrdersDrink", "pizzaHeadings"]
                }
            });
            var func = function() {
                table.switchTable({
                    url: table.url + table.get("table"),
                    type: 'GET',
                    dataType: 'json',
                    //*
                    headers: {
                        Authorization: "Basic " + btoa("nick@nickthesick.com" + ':' + "0046788285")
                    }, //*/
                }).then(function() {}, function(err) {
                    clearInterval(interval);
                    table.alerter('Sorry, Issues loading Table Data from API..', "<button id='click' class=' btn btn-default'><span class='glyphicon glyphicon-refresh'></span>Click to retry</button>");
                    $('#click').click(function() {
                        $(this).find('span').addClass("glyphicon-refresh-animate");
                        $("#alert").fadeTo(500, 0).slideUp(500, function() {
                            $(this).remove();
                        });
                        interval = setInterval(func, 12000);
                    });
                    console.log(err);
                });
            };
            interval = setInterval(func, 12000);
            //console.log(interval);
        },
        function(err) {
            table = new Table();
            table.alerter("Sorry, Issues loading template file...");
            return Error(JSON.stringify(err));
        });
}

function teler(e) {
    pre(e);
    return $.ajax({
        url: "views/teleprompter.html",
        dataType: "html"
    }).then(function(template) {
        tele = new Tele({
            // The `el` option can be a node, an ID, or a CSS selector.
            el: '#container',
            template: template,
            // Here, we're passing in some initial data
            data: {
                type: [{
                    name: "Pizza",
                    quickOrders: ["Large eperoni"],
                    buildYourOwn: true
                }, {
                    name: "Wings",
                    quickOrders: ["Spicy buffalo"],
                    buildYourOwn: true
                }, {
                    name: "Salad",
                    quickOrders: ["Regular", "Lechuga"],
                    buildYourOwn: true
                }, {
                    name: "Drink",
                    quickOrders: ["Sprite", "Coke", "Diet Coke", "Materva", "Water"],
                    buildYourOwn: false,
                    images: ["sprite.png", "coke.jpg", "diet_coke.jpg", "materva.png", "water.jpg"]
                }]
            }
        });

    }, function(err) {
        tele = new Tele();
        tele.alerter("Sorry, Issues loading template file...");
        return Error(JSON.stringify(err));
    });

}

function builde(e) {
    pre(e);
    return $.ajax({
        url: "views/builder.html",
        dataType: "html"
    }).then(function(template) {
        build = new Builder({
            // The `el` option can be a node, an ID, or a CSS selector.
            el: '#container',
            template: template,
            // Here, we're passing in some initial data
            data: {

            }
        });

    }, function(err) {
        build = new Builder();
        build.alerter("Sorry, Issues loading template file...");
        return Error(JSON.stringify(err));
    });
}

function pre(e) {
    if (e) {
        e.preventDefault();
        $('.nav li').each(function() {
            $(this).removeClass("active");
        });
        $($(e.target)[0]).parent().addClass("active");
    }
    if (interval) {
        clearInterval(interval);
    }
}
