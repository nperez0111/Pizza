console.log('\'Allo \'Allo!'); // eslint-disable-line no-console
/*var ractive = new Ractive({
      // The `el` option can be a node, an ID, or a CSS selector.
      el: '#container',

      // We could pass in a string, but for the sake of convenience
      // we're passing the ID of the <script> tag above.
      template: '#template',

      // Here, we're passing in some initial data
      data: { name: 'world' }
    });*/
$.ajax({
    url: 'http://localhost:80/pizza/api/v1/users',
    type: 'PUT',
    dataType: 'json',
    data: JSON.stringify({
        password: "0046788285",
        email: "nick@nickthesi",
        fname: "yo",
        lname: "maybe"
    }),
    //*
    headers: {
        Authorization: "Basic " + btoa("nick@nickthesick.com" + ':' + "0046788285")
    }, //*/
    success: function (data) {
        //document.write(JSON.stringify(data));
        console.log(data);

    },
    error: function (no,textstat,error) {
        console.log(no);
        console.log(no.responseText);
        //console.log(error);
    },
    complete: function (j) {
        if (j.readyState == 4) {
            console.log(j);
        }
    }
});