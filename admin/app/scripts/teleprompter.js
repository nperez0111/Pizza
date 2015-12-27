var Tele = Ractive.extend({
    oninit: function() {
        this.getQuickOrders();
        this.on('order', function(event) {
            this.order(event);
        });
        this.on('rmvqueue', function(event) {
            this.rmvqueue(event);
        });
        this.on('checkout', function(event) {
            if (this.get("queue").length === 0) {
                //nothing in queue to order
                return;
            }
            this.placeOrder(this.get("queue"));
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
        return {
            dbdelimiter: " "
        };
    },
    data: {
        cols: 2,
        queue: []
            //TODO implement the default types with their settings
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
        this.notify('Order of <span class="underline">' + order.Name + '</span> has been added successfully!', "", order);
        return this.get('queue').push(order);
    },
    notify: function(title, message, order) {
        var that = this,
            cur = order,
            not = $.notify({
                title: title,
                message: message !== "" ? message : '<button class="btn btn-default rmv"><span class="glyphicon glyphicon-remove table-remove"></span>Remove Order</button>',
                type: 'info'
            }, {
                type: 'minimalist',
                delay: 5000,
                placement: {
                    from: "bottom",
                    align: "right"
                },
                template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button><img data-notify="icon" class="img-circle pull-left">' +
                    '<span data-notify="title">{1}</span>' +
                    '<span data-notify="message">{2}</span>' +
                    '</div>'
            });
        if (message === "") {
            $('.rmv').click(function() {

                that.get("queue").every(function(obj, index, arr) {
                    if (obj.Name === cur.Name) {
                        arr.splice(index, 1);
                        not.close();
                        return false;
                    }
                    return true;
                });
            });
        }
    },
    rmvqueue: function(obj) {
        return this.get("queue").splice(obj.index.i, 1);
    },
    sortOrder: function(order) {
        //returns the order sorted correctly
        database = this.settings().delimiter;
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
            return Error(JSON.stringify(err));
        });
    }
});
