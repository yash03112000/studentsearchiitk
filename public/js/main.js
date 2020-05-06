$(document).ready(function() {

    // Place JavaScript code here...
    function searchPartial(form) {
      var formData = $(form).serializeArray();
      $.get('/search_partial', {
        roll: formData[0].value,
        gender:formData[1].value,
        blood: formData[2].value,
        dept: formData[3].value,
        prog: formData[4].value,
        hall: formData[5].value,
        year: formData[6].value,
        home: formData[7].value

      }).then(function (data) {
        $('#search-result').html(data);
      });
    }
  
    window.searchPartial = searchPartial;
  });