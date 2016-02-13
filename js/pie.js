(function() {

  "use strict";

  var height, width, svg, pie, arc, arcs, processedData, outerRadius;
 
  function getViewportDimensions () { 
    width = document.getElementById("pie").offsetWidth;
    height = window.innerHeight;
    drawSvg();
  };

  getViewportDimensions();

  function setSvgSize() {
    svg
      .attr({
        width: width,
        height: height
      });
  }

  function drawSvg() {
    svg = d3.select("#pie")
      .append("svg");
      setSvgSize();
      drawPieChart();
  }

  function drawPieChart() {

    var data = [
      {name: "Birth", val: 1406155},  
      {name: "School", val: 2077083},  
      {name: "University", val: 1356747},  
      {name: "Work", val: 12510402},  
      {name: "Family", val: 15548302},
      {name: "Family", val: 2592821}  
    ];

    var colourScale = d3.scale.linear()
      .domain([1406155,15548302])
      .range(["#d91f2b","#6c0f15"]);
   
    outerRadius = width / 3.3;
    arc = d3.svg.arc()
      .innerRadius(width/3.9) 
      .outerRadius(outerRadius);

    pie = d3.layout.pie().sort(null);

    var donut = d3.select("#pie svg")
      .data([data]);

    var r = Math.min(width, height) / 3,
      labelr = r + (height/35);

    arcs = donut.selectAll("g.arc") 
      .data(pie.value(function(d) { return d.val }))
      .enter()
      .append("g")
      .classed("pie", true)
      .attr("transform", "translate(" + width/2 + "," + height/4 + ")");

    arcs.append("path")
      .attr({
        "d": arc,
        "class" : "arc",
        "fill" : function(d,i) {
          return colourScale(d.value);
        }
      });
    
    //label the slices (arcs) of the piechart
    arcs.append("text")
      .attr("transform", function(d,i) {
        var c = arc.centroid(d),
          x = c[0],
          y = c[1],
          // pythagorean theorem for hypotenuse
          h = Math.sqrt(x*x + y*y);
          return "translate(" + (x/h * labelr) +  ',' + (y/h * labelr) +  ")"; 
        })
        .attr({
          "text-anchor":"middle",
          "fill": function(d,i) {
            return colourScale(d.value);
          },
          "font-size" : "12px"
        })
        .text(function(d) {
          return d.data.name + ", " + d.value;
        })
            // amount
    var pieLabel = arcs.append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + width/40 + "," + height/60 + ")")
      .html("35,491,509.98 ل.ل");

  }

  d3.select(window).on('resize', resize);

  function resize() {

    getViewportDimensions();
    setSvgSize();

  }

})();
