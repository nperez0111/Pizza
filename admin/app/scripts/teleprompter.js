var Tele = Base.extend({
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
    settings: function() {
        //we will add this functionality in version 2, will be storing settings into a database to make it truly configurable
        return {
            dbdelimiter: " ",
            splitter: " , "
        };
    },
    data: function() {
        return {
            cols: 2,
            queue: []
        };
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

        var str = order.map(function(obj) {
                return this.sortOrder(obj.OrderName);
            }).join(this.settings().splitter),
            that = this;
        this.getPrice(str).then(function(p) {
            that.sendToDataBase({
                type: "PUT",
                data: {
                    OrderSymbols: str,
                    Price: p,
                    ID: -1
                }
            }, "orders");
        });


    },
    getPrice: function(order) {
        return new Promise(function(resolve, reject) {
            resolve(order.length);
        });
    },
    notify: function(a, message, c) {
        var bassy = new Base(),
            that = this,
            cur = c;

        bassy.notify(a, message);

        if (message === "-1-") {
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
    stageOrder: function(order) {
        this.notify('Order of <span class="underline">' + order.Name + '</span> has been added successfully!', "-1-", order);
        return this.get('queue').push(order);
    },
    rmvqueue: function(obj) {
        return this.get("queue").splice(obj.index.i, 1);
    },
    sortOrder: function(order) {
        //returns the order sorted correctly
        database = this.settings().delimiter;
        //the sort should be accessed from the database within the init method
        //this should access wherever that is stored and properly sort it correctly
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
    build: function() {}
});
