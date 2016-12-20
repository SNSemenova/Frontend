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
        nunjucks.render('./partials/article.html', data, function (err, res) {
            $('.js-articles').append(res);      
        });        
    }
  });

});

$(".burger").click(function(){
    $(".nav").toggle();
});

$(".form").on("submit", function(event) {
  if ($( this ).val() == "") {
    $( ".error-container" ).html("You must fill in this field");
    return false;      
  }
})