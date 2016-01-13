var table, tele, build, interval;
Ractive.DEBUG = false;

function pre(e, str) {
    if (e) {
        e.preventDefault();
    }
    if (interval) {
        clearInterval(interval);
    }
    if ($(str).parent().hasClass("active")) {
        return false;
    }
    if (e) {
        $('.nav li').each(function() {
            $(this).removeClass("active");
        });
        $($(e.target)[0]).parent().addClass("active");
    }
    return true;
}

function home(e) {
    if (pre(e, '#home') === false) {
        return;
    }


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
                    tables: ["users", "other", "orders", "transactions", "MeantToCauseAlert", "settings", "tablesInfo", "symbols", "quickOrdersPizza", "quickOrdersSalad", "quickOrdersWings", "quickOrdersDrink", "pizzaHeadings", "ingredients"]
                }
            });
            var func = function() {
                table.switchTable({
                    type: 'GET'
                }, table.get("table")).then(function() {}, function(err) {
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
    if (pre(e, '#tele') === false) {
        return;
    }

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
    if (pre(e, '#build') === false) {
        return;
    }
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



$(document).ready(function() {
    $('#tele').click(teler);
    $('#home').click(home);
    $('#build').click(builde);
    builde();
});
