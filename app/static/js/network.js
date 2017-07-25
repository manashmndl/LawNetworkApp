
  function drawNetwork(){
    // create an array with nodes
    var nodes = new vis.DataSet([
        {id: 1, label: 'Node 1'},
        {id: 2, label: 'Node 2'},
        {id: 3, label: 'Node 3'},
        {id: 4, label: 'Node 4'},
        {id: 5, label: 'Node 5'}
    ]);

    // create an array with edges
    var edges = new vis.DataSet([
        {from: 1, to: 3},
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 2, to: 5},
        {from: 3, to: 3}
    ]);

    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {};
    var network = new vis.Network(container, data, options);
  }


  drawNetwork();



  // ------------- Component Size Calculations ------------------- //

$(document).ready(function(){
    $(window).resize(function(){
        // update current window height and width
        let window_height = $(window).height();
        let window_width = $(window).width();

        let footer_height = $("#theFooter").height();

        let navbar_height = $("#lawSearchNavBar").height();

        console.log("window height: " + window_height);
        console.log("Footer height: " + footer_height);

        $("#mynetwork").css('height', window_height - footer_height - navbar_height);
        
        // Redraws the network 
        setTimeout(drawNetwork(), 1000);
  });
});
  