var first_row_parameters = {name: "first_row"};
var first_row_data = [];
var second_row_parameters = {name: "second_row"};
var second_row_data = [];

$.getJSON(Flask.url_for("instrument"), first_row_parameters)
 .done(function(data, textStatus, jqXHR) {
                first_row_data = data
                });
$.getJSON(Flask.url_for("instrument"), second_row_parameters)
.done(function(data, textStatus, jqXHR) {
               second_row_data = data
               });

var radius = 18;
var hover_radius = 21;
var width = 1280;
var height = 720;

var svgContainer = d3.select("#stage_view")
                             .append("svg")
                             .attr("width", width)
                             .attr("height", height)
                             .attr("class", "svg_background");



var linearScaleX = d3.scaleLinear()
                          .domain([0, 100])
                          .range([0, width]);
var linearScaleY = d3.scaleLinear()
                          .domain([0,100])
                          .range([0, height]);

var x_axis = d3.axisBottom().scale(linearScaleX);
var y_axis = d3.axisRight().scale(linearScaleY);
svgContainer.append("g").call(x_axis);
svgContainer.append("g").call(y_axis);

var circleClickedGroup = svgContainer.append("g")
                                     .classed("clicked", true);

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

var clickedNode = circleClickedGroup.data(data)
                                    .append("g")
                                    .attr("transform", function(d) {return "translate(" + [ d.x,d.y ] + ")"})
                                    .call(dragged)
                                    .on("click", function () {d3.event.stopPropagation()
                                                              d3.select(this).classed("selected", d3.select(this).classed("selected") ? false : true); });
clickedNode.append("circle")
           .attr("r", radius)
           .style("fill", "red")
           .on("mouseover", function() {d3.select(this).attr("r", hover_radius);
                                        d3.select(this).style("cursor", "pointer")})
           .on("mouseout", function()  {d3.select(this).attr("r", radius);
                                        d3.select(this).style("cursor", "default")});

clickedNode.append("text")
           .text("instrument")
           .attr("text-anchor", "middle")
           .attr("dominant-baseline", "central")
           .attr("font-family", "\"Trebuchet MS\", Verada, sans-serif")
           .attr("font-size", "12px")
           .classed("instrument_name", true);

