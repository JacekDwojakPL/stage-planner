var first_row_parameters = {name: "first_row"};
var first_row_data = [];
var second_row_parameters = {name: "second_row"};
var second_row_data = [];
$.getJSON(Flask.url_for("instrument"), first_row_parameters)
 .done(function(data, textStatus, jqXHR) {
                first_row_data = data
                console.log(textStatus)
                });
$.getJSON(Flask.url_for("instrument"), second_row_parameters)
.done(function(data, textStatus, jqXHR) {
               second_row_data = data
               });

var radius = 15;

var width = $("#main_container").width();
var height = window.innerHeight - 15;

var svgContainer = d3.select("#stage_view")
                             .append("svg")
                             .attr("width", width)
                             .attr("height", 600)
                             .attr("class", "svg_background");

var circleClickedGroup = svgContainer.append("g").attr("class", "clicked");

var linearScaleX = d3.scaleLinear()
                          .domain([0, 100])
                          .range([0, width]);
var linearScaleY = d3.scaleLinear()
                          .domain([0,100])
                          .range([0, 600]);

var x_axis = d3.axisBottom().scale(linearScaleX);
var y_axis = d3.axisRight().scale(linearScaleY);
svgContainer.append("g").call(x_axis);
svgContainer.append("g").call(y_axis);

// container for getting x and y coordinates of click event
var data = [];
svgContainer.on("click", function() {
  var coords = d3.mouse(this);
  var newData = {
    x: coords[0],
    y: coords[1]
  };
  data.push(newData);

// creating new circle on click
  circleClickedGroup.selectAll("circle")
              .data(data)
              .enter()
              .append("circle")
              .attr("cx", function(d){return d.x;})
              .attr("cy", function(d){return d.y;})
              .attr("r", radius)
              .attr("class", "unflagged")
              .style("fill", function() {return "hsl(" + Math.random() * 360 + ",100%,50%)";})
              .style("cursor", "pointer")
              .on("click", function() {
                                        d3.event.stopPropagation();
                                        var state = d3.select(this).attr("class");
                                        var x_position = d3.select(this).attr("cx");
                                        var y_position = d3.select(this).attr("cy");
                                        var localScaleX = d3.scaleLinear().domain([0, width]).range([0, 100]);
                                        var localScaleY = d3.scaleLinear().domain([0, 600]).range([0, 100])
                                        console.log("x position: " + localScaleX(x_position));
                                        console.log("y position: " + localScaleY(y_position));


                                          if(state == "unflagged")
                                          {
                                            d3.select(this).raise().classed("flagged", true);
                                            d3.select(this).raise().classed("unflagged", false);
                                          }
                                          else
                                          {
                                            d3.select(this).raise().classed("flagged", false);
                                            d3.select(this).raise().classed("unflagged", true);
                                          }
                                        })
              .call(d3.drag()
                      .on("start", drag_start)
                      .on("drag", drag_move)
                      .on("end", drag_end));

    console.log(newData);

})


// definig drag events
function drag_start(d) {
  d3.select(this).raise().classed("active", true);
}

function drag_move(d) {
  d3.select(this)
      .attr("cx", d.x = d3.event.x)
      .attr("cy", d.y = d3.event.y);
}

function drag_end(d) {
  d3.select(this).raise().classed("active", false);
}


// example data for fake first violin position

function createLayout(id)
{
    var instrument_global = [];
    var parameters = {
      name: id
    };

  $.getJSON(Flask.url_for("instrument"), parameters)
   .done(function(data, textStatus, jqHXR)
   {

     instrument_global = data;


     var curr_data = [];
     var selector = "#" + id;
     var user_input = $(selector).val();

     if (user_input <= instrument_global.length)  {

       for(var i = 0; i < user_input; i++)
       {
         var newData = {
                        x: linearScaleX(instrument_global[i][0]),
                        y: linearScaleY(instrument_global[i][1])
                        };
         curr_data.push(newData);
       }

       svgContainer.selectAll("g." + id).remove();

       circle_group = svgContainer.selectAll("g."+id)
                                  .data(curr_data)
                                  .enter()
                                  .append("g")
                                  .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"})
                                  .classed(id, true);

       circle_group.append("circle")
                   .attr("r", radius)
                   .attr("class", id+"_circle")

       circle_group.append("text")
                   .text(id)
                   .classed("instrument_name", true)
                   .attr("text-anchor", "middle")
                   .attr("dominant-baseline", "central");

        curr_data.length = 0;
    }
    else
    {
      console.log("error");
    }

  });
}




function wind(id)
{

    var fl = {ilosc: $("#fl").val().length > 0 ?  parseInt($("#fl").val(), 10) : 0, id: "fl", row: "first"};
    var cl = {ilosc: $("#cl").val().length > 0 ?  parseInt($("#cl").val(), 10) : 0, id: "cl", row: "second"};
    var ob = {ilosc: $("#ob").val().length > 0 ?  parseInt($("#ob").val(), 10) : 0, id: "ob", row: "first"};
    var fg = {ilosc: $("#fg").val().length > 0 ?  parseInt($("#fg").val(), 10) : 0, id: "fg", row: "second"};
    var cr = {ilosc: $("#cr").val().length > 0 ?  parseInt($("#cr").val(), 10) : 0, id: "cr"};
    var tr = {ilosc: $("#tr").val().length > 0 ?  parseInt($("#tr").val(), 10) : 0, id: "tr", row: "first"};
    var tbn = {ilosc: $("#tbn").val().length > 0 ?  parseInt($("#tbn").val(), 10) : 0, id: "tbn", row: "second"};
    var tb = {ilosc: $("#tb").val().length > 0 ?  parseInt($("#tb").val(), 10) : 0, id: "tb", row: "second"};

    var data = [];
    var first_row_counter = 0;
    var second_row_counter = 0;

    var rows = [];
    var first_row = [];
    var second_row = [];
    first_row.push(fl, ob, tr);
    second_row.push(cl, fg, tbn, tb);
    rows.push(first_row, second_row);

    for(row in rows) {
        var instruments = rows[row];

        for(instrument in instruments) {

          for(var i = 0; i < instruments[instrument]["ilosc"]; i++) {

            if(instruments[instrument]["row"] === "first"){
              var curr_instrument = {
                x: linearScaleX(first_row_data[first_row_counter][0]),
                y: linearScaleY(first_row_data[first_row_counter][1]),
                id: instruments[instrument]["id"]
              };
              data.push(curr_instrument);
              first_row_counter++;
            }
            else if(instruments[instrument]["row"] === "second"){

              var curr_instrument = {
                x: linearScaleX(second_row_data[second_row_counter][0]),
                y: linearScaleY(second_row_data[second_row_counter][1]),
                id: instruments[instrument]["id"]
              };
              data.push(curr_instrument);
              second_row_counter++;

            }

          }

        }
    }

      svgContainer.selectAll("g.first_row").remove();

      var first_row_group = svgContainer.selectAll("g.first_row")
                                        .data(data)
                                        .enter()
                                        .append("g")
                                        .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"})
                                        .classed("first_row", true);
      first_row_group.append("circle")
                     .attr("r", radius)
                     .attr("class", function(d) {return d.id;});

      first_row_group.append("text")
                     .text(function(d) {return d.id})
                     .attr("text-anchor", "middle")
                     .attr("dominant-baseline", "central")
                     .classed("instrument_name", true);

}
