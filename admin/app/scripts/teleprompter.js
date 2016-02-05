var Tele = Base.extend({
    oninit: function() {
        this.getQuickOrders();
        this.observe('type', debounce(function() {
            console.log("going the distance");
            var abc = [1, 3];
            abc.forEach((cur) => {
                console.log(cur);
                var b = $($('.panel-body')[cur - 1]);
                var c = $($('.panel-body')[cur]);
                if (b.height() > c.height()) {
                    c.height(b.height());
                } else {
                    b.height(c.height());
                }
            });
        }, 100));
        this.on('order', (event) => {
            this.order(event);
        });
        this.on('rmvqueue', (event) => {
            this.rmvqueue(event);
        });
        this.on('build', (event) => {
            this.build(this.get("type")[event.index.cur].name);
        });
        this.on('show', (event) => {
            $($(event.node).data('target')).modal("show");
        });
        this.on('checkout', (event) => {
            if (this.get("queue").length === 0) {
                //nothing in queue to order
                return false;
            }

            this.placeOrder(this.get("queue"));
        });
        var that = this;
        Mousetrap.bind(this.keyBindings[0], function() {
            that.placeOrder(that.get("queue"));
        });

        this.getCache("priorities", function() {
            return new Promise((resolve, reject) => {
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
                }, "join").then((a) => {
                    resolve(JSON.stringify(JSON.parse(a).map((cur) => {
                        cur.Priority = parseInt(cur.Priority, 10);
                        return cur;
                    })));
                }, (a) => {
                    reject(a);
                });
            });
        });
        this.getCache("settings", function() {
            return new Promise((resolve, reject) => {
                that.sendToDataBase({
                    type: "GET"
                }, "settings").then(JSON.parse, reject).then((ob) => {
                    resolve(JSON.stringify(ob.map((cur) => {
                        var ret = {};
                        ret[cur.keyKey] = cur.val;
                        return ret;
                    }).reduce((prev, cur, index, arr) => {
                        $.extend(cur, prev);
                        return cur;
                    })));
                });
            });
        }, true).then((a) => {
            that.set("cols", parseInt(a.columns, 10));
            return a;
        });
        this.getCache("symbols", function() {
            return new Promise((resolve, reject) => {
                that.sendToDataBase({
                    type: "GET"
                }, "symbols").then(JSON.parse, reject).then((ret) => {
                    resolve(JSON.stringify(ret.map((cur) => {
                        var ret = {};
                        ret[cur.Name] = cur.Symbol;
                        return ret;
                    }).reduce((prev, cur) => {
                        $.extend(cur, prev);
                        return cur;
                    })));
                });
            });
        });
    },
    keyBindings: ['shift+a'],
    data: function() {
        return {
            cols: 2,
            queue: []
        };
        //TODO implement the default types with their settings
    },
    types: ["Pizza", "Wings", "Salad", "Drink"],
    getQuickOrders: function() {
        var obj = {},
            that = this,
            arr = this.types.filter((a) => {
                return a.toLowerCase() !== 'drink';
            });
        arr.forEach((title) => {
            obj["quickOrders" + title] = ["Name"];
        });

        this.getCache("types", function() {
            return that.sendToDataBase({
                    type: "GET",
                    data: obj,
                },
                "columns");
        }, true).then((ret) => {
            for (var i = 0, l = arr.length; i < l; i++) {
                this.set("type[" + i + "].quickOrders", ret["quickOrders" + arr[i]][0]);
            }
            return arr;
        });
    },
    order: function(obj) {
        var param = this.get(obj.keypath),
            arry = this.types;
        this.sendToDataBase({
            type: "GET"
        }, "quickOrders" + arry[parseInt(obj.keypath.split(".")[1], 10)] + "/search/Name/" + param).then((object) => {
            var ob = JSON.parse(object)[0];
            this.getPrice(ob.Name).then((pri) => {
                this.stageOrder($.extend(ob, {
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
        return this.sendToDataBase({
            type: "PUT",
            data: {
                OrderSymbols: order.map((obj) => {
                    return this.sortOrder(obj.OrderName);
                }).join(this.cache.settings.splitter)
            }
        }, "placeOrder").then((message) => {
            this.notify(message, "Order Fulfilled : >");
            this.set("queue", []);
        }, (message) => {
            this.notify("Order Unsuccessful", "No Worries just retry to send the order, Check internet connection.");
        });


    },
    getPrice: function(order) {
        var symboled = this.mapNameToSymbols(order);
        this.logger(symboled);
        return new Promise((resolve, reject) => {
            this.sendToDataBase({
                data: {
                    orderName: symboled
                }
            }, "getPrice").then(JSON.parse, reject).then((o) => {
                resolve(o[0]);
            });
        });
    },
    stageOrder: function(order) {
        var not = this.notify('Order of <span class="underline">' + order.Name + '</span> has been added successfully!', '<button class="btn btn-default rmv"><span class="glyphicon glyphicon-remove table-remove"></span>Remove Order</button>'),
            that = this;
        $('.rmv').click(function() {

            that.get("queue").every((obj, index, arr) => {
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
        var arr = order.split(this.cache.settings.dbdelimiter).sort((a, b) => {

            return this.cache.priorities.indexOf(a) - this.cache.priorities.indexOf(b);

        });
        this.logger(arr);
        return arr.join(this.cache.settings.dbdelimiter);
        //returns the order sorted correctly
        //the sort should be accessed from the database within the init method
        //this should access wherever that is stored and properly sort it correctly

    },
    mapNameToSymbols: function(name) {
        //http://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string
        if (typeof name === 'string' || name instanceof String) {
            name = name.split(this.cache.settings.dbdelimiter);
        }
        return name.map((cur) => {
            return this.cache.symbols[cur] || false;
        }).join(this.cache.settings.dbdelimiter);
    },
    builder: {},
    build: function(name) {
        name = name.toLowerCase();
        var buildy, that = this;
        return $.ajax({
            url: "views/builder.html",
            dataType: "html"
        }).then((template) => {
            buildy = new Builder({
                // The `el` option can be a node, an ID, or a CSS selector.
                el: '#modal',
                template: template,
                inits: function() {
                    this.getLabels(name + "Headings");
                    this.on("checkout", (queue) => {
                        $('#moduler').modal('hide');
                        that.getPrice(queue.join(that.cache.settings.dbdelimiter)).then(function(p) {
                            that.stageOrder({
                                Name: queue.join(that.cache.settings.dbdelimiter),
                                OrderName: that.mapNameToSymbols(queue),
                                Price: p
                            });
                        });
                    });
                },
                // Here, we're passing in some initial data
                data: {

                }
            });
            return buildy;
        }, (err) => {
            that.alerter("Sorry, Issues loading template file...");
            return Error(JSON.stringify(err));
        }).then((build) => {
            that.builder = build;
            $('#moduler').modal('show');
            return build;
        });
    }
});
