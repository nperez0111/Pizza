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