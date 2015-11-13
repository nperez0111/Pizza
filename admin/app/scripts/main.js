$.mockjax({
    url: "*/pizza/api/v1/other",
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
var Table = Ractive.extend({

    oninit: function (options) {
        //add the on handlers
        this.on('add', function (event) {
            this.add(event);
        });
        this.on('edit', function (event) {
            this.edit(event);
        });
        this.on('revert', function (event) {
            this.revert(event);
        });
        this.on('delete', function (event) {
            this.delete(event);
        });
        this.on('save', function (event) {
            this.save(event);
        });
        this.observe("table", function (newVal, oldVal, obj) {
            this.switchTable({
                url: 'http://localhost:80/pizza/api/v1/' + newVal,
                type: 'GET',
                dataType: 'json',
                //*
                headers: {
                    Authorization: "Basic " + btoa("nick@nickthesick.com" + ':' + "0046788285")
                }, //*/
            });
            //console.log(obj+" changed from "+oldVal+" to "+newVal);
        });
        //find a way to initialize the data object

    },
    add: function (obj) {
        var itemToAdd = this.get('add'),
            missing = false;
        $(obj.node).html("<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Loading...");
        //$(obj.node);
        $('tfoot tr th input').each(function (i) {
            if (itemToAdd.length < i || !itemToAdd[i]) {
                $(this).addClass("missing");
                missing = true;
            } else {
                $(this).removeClass("missing");
            }
        });
        if (missing) {
            $(obj.node).html('<span class="glyphicon glyphicon-ok"></span> Add');
            return;
        }
        this.set("add", []);
        this.get('data').push(itemToAdd);
        $(obj.node).html('<span class="glyphicon glyphicon-floppy-saved"></span> Add');
        //actually send data to server
    },
    edit: function (e) {
        var row = e.index.r,
            col = e.index.c,
            preEdit = e.context;
        if (this.get("editing.notAllowed")[col]) {
            return;
        }
        if (!this.get("editing.past")[row]) {
            this.set("editing.past." + row, this.get("data[" + row + "]"));
        }
        this.set("editing.cur", row);
    },
    revert: function (obj) {
        this.set("editing.cur", -1);
        var prev = this.get("editing.past"),
            row = obj.index.r,
            cur = $($($("tbody tr").get(row)).find("td")),
            to = this.get("data[" + row + "]");
        delete prev[row];
        this.set("editing.past", prev);
        cur.each(function (i) {
            if ($(this).text() !== (to[i] + "")) {
                $(this).text(to[i]);
            }
        });
    },
    delete: function (obj) {
        var rowOfDeletion = obj.index.r;
        this.get("data").splice(rowOfDeletion, 1);
    },
    save: function (obj) {
        this.set("editing.cur", -1);
        var row = obj.index.r,
            previous = this.get("editing.past"),
            data = this.get("data"),
            cur = $($($("tbody tr").get(row)).find("td")),
            arr = [],
            flag = true; //assume they are the same
        cur.each(function (i) {

            if (i < previous[row].length) {
                arr.push($(this).text());
                if ($(this).text() !== (previous[row][i]) + "") {
                    flag = false;
                    //they are different
                }
            }
        });
        if (flag) {
            //are the same do nothing
            console.log("no changes");
            console.log(arr);
            console.log(previous[row]);
        } else {
            //send to database to update val
            console.log("changes observed");
            console.log(arr);
            console.log(previous[row]);
        }
        delete previous[row];
        this.set("editing.past." + row, previous);
        //find a way of tracking what has even been edited
    },
    alert:function(str){
      $('#alert').slideDown().html("<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><h3>"+str+"</h3><p>Check internet connection Or Contact Support.</p>")  
    },
    switchTable: function (obj) {
        var that=this;
        return $.ajax(obj).then(function (r) {
            
            return (JSON.parse(r.message));

        }, function (err) {
            that.alert("Sorry, Issues loading Table Data from API..");
            return Error(err);
        }).then(function (objs) {

            var arr = [],
                arry = [];

            for (var i in objs) {

                for (var key in objs[i]) {
                    arry.push(objs[i][key]);
                }

                arr.push(arry);
                arry = [];

            }
            for (var key in objs[0]) {
                arry.push(key);
            }
            that.set("data", arr);
            that.set("rows", arry);
            var ret = arr.slice(0).unshift(arry);
            return ret;
        }).then(function (data) {
            switch (table.get("table")) {
            case "users":
                that.set("editing.notAllowed", [false, false, true]);
                break;
            }
            return data;
        });
    }
});
var table;
$.ajax({
    url: "http://localhost:9000/table.html",
    dataType: "html"
}).then(function (template) {
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
            tables: ["users", "other", "MeantToCauseAlert"]
        }
    });

}, function (err) {
    $('#alert').slideDown().html("<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><h3>Sorry, Issues loading template file..</h3></div><p>Check internet connection Or Contact Support.</p>");
    return Error(err);
});

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}