// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints,
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var $tournamenttemplate = undefined;

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        reloadTournaments();
    }

    function onPause() {
        // This application has been suspended. Save application state here.
    }

    function onResume() {
        reloadTournaments();
    }

    function setDebugText(text) {
        $('#rawdata').text(text);
    }

    function reloadTournaments() {
        $.get("https://api.tuvero.de/t", function (data, textStatus, request) {
            setDebugText(JSON.stringify(data));
            updateTournamentView(data);
        }, 'json');
        setDebugText('POST sent... waiting');
    }

    function updateTournamentView(data) {
        var $container = $('#tournaments ul');

        resetTournamentView();

        var tournaments = Object.keys(data.tournaments).map(function (tournamentid) {
            return data.tournaments[tournamentid];
        }).sort(function (a, b) {
            return new Date(a.startdate) - new Date(b.startdate);
        });

        tournaments.forEach(function (tournament) {
            var $tournament = $tournamenttemplate.clone();

            if (!tournament || !tournament.name || !tournament.place) {
                return;
            }

            $tournament.find('.name').text(tournament.name);
            $tournament.find('.place').text(tournament.place);
            $tournament.find('.date').text(tournament.startdate);
            $tournament.find('.description').text(tournament.description || '');

            $container.append($tournament);
        });
    }

    function resetTournamentView() {
        $("#tournaments li.tournament").remove();
    }

    $(function () {
        $('body>[data-role="panel"]').panel().enhanceWithin();

        $('#dark-background-checkbox').on('change', function (event) {
            var dark = $(this);
            console.log(dark);
        });

        $('[data-role="page"]').on("swipeleft swiperight", function (e) {
            // We check if there is no open panel on the page because otherwise
            // a swipe to close the left panel would also open the right panel (and v.v.).
            // We do this by checking the data that the framework stores on the page element (panel: open).
            if ($(".ui-page-active").jqmData("panel") !== "open") {
                if (e.type === "swipeleft") {
                    $("#right-panel").panel("open");
                } else if (e.type === "swiperight") {
                    $("#left-panel").panel("open");
                }
            }
        });

        $tournamenttemplate = $('.tournament.template').detach().removeClass('template');
    });
})();
