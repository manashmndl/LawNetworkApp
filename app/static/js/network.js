// Global variables
var window_height;
var window_width; 

var footer_height;
var navbar_height;

var amendment_panel_height;

var search_result_panel_height;


var loaded_data;


function updateComponentMeasurements(){
    window_height = $(window).height();
    window_width = $(window).width();

    footer_height = $("#theFooter").height();
    navbar_height = $("#lawSearchNavBar").height();

    search_result_panel_height = $("#searchResultPanel").height() + $("#searchResultPanelBody").height();

    amendment_panel_height = $("#amendmentPanel").height();
}




  // Component Size Calculation
  function resizeComponents(){
        let wh = $(window).height();
        let ww = $(window).width();

        //Footer height 
        let fh = $("#theFooter").height();

        // Navbar height
        let nh = $("#lawSearchNavBar").height();

        // Amendment panel height
        let aph = $("#amendmentPanel").height();
        let cleareance = 50;

        let edge_panel_margin_top =  2 * cleareance - (wh - (nh + aph));


        $("#mynetwork").css('height',  wh - cleareance - fh - nh);
        $("#edgeDetailPanel").css('margin-top', "" + (edge_panel_margin_top) + 'px');
  }

//  resizeComponents();


var loadingDone = function(){
    $("#loadingIcon").removeClass("loading");
}

var startLoading = function(){
    $("#loadingIcon").addClass("loading");
}

var loadLawTitles = function(data){

    // Emptying the panel body
    $("#searchResultPanelBody").empty();

    // Adding unordered list
    $("#searchResultPanelBody").append("<ul></ul>");

    // For debugging purpose
    loaded_data = data;

    for (var i = 0; i < data.laws.length; i++){
        $("#searchResultPanelBody").append("<li id=" + data.laws[i] + ">" +  "<b>" + data.laws[i] + "</b> - <i>" + data.id_title_map[data.laws[i]] + "</i>");
    }

    drawNetwork(data, loadingDone);

    // loadingDone();
}

$(document).ready(function(){
    // drawNetwork();

    // Clears input text
    $("#clearButton").click(function(event){
        event.preventDefault();
        $("#keywordSearchInput").val("");
        $("#searchResultPanelBody").empty();
    });


    $("#searchButton").click(function(event){
        

        event.preventDefault();
        // console.log("Default action prevented");
        

        // Send Jquery request for searching
        let search_keywords = $("#keywordSearchInput").val();

        // Additional parameters
        let _ngram = $("#excludeSingleKeywordCheckBox").prop('checked') ? 1 : 0;
        let _exclude_unigram = $("#phraseOnlyCheckBox").prop('checked') ? 1 : 0;
        
        // Set loading 
        startLoading();
        // Requests for network data 
        $.getJSON($SCRIPT_ROOT + "/api/search_law", {
            q: search_keywords,
            ngram: _ngram,
            exclude_unigram: _exclude_unigram
        }, function(data){
            loadLawTitles(data);
        });

        console.log(search_keywords);
    });

    $(window).resize(function(){
        // Redraws the network 
        // setTimeout(drawNetwork(), 1000);
        // resizeComponents();
  });
});
  