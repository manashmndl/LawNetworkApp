//TODO: Optimize
// check if same node was clicked twice
/**
 *  Contents:
 * 
 *  1. Amendment plot
 *  2. Main Network Graph
 *  3. Calls InnerNetwork 
 * 
 * 
 */


var selected_law;
var netwrk;
var network_citation; 
var global_edges = [];
var temp_edges = [];

function drawNetwork (data, stopLoading){

    $("#edgeDetailPanelBody").empty();

    let nodes = [];
    let edges = [];

    network_citation = data.network;

    console.log('start');

    // Added embedding
    for (var i = 0; i < data.laws.length; i++){
        nodes.push({id : data.laws[i], label: "" + data.laws[i], title: data.id_title_map[data.laws[i]], x: data.coords[i].x, y: data.coords[i].y});
    }


    for (var i = 0; i < data.network.length; i++){
        edges.push({from : data.network[i].from, to : data.network[i].to, color: { color : 'rgba(255, 0, 0, 0.1)'}, id: data.network[i].from + "-" + data.network[i].to, arrows: 'to' });
    }

    // Create data

    let _nodes = new vis.DataSet(nodes);
    // let _edges = new vis.DataSet(edges);
    global_edges = new vis.DataSet(edges);

    // Add listeners
    global_edges.on('*', function(event, properties, senderId){
        console.log('event', event, 'properties', properties, 'senderId', senderId);
    });

    var container = document.getElementById("mynetwork");

    var _data = {
        nodes: _nodes,
        // edges: _edges
        edges: global_edges
    };


    var options = {
        "layout" : {
            "randomSeed": 1,
            "improvedLayout": false,
            
            // Enable hierarchical to enable tree like layout
            "hierarchical": {
                "enabled": false,
                "levelSeparation": 100,
                "nodeSpacing": 50,
                "treeSpacing": 100,
                "blockShifting": false,
                "edgeMinimization": false,
                "parentCentralization": false,
                "direction": 'UD',        // UD, DU, LR, RL
                "sortMethod": 'hubsize'   // hubsize, directed
            }
        },
        "nodes": {
            "borderWidthSelected": 8
        },
        "physics" : {
            "enabled" : true,
                
            "stabilization" : {
                "iterations" : 2,
                "enabled" : true, 
                "fit" : true
            }
        },
        
        "edges": {

            "arrows": {
            "to": {
                "enabled": true,
                "scaleFactor" : 0.7
            },
            "from": {
                "enabled": false,
                "scaleFactor" : 0.7
            }
            },

            /* // Turn on scaling to reverse back to tree layout
            "scaling": {
            "min": 39,
            "max": 73
            },
            */

            "smooth": {
                "enabled": true,
                "forceDirection": "none"
            },
            "color": {
                "hover" : "#D84315",
                "highlight" : "#1B5E20"
            }
        },
        "interaction": {
            "hover": true
        },
        "physics": {
            "minVelocity": 0.75
        }
        };


    var network = new vis.Network(container, _data, options);
    netwrk = network;

    network.on('stabilized', function(){
        stopLoading();
    });


    // Stabilize the network after two seconds
    setTimeout(function(){
        network.stopSimulation();
    }, 2000);

    network.on('dragEnd', function(params){
        console.log("drag end");
        network.stopSimulation();
    });

    // On Double click initiate a modal to show the law text and inner graph 
    network.on('doubleClick', function(params){
        console.log(params);
        

        // If clicked on a law or not
        if (params.nodes.length > 0){
            $("#lawModalTitle").text(data.id_title_map[params.nodes[0]]);
            
            //
            startLoading();
            

            selected_law = params.nodes[0];

            console.log("DOUBLE CLICKED");

            // Save double click node
            $.getJSON($SCRIPT_ROOT + '/api/userstat/law_double_click', {
                node: params.nodes[0]   
            }).done(function(){
                console.log("DOUBLE CLICKED LAW " + params.nodes[0] + " SAVED");
            });


            // Get law text
            $.getJSON($SCRIPT_ROOT + '/api/law_detail/all', {id: params.nodes[0]}).done(function(response){

                $("#volume").append('<span class="label label-success" style="margin-right: 10px;">Volume</span>' + response.detail.volume);
                $("#preamble").append('<span class="label label-primary" style="margin-right: 10px;">Preamble</span>' + response.detail.preamble);

            });

            // Get entites
            $.getJSON($SCRIPT_ROOT + "/api/entity", {
                id: params.nodes[0]
            }).done(function(response){
                $("#lawModalNamedEntities").empty();
                console.log("entity response");
                console.log(response);
                
                // Update location
                if (response.organizations.length > 0) {
                    console.log("ORGANIZATION");
                    _.each(response.organizations, function(org){
                        $("#lawModalNamedEntities").append("<span class='label entity-label label-primary'>" + org + "</span>");
                    });
                    $("#lawModalNamedEntities").append("</br></br>");
                }
                
                if (response.persons.length > 0) {
                    console.log("PERSON");
                    _.each(response.persons, function(person){
                        $("#lawModalNamedEntities").append("<span class='label entity-label label-success'>" + person + "</span>");
                    });
                    $("#lawModalNamedEntities").append("</br></br>");
                }

                if (response.locations.length > 0) {
                    console.log("LOCATION");
                    _.each(response.locations, function(location){
                        $("#lawModalNamedEntities").append("<span class='label entity-label label-danger'>" + location + "</span>");
                    });
                    $("#lawModalNamedEntities").append("</br></br>");
                }

                if (response.dates.length > 0) {
                    console.log("DATE");
                    _.each(response.dates, function(date){
                        $("#lawModalNamedEntities").append("<span class='label entity-label label-warning'>" + date + "</span>");
                    });
                }
            });

            // For drawing network
            // $.getJSON($SCRIPT_ROOT + '/api/law_inner_detail/phrase_entity', {
            //     id: selected_law
            // }).done(function(inner_response){
            //     drawInnerNetwork(inner_response, apselected_law, stopLoading);
            //     console.log("Drew inner law network");
            //     stopLoading();
            // });

            // Tag cloud generation
            // $.getJSON($SCRIPT_ROOT + '/api/section_titles', {
            //     id: selected_law
            // }).done(function(inner_response){
            //     drawTagCloud(inner_response, selected_law, stopLoading);
            //     console.log("Drew inner law network");
            //     stopLoading();
            // });

            // Related Section Generation
            $.getJSON($SCRIPT_ROOT + '/api/temp_search', {
                id : selected_law
            }).done(function(inner_response){
                showRelatedSections(inner_response, selected_law);
                console.log(inner_response);
                stopLoading();
            });

        }
    });

    $("#lawModal").on('hide.bs.modal', function(){
        // Empty texts
        $("#volume").empty();
        $("#preamble").empty();

        // Hide this when tagcloud is used
        $("#sections").empty();


        // Hide this when network is used 
        // $("#sectionTableBody").empty();
        // $("#viz").empty();
        // $("#amendmentPanelBody").empty();
        // $("#edgeDetailPanelBody").empty();
    });





    // Edge click show why it is connected 
    // Add the text to edgeDetailsPanelBody
    network.on('selectEdge', function(params){
        // store section keywords for later use
        var _section_keywords = [];

        $("#edgeDetailPanelBody").empty();
        $("#edgeDetailPanel").removeClass('panel-warning').addClass('panel-success');

        $("#edgeDetailPanelBody").prepend("<div id='citation_keywords'></div>");
     
        // let selected_edge = _edges.get(params.edges[0]);
        let selected_edge = global_edges.get(params.edges[0]);

        // Now requesting the details from database
        $.getJSON($SCRIPT_ROOT + '/api/edge_detail',
            {s : "" + selected_edge.from , d: "" + selected_edge.to}
        ).done(function(response){

            $("#connectionDetailsTitle").empty();
            $("#connectionDetailsTitle").append("<b><i>" + response.source_title + "</i></b> (<b>"+ selected_edge.from + "</b>)" + " ⟶ <b><i>" + response.destination_title + "</i></b> (<b>"+ selected_edge.to + "</b>)" );
            
            response.detail.forEach(function(dat){
                $("#edgeDetailPanelBody").append("<p><b>" + dat.section_title + "</b></p>");
                // Add div for keywords
                $("#edgeDetailPanelBody").append("<b><i>Keywords</i></b>");
                $("#edgeDetailPanelBody").append("<div id='keywords'><ul style='list-style-type: none'></ul></div>");
                
                $("#edgeDetailPanelBody").append("<br/>");
                $("#edgeDetailPanelBody").append("<p><b>Details</b></p>");
                $("#edgeDetailPanelBody").append("<p>" + dat.section_detail + "</p>");
                // Get section keywords
                _section_keywords = dat.section_keywords;
            })

            // Send request for keyword
            console.log("requesting for keyword counts ", _section_keywords, search_query)
            $.post($SCRIPT_ROOT + '/api/keywords_edge_count', JSON.stringify(
                {
                    'keywords' : _section_keywords,
                    'query' : search_query
                }), function(response){
                    response.data.map((element) => {
                        console.log(element);
                        
                        $("#keywords>ul").append("<li style='margin-bottom: 3px' class='law_keyword'><button class='btn btn-primary'>"+ element.keyword + " <span class='badge'>" + String(element.count - 1) + "</span></button></li>");
                    
                    })
                }
            ).done(function(){
            // On done requesting attach the functions

            // Search on clicking the keyword
            $('.law_keyword').on('click', function(){
                // Extract text from button
                let keyword = this.textContent.split(' ').slice(0, -1).join("");
                // Clear other temp edges
                temp_edges.map((edge) => {
                    global_edges.update({from : edge.from, to : edge.to, color: { color : 'rgba(255, 0, 0, 0.1)'}, id: edge.from + "-" + edge.to,  })
                });

                // Send request to get the related edges
                $.getJSON($SCRIPT_ROOT + '/api/related_edges', {
                    q: search_query,
                    keyword: keyword
                }).then(function(response){
                    temp_edges = response.data;
                    response.data.map((edge) => {
                        global_edges.update({from : edge.from, to : edge.to, color: { color : 'rgba(50, 50, 50, 0.8)'}, id: edge.from + "-" + edge.to,  })
                    })
                    
                })
            })
            })
           
            
            // Search on clicking the keyword
            $('.law_keyword').on('click', function(){
                
                console.log("CLCIKED, ", this);

                let keyword = this.innerHTML;

                // Clear other temp edges
                temp_edges.map((edge) => {
                    global_edges.update({from : edge.from, to : edge.to, color: { color : 'rgba(255, 0, 0, 0.1)'}, id: edge.from + "-" + edge.to,  })
                });
                
                console.log("temp edges");
                console.log(temp_edges);

                

                // Send request to get the related edges
                $.getJSON($SCRIPT_ROOT + '/api/related_edges', {
                    q: search_query,
                    keyword: keyword
                }).then(function(response){
                    // Draw the network here
                    console.log(response.data);

                    temp_edges = response.data;

                    response.data.map((edge) => {
                        // console.log(edge);
                        // global_edges.update({ id: "" })
                        global_edges.update({from : edge.from, to : edge.to, color: { color : 'rgba(50, 50, 50, 0.8)'}, id: edge.from + "-" + edge.to,  })
                    })
                    
                })
            })

            // Add selected edge data to database
            $.getJSON($SCRIPT_ROOT + '/api/userstat/law_edge_click', 
            {f: selected_edge.from, t: selected_edge.to}).done(function(){
                console.log("SAVED EDGE DATA");
            });


            
        }).fail(function(){
            $("#edgeDetailPanelBody").empty();
            $("#connectionDetailsTitle").empty();
            $("#edgeDetailPanel").removeClass('panel-success').addClass('panel-warning');
            $("#edgeDetailPanelBody").append("<div class='alert alert-danger'>Connection Details Not Found!</div>");
            $("#connectionDetailsTitle").append("Citation Details Between : <b>" + selected_edge.from + "</b> and <b>" + selected_edge.to + "</b> <i>NOT FOUND</i>");
        });

    });
    
    

    // On Double click reset it 
    network.on('selectNode', function(params){

        $("#amendmentPanelBody").empty();

        // Remove previous highlight
        $("#resultList>li").removeClass('highlight');
        
        
        // Send request to get connected nodes
        // Mainly used to highlight the search results
        $.getJSON($SCRIPT_ROOT + '/api/connected_laws', {
            id: params.nodes[0]
        }).done(function(json){
            // Now highlight the search results from the connected law ids
            _.each(json.connections, function(connected_node_id){
                $("#" + connected_node_id).addClass("highlight");
            });

        });

        // Get amendment data
        $.getJSON("/api/amendments", {id: params.nodes[0]}).done(function(response){
            var amendment_data = [];

            
            for (key in response.amendments){
                amendment_data.push({'year' : +key, 'name' : response.title  ,'count' : response.amendments[key]});
            }


            $("#amendmentPanelTitle").text("Showing Amendments of law : " + params.nodes[0]);

            var visualization = d3plus.viz()
            .container("#amendmentPanelBody")
            .data(amendment_data)
            .type("bar")
            .id("name")
            .x("year")
            .height($("#amendmentPanelBody").height())
            .y("count")
            .draw();
        });
    });


    return network;
}