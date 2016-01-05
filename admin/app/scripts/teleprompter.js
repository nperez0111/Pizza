var Tele = Base.extend({
    oninit: function() {
        this.getQuickOrders();
        this.on('order', function(event) {
            this.order(event);
        });
        this.on('rmvqueue', function(event) {
            this.rmvqueue(event);
        });
        this.on('build', function(event) {
            this.build(this.get("type")[event.index.cur + (event.index.i * this.get("cols"))].name);

        });
        this.on('checkout', function(event) {
            if (this.get("queue").length === 0) {
                //nothing in queue to order
                return false;
            }
            this.placeOrder(this.get("queue"));
        });
        var that = this;
        $(document).on('keydown', function(e) {
            if (e.shiftKey && e.keyCode === 65) {
                that.placeOrder(that.get("queue"));
            }
        });
        this.getCache("priorities", function() {
            return new Promise(function(resolve, reject) {
                that.sendToDataBase({
                    type: "GET",
                    data: {
                        tables: ["symbols"],
                        from: "ingredients",
                        relations: [
                            ["symbols.Name", "ingredients.Symbol"]
                        ],
                        select: ["symbols.Symbol", "symbols.Name", "ingredients.Priority"]
                    }
                }, "join").then(function(a) {
                    resolve(JSON.stringify(JSON.parse(a).map(function(cur) {
                        cur.Priority = parseInt(cur.Priority, 10);
                        return cur;
                    })));
                }, function(a) {
                    reject(a);
                });
            });
        });
        this.getCache("settings", function() {
            return new Promise(function(resolve, reject) {
                that.sendToDataBase({
                    type: "GET"
                }, "settings").then(function(ob) {
                    ob = JSON.parse(ob);
                    resolve(JSON.stringify(ob.map(function(cur) {
                        var ret = {};
                        ret[cur["keyKey"]] = cur["val"];
                        return ret;
                    }).reduce(function(prev, cur, index, arr) {
                        $.extend(cur, prev);
                        return cur;
                    })));
                }, function(err) {
                    reject(err);
                });
            });
        });
    },
    unrender: function() {
        $(document).off();
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
            var ob = JSON.parse(object)[0];
            that.getPrice(ob.Name).then(function(pri) {
                that.stageOrder($.extend(ob, {
                    Price: pri
                }));
            });

        });
    },
    placeOrder: function(order) {
        if (this.get("queue").length === 0) {
            this.notify("Nothing to Order", "Queue is empty :<", 0, "error");
            return false;
        }
        var that = this,
            str = order.map(function(obj) {
                return that.sortOrder(obj.OrderName);
            }).join(this.cache.settings.splitter);
        return this.getPrice(str).then(function(p) {
            return that.sendToDataBase({
                type: "PUT",
                data: {
                    OrderSymbols: str,
                    Price: p,
                    ID: -1
                }
            }, "orders").then(function(message) {
                that.notify(message, "Order Fulfilled : >");
                that.set("queue", []);
            });
        });


    },
    getPrice: function(order) {
        return new Promise(function(resolve, reject) {
            resolve(order.length);
        });
    },
    stageOrder: function(order) {
        var not = this.notify('Order of <span class="underline">' + order.Name + '</span> has been added successfully!', '<button class="btn btn-default rmv"><span class="glyphicon glyphicon-remove table-remove"></span>Remove Order</button>'),
            that = this;
        $('.rmv').click(function() {

            that.get("queue").every(function(obj, index, arr) {
                if (obj.Name === order.Name) {
                    arr.splice(index, 1);
                    not.close();
                    return false;
                }
                return true;
            });
        });
        return this.get('queue').push(order);
    },
    rmvqueue: function(obj) {
        return this.get("queue").splice(obj.index.i, 1);
    },
    sortOrder: function(order) {
        //return order;
        var special = ["SM", "MD", "LG"];
        //console.log(this.cache.priorities);
        var arr = order.split(this.cache.settings.dbdelimiter).sort(function(a, b) {
            if (special.indexOf(a) > -1) {
                return -1;
            } else {
                return 1;
            }
        });
        return arr.join(this.cache.settings.dbdelimiter);
        //console.log(arr);
        /*/returns the order sorted correctly
        database = this.settings().delimiter;
        //the sort should be accessed from the database within the init method
        //this should access wherever that is stored and properly sort it correctly
        return order.split(database.delimiter).sort(function(a, b) {
            //this is totally just an I think ...
            return this.getPriority().indexOf(a) - this.getPriority().indexOf(b);
        });*/
    },
    builder: {},
    build: function(name) {
        name = name.toLowerCase();
        var buildy, that = this;
        return $.ajax({
            url: "views/builder.html",
            dataType: "html"
        }).then(function(template) {
            buildy = new Builder({
                // The `el` option can be a node, an ID, or a CSS selector.
                el: '#modal',
                template: template,
                oninit: function() {
                    this.getData({}, name + "Headings");
                },
                // Here, we're passing in some initial data
                data: {

                }
            });
            return buildy;
        }, function(err) {
            that.alerter("Sorry, Issues loading template file...");
            return Error(JSON.stringify(err));
        }).then(function(build) {
            that.builder = build;
            $('#moduler').modal('show');
            return build;
        });
    }
});
