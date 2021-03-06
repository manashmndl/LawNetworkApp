var DAT;
var temp;


function draw(words_map) {

    var cloud_height = 700;
    var cloud_width = 700;

    $("#tagcloud").empty();
    var current_hover_tag = "";

    var fill = d3.scale.category20();
    // var words = ;

    d3.layout.cloud().size([cloud_height, cloud_width])
        .words(words_map.map(function (d) {
            return { text: d.word, size: d.freq };
        }))
        .padding(5)
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function (d) { return d.size; })
        .on('end', draw)
        .start();

    function draw(words) {
        d3.select('#tagcloud').append('svg')
            .attr('width', 500)
            .attr('height', 500)
            .append('g')
            .attr('transform', "translate(250, 250)")
            .selectAll('text')
            .data(words)
            .enter().append('text')
            .style('font-size', function (d) { return 5 + d.size + 'px'; })
            .style('font-family', "Impact")
            .style('fill', function (d, i) { return fill(i); })
            .attr('text-anchor', 'middle')
            .attr('transform', function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });

    }


    // Shows tooltip
    $("text").each(function () {
        $(this).qtip({
            content: {
                text: $(this).text()
            }
        });
    });

    $("text").on('click', function(){
        $(".context").unmark().mark($(this).text(), {
            "accuracy" : {
              "value" : "exactly",
              "limiters" : [",", ".", ";"]
            },
            "separateWordSearch" : false,
          });
    });

}

function showRelatedSections(_data, lawid){
    // Calculate available area
    let clearance = 50;

    // Resize viz
    $("#viz").css('height', $(window).height() - clearance + 'px');
    $("#viz").css('width', $(window).width() / 2.2 - clearance + 'px');


    // // Resize modal
    $(".modal").css('min-height', $(window).height() + 'px');
    $(".modal").css('max-height', $(window).height() + 'px');
    $(".modal-body").css('height', $(window).height() - clearance + 'px');
    $(".modal-body").css('max-height', $(window).height() - clearance + 'px');

    $("#sections").append("<ul class='inner_section_list'>");

    for (let i = 0; i < _data.related_sections.length; i++) {
        // $("#sections").append("<span class='label label-default>'" + _data['section_keys'][i] + "</label>");
        // $("#sections").append(data['section_keys'][i]);

        section_id = _data.related_sections[i]['section_id'];
        title = _data.related_sections[i]['title'];


        $("#sections>ul").append("<li class='section_keys' id='" + section_id + "'>" + title + "</li>");
        // console.log(_data.related_sections[i]);

        // let value = _data['section_keys'][i];
        // if (value !== "") {
        //     $("#sections").append("<li class='section_keys' id='section_" + i + "'>" + value + "</li>");
        // }
        // </br></br>
    }
    $("#sections").append("</ul>");

    $(".section_keys").on('click', function(){

        // Call the api for section title and details 
        $.getJSON("/api/section_by_key", {
            id: lawid,
            section: +this.id
        }).done(function (response) {
            $("#sectionTableBody").empty();
            //Populate section details and section title 
            $("#sectionTableBody").prepend("<tr><td>" + response.title  + "</td><td>" + response.detail +"</td></tr>");
            // console.log(response);
        });
    });

    // Add event listener to clear modal 
    $("#lawModal").on('hidden.bs.modal', function(event){
        $("#sectionTableBody").empty();
    });

    $("#lawModal").modal('toggle');

}

function drawTagCloud(_data, law_id, stopLoading) {

    // Calculate available area
    let clearance = 50;

    // Resize viz
    $("#viz").css('height', $(window).height() - clearance + 'px');
    $("#viz").css('width', $(window).width() / 2.2 - clearance + 'px');

    // Resize modal
    $(".modal").css('min-height', $(window).height() + 'px');
    $(".modal").css('max-height', $(window).height() + 'px');
    $(".modal-body").css('height', $(window).height() - clearance + 'px');
    $(".modal-body").css('max-height', $(window).height() - clearance + 'px');

    console.log(_data);


    // stopLoading();


    // Append the sections
    $("#sections").append("<ul>");
    for (let i = 0; i < _data['section_keys'].length; i++) {
        // $("#sections").append("<span class='label label-default>'" + _data['section_keys'][i] + "</label>");
        // $("#sections").append(data['section_keys'][i]);

        let value = _data['section_keys'][i];
        if (value !== "") {
            $("#sections").append("<li class='section_keys' id='section_" + i + "'>" + value + "</li>");
        }
        // </br></br>
    }
    $("#sections").append("</ul>");

    $("#sections").css('max-height', $('.modal-body').height() + 'px');

    DAT = _data;


    // Add event listener to list items 
    $(".section_keys").on('click', function () {
        // Remove all highlights 
        $(".section_keys").removeClass('highlight');
        $("#sectionTableBody").empty();

        $(this).addClass('highlight');
        let section_key = $("#" + this.id).text();

        // Send get request for data
        // $.getJSON("/api/wordcloud", {
        //     id: law_id,
        //     key: section_key
        // }).done(function (response) {
        //     draw(response.info.words);

        //     //Populate section details and section title 
        //     $("#sectionTableBody").prepend("<tr><td>" + section_key + "</td><td>" + response.info.section.trim() +"</td></tr>");
        //     console.log(response);
        // });

    });




    $("#lawModal").modal('toggle');
    // console.log(_data);
    // console.log("SELECTED LAW ID " + law_id);
    // stopLoading();
}





