var Base = Ractive.extend({
    url: 'http://' + ((window.location.hostname.split(".").length) === 2 ? "api." + (window.location.hostname) + "/" : (window.location.hostname.split(".").length) === 3 ? ("api." + window.location.hostname.split(".").splice(1, 2).join(".") + "/") : (window.location.hostname + ':80' + '/pizza/api/v1/')),
    alerter: function(str, moreInfo) {
        var other = (str.str || str) + "";
        moreInfo = ((moreInfo) ? (moreInfo.join ? moreInfo.join("</p><p>") : moreInfo) : "undefined") + "";
        if (!str.el && ($('#alert').length === 0)) {
            $('#container').prepend('<div id="alert" style="display:none" class="alert alert-danger"></div>');
        }
        $(str.el || '#alert').html("<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><h3>" + (other ? other : "") + "</h3>" + (moreInfo === 'undefined' ? "" : "<p>" + moreInfo + "</p>") + "<p>Check internet connection Or Contact Support.</p>").fadeIn().slideDown();
        return true;
    },
    notify: function(title, message) {
        var that = this,
            not = $.notify({
                title: title,
                message: message !== "-1-" ? message : '<button class="btn btn-default rmv"><span class="glyphicon glyphicon-remove table-remove"></span>Remove Order</button>',
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
        return not;
    },
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
