$(document).ready(function() {
    $( document ).on( "change", "#company", function() {
        $.post( "/company/exists", { name: $(this).val()})
          .done(function( data ) {
            console.log(data)
        });
    });
});