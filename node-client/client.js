require("jsdom").env("", function (err, window) {
    if (err) {
        console.error(err);
        return;
    }

    var $ = require("jquery")(window);

    $("body").append("<div>TEST</div>");
    console.log($("body").html());

    var url = 'http://127.0.0.1:8081/listUsers';

    $.ajax({
        type: 'get',
        url: url,
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
});



