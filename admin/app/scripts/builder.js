var Builder = Ractive.extend({
    oninit: function() {

    },
    url: 'http://' + ((window.location.hostname.split(".").length) === 2 ? "api." + (window.location.hostname) + "/" : (window.location.hostname.split(".").length) === 3 ? ("api." + window.location.hostname.split(".").splice(1, 2).join(".") + "/") : (window.location.hostname + ':80' + '/pizza/api/v1/')),

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
