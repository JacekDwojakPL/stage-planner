

var radius = 15;

var width = $("#main_container").width();
var height = window.innerHeight - 15;

var svgContainer = d3.select("#stage_view")
                             .append("svg")
                             .attr("width", width)
                             .attr("height", 600)
                             .attr("class", "svg_background");

var circleClickedGroup = svgContainer.append("g").attr("class", "clicked");
var circleAutoCreatedGroup = svgContainer.append("g");
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

       var class_name = "circle." + id;
       var selector = "g." + id;
       svgContainer.selectAll(selector).remove();
       circle_group = svgContainer.append("g").attr("class", id);
       circle_group.selectAll("circle")
                  .data(curr_data)
                  .enter()
                  .append("circle")
                  .attr("cx", function(d){return d.x;})
                  .attr("cy", function(d){return d.y;})
                  .attr("r", radius)
                  .attr("class", id)
                  .style("fill", function() {return "hsl(" + Math.random() * 360 + ",100%,50%)";});
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


  var parameters2 = {
    name: "first_row"
  }
  var first_row_data = [];

  $.getJSON(Flask.url_for("instrument"), parameters2)
  .done(function(data, textStatus, jqXHR){

    first_row_data = data;
    var fl = {ilosc: $("#fl").val().length > 0 ?  parseInt($("#fl").val(), 10) : 0, id: "fl"};
    var cl = {ilosc: $("#cl").val().length > 0 ?  parseInt($("#cl").val(), 10) : 0, id: "cl"};
    var ob = {ilosc: $("#ob").val().length > 0 ?  parseInt($("#ob").val(), 10) : 0, id: "ob"};
    var fg = {ilosc: $("#fg").val().length > 0 ?  parseInt($("#fg").val(), 10) : 0, id: "fg"};
    var cr = {ilosc: $("#cr").val().length > 0 ?  parseInt($("#cr").val(), 10) : 0, id: "cr"};
    var tr = {ilosc: $("#tr").val().length > 0 ?  parseInt($("#tr").val(), 10) : 0, id: "tr"};
    var tbn = {ilosc: $("#tbn").val().length > 0 ?  parseInt($("#tbn").val(), 10) : 0, id: "tbn"};
    var tb = {ilosc: $("#tb").val().length > 0 ?  parseInt($("#tb").val(), 10) : 0, id: "tb"};


    var instruments_container = [];
    var data = [];
    var counter = 0;
    instruments_container.push(fl, cl, ob, fg);


      for (instrument in instruments_container) {
        for(var i = 0; i < instruments_container[instrument]["ilosc"]; i++) {

          var curr_instrument = {
            x: linearScaleX(first_row_data[counter][0]),
            y: linearScaleY(first_row_data[counter][1]),
            id: instruments_container[instrument]["id"]
          };
          data.push(curr_instrument);
          counter++;
        }

      }

      svgContainer.selectAll("g.first_row").remove();
      var first_row_group = svgContainer.append("g").attr("class", "first_row");
      first_row_group.selectAll("circle")
                     .data(data)
                     .enter()
                     .append("circle")
                     .attr("cx", function(d) {return d.x;})
                     .attr("cy", function(d) {return d.y;})
                     .attr("r", radius)
                     .attr("class", function(d) {return d.id;});

      for(var i = 0; i < data.length; i++) {
        console.log(data[i]["id"] + ": x: " + data[i]["x"] + " y: " + data[i]["y"]);
      }

    });

}
