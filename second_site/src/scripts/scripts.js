$(document).ready(function () {
  nunjucks.configure({
    autoescape: true,
    web: {
      async: true
    }
  });

  $.ajax({
    url: "./mockapi/structure.json",
    success: function(data, status) {
      for (item in data.articles) {
        nunjucks.render('./partials/article.html', data.articles[item], function (err, res) {
          $('.js-articles').append(res);
        });
      }
    }
   ,   error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(thrownError);
      }
  });

});

$(".burger").click(function(){
    $(".nav").toggle();
});