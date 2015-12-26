var Tele = Ractive.extend({
    oninit: function() {
        this.getQuickOrders();
        this.on('order', function(event) {
            this.order(event);
        });
    },
    url: 'http://' + ((window.location.hostname.split(".").length) == 2 ? "api." + (window.location.hostname) + "/" : (window.location.hostname.split(".").length) == 3 ? ("api." + window.location.hostname.split(".").splice(1, 2).join(".") + "/") : (window.location.hostname + ':80' + '/pizza/api/v1/')),
    alerter: function(str, moreInfo) {
        var other = (str.str || str) + "";
        moreInfo = ((moreInfo) ? (moreInfo.join ? moreInfo.join("</p><p>") : moreInfo) : "undefined") + "";
        if (!str.el && ($('#alert').length === 0)) {
            $('#container').prepend('<div id="alert" style="display:none" class="alert alert-danger"></div>');
        }
        $(str.el || '#alert').html("<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><h3>" + (other ? other : "") + "</h3>" + (moreInfo === 'undefined' ? "" : "<p>" + moreInfo + "</p>") + "<p>Check internet connection Or Contact Support.</p>").fadeIn().slideDown();
        return true;
    },
    settings: function() {
        //we will add this functionality in version 2, will be storing settings into a database to make it truly configurable

    },
    types: ["Pizza", "Wings", "Salad", "Drink"],
    getQuickOrders: function() {
        var that = this,
            arry = this.types,
            i = 0;
        //NOT The most sustainable way of doing this will fix once multiple colum selecting is sorted through
        var func = function(ary, x) {
            return that.sendToDataBase({
                type: "GET"
            }, "quickOrders" + ary[x] + "/search/Name").then(function(obj) {

                that.set("type[" + x + "].quickOrders", JSON.parse(obj));

            }, function(e) {
                that.alerter(e);
            });
        };
        func(arry, i).then(function() {
            func(arry, ++i).then(function() {
                func(arry, ++i); //doesnt go a fourth time around to not include drinks...
            });
        });
    },
    order: function(obj) {
        var param = this.get(obj.keypath),
            that = this,
            arry = this.types;
        this.sendToDataBase({
            type: "GET"
        }, "quickOrders" + arry[parseInt(obj.keypath.split(".")[1], 10)] + "/search/Name/" + param).then(function(object) {
            that.stageOrder(JSON.parse(object)[0]);
        }, function(e) {
            that.alerter(e);
        });
    },
    placeOrder: function(order) {
        console.log(order);
    },
    stageOrder: function(order) {
        this.notify("order " + order.Name + " added Successfully!");
        return this.get('queue').push(order);
    },
    notify: function(str) {

    },
    sortOrder: function(order) {
        //returns the order sorted correctly
        database = {
            delimiter: " "
        };
        return order.split(database.delimiter).sort(function(a, b) {
            //this is totally just an I think ...
            return this.getPriority().indexOf(a) - this.getPriority().indexOf(b);
        });
    },
    priorities: [],
    getPriority: function() {
        if (this.priorities.length > 0) {
            return this.priorities;
        }
        this.sendToDataBase({
            type: "GET"
        }, "");

    },
    build: function() {},
    sendToDataBase: function(obj, urlEx) {
        obj = $.extend({
            type: "POST",
            dataType: "json",
            url: this.url + (urlEx ? urlEx : ""),
            headers: {
                Authorization: "Basic " + btoa("nick@nickthesick.com" + ':' + "0046788285")
            }
        }, obj);
        obj.data = $.extend({
            login: {
                Email: "nick@nickthesick.com",
                password: "0046788285"
            }
        }, obj.data);
        console.log(obj);
        if (obj.type == "POST") {
            obj.data = JSON.stringify(obj.data);
        }
        var that = this;
        return $.ajax(obj).then(function(r) {
            console.log(r);
            return ((r.message));
        }, function(err) {
            that.alerter("Sorry, Issues sending Data to API..", err.responseText ? JSON.parse(err.responseText).data : "");
            console.log(err);
            return Error(err);
        });
    }
});
