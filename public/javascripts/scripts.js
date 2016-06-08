/**
 * Created by rhoeh on 5/9/2016.
 */

function getLogin() {
    $.get( "/login", function(data) {
        $("#popup").html(data).removeClass('hidden');
        $(".shadowbox").removeClass('hidden');
    });
}