data.length = 0;

})

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
                        y: linearScaleY(instrument_global[i][1]),
                        fill: instrument_global[i][2]
                        };
         curr_data.push(newData);
       }

       svgContainer.selectAll("g." + id).remove();

       circle_group = svgContainer.selectAll("g."+id)
                                  .data(curr_data)
                                  .enter()
                                  .append("g")
                                  .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"})
                                  .classed(id, true)
                                  .call(dragged)
                                  .on("click", function () {d3.event.stopPropagation()
                                                            d3.select(this).classed("selected", d3.select(this).classed("selected") ? false : true);
                                                            });




       circle_group.append("circle")
                   .attr("r", radius)
                   .attr("class", id+"_circle")
                   .style("fill", function(d) {return d.fill; })
                   .on("mouseover", function() {d3.select(this).attr("r", hover_radius);
                                                d3.select(this).style("cursor", "pointer")})
                   .on("mouseout", function()  {d3.select(this).attr("r", radius);
                                                d3.select(this).style("cursor", "default");});

       circle_group.append("text")
                   .text(id)
                   .classed("instrument_name", true)
                   .attr("text-anchor", "middle")
                   .attr("dominant-baseline", "central")
                   .attr("font-family", "\"Trebuchet MS\", Verada, sans-serif")
                   .attr("font-size", "12px");

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

    var fl = {ilosc: $("#fl").val().length > 0 ?  parseInt($("#fl").val(), 10) : 0, id: "fl", row: "first", fill: "#96526B"};
    var cl = {ilosc: $("#cl").val().length > 0 ?  parseInt($("#cl").val(), 10) : 0, id: "cl", row: "second", fill: "#D17869"};
    var ob = {ilosc: $("#ob").val().length > 0 ?  parseInt($("#ob").val(), 10) : 0, id: "ob", row: "first", fill: "#EBAD60"};
    var fg = {ilosc: $("#fg").val().length > 0 ?  parseInt($("#fg").val(), 10) : 0, id: "fg", row: "second", fill: "#F5CF66"};
    var cr = {ilosc: $("#cr").val().length > 0 ?  parseInt($("#cr").val(), 10) : 0, id: "cr", fill: "#8BAB8D"};
    var tr = {ilosc: $("#tr").val().length > 0 ?  parseInt($("#tr").val(), 10) : 0, id: "tr", row: "first", fill: "#FFD34E"};
    var tbn = {ilosc: $("#tbn").val().length > 0 ?  parseInt($("#tbn").val(), 10) : 0, id: "tbn", row: "second", fill: "#DB9E36"};
    var tb = {ilosc: $("#tb").val().length > 0 ?  parseInt($("#tb").val(), 10) : 0, id: "tb", row: "second", fill: "#BD4932"};

    var cr_first = {ilosc: 0, id: "cr", row: "first", fill: "#8BAB8D"};
    var cr_second = {ilosc: 0, id: "cr", row: "second", fill: "#8BAB8D"};

    if(cr.ilosc <= 2) {
      cr_first.ilosc = cr.ilosc;
    }
    else if(cr.ilosc > 2) {
      cr_first.ilosc = 2;
      cr.ilosc -= 2;
      cr_second.ilosc =  cr.ilosc;
    }


    var data = [];
    var first_row_counter = 0;
    var second_row_counter = 0;

    var rows = [];
    var first_row = [];
    var second_row = [];
    first_row.push(cr_first, fl, ob, tr);
    second_row.push(cr_second, cl, fg, tbn, tb);
    rows.push(first_row, second_row);

    for(row in rows) {
        var instruments = rows[row];

        for(instrument in instruments) {

          for(var i = 0; i < instruments[instrument]["ilosc"]; i++) {

            if(instruments[instrument]["row"] === "first"){
              var curr_instrument = {
                x: linearScaleX(first_row_data[first_row_counter][0]),
                y: linearScaleY(first_row_data[first_row_counter][1]),
                id: instruments[instrument]["id"],
                fill: instruments[instrument]["fill"]
              };
              data.push(curr_instrument);
              first_row_counter++;
            }
            else if(instruments[instrument]["row"] === "second"){

              var curr_instrument = {
                x: linearScaleX(second_row_data[second_row_counter][0]),
                y: linearScaleY(second_row_data[second_row_counter][1]),
                id: instruments[instrument]["id"],
                fill: instruments[instrument]["fill"]
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
                                        .classed("first_row", true)
                                        .call(dragged)
                                        .on("click", function () {d3.event.stopPropagation()
                                                                  d3.select(this).classed("selected", d3.select(this).classed("selected") ? false : true); });
      first_row_group.append("circle")
                     .attr("r", radius)
                     .attr("class", function(d) {return d.id;})
                     .style("fill", function(d) {return d.fill;})
                     .on("mouseover", function() {d3.select(this).attr("r", hover_radius)
                                                  d3.select(this).style("cursor", "pointer")})
                     .on("mouseout", function() {d3.select(this).attr("r", radius);
                                                 d3.select(this).style("cursor", "default")});

      first_row_group.append("text")
                     .text(function(d) {return d.id})
                     .attr("text-anchor", "middle")
                     .attr("dominant-baseline", "central")
                     .attr("font-family", "\"Trebuchet MS\", Verada, sans-serif")
                     .attr("font-size", "12px")
                     .classed("instrument_name", true);
}

// definig drag behavior

var dragged = d3.drag()
                .on("drag", function(d, i) {
                      d.x += d3.event.dx
                      d.y += d3.event.dy
                      d3.select(this).attr("transform", function(d, i) {
                        return "translate(" + [ d.x, d.y ] + ")"
                      })
                    });


$("#change_name_button").click(function () {
  if($("#new_name_field").val() != ""){
    svgContainer.selectAll(".selected").select('text').text($("#new_name_field").val());
    svgContainer.selectAll(".selected").classed("selected", false);
  };
});

$("#change_color_button").click(function () {
    var new_color = document.getElementsByClassName('jscolor');
    output_color = "#" + new_color[0].jscolor;

    svgContainer.selectAll(".selected").select('circle').style('fill', output_color);
    svgContainer.selectAll(".selected").classed("selected", false);
});

$("#remove_button").click(function () {
  svgContainer.selectAll(".selected").remove();
})


$("#export_button").click(function(){
var svg = document.getElementsByTagName('svg')[0];
var serializer = new XMLSerializer();
var svg_string = serializer.serializeToString(svg);
var form = $("#svg_form");
$("#output_data").val(svg_string);
form.submit();
});
