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

    
    var dataArray = [1406155,2077083,1356747,12510402,15548302,2592821]; 
    var labels = ["Birth", "School", "University", "Work", "Family", "Retirement"];

    outerRadius = width / 2;
    arc = d3.svg.arc()
      .innerRadius(width/3) 
      .outerRadius(outerRadius);

    pie = d3.layout.pie().sort(null);

    arcs = svg.selectAll("g.arc") 
      .data(pie(dataArray)) 
      .enter()
      .append("g")
      .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");    

    arcs.append("path")
      .attr({
        "d": arc,
        "class": function(d,i){
          return " arc color-"+i;
        }
      });
      
        // GROUP FOR CENTER TEXT
    var center_group = svg.append("svg:g")
        .attr("class", "ctrGroup");
       
    // amount
    var pieLabel = center_group.append("svg:text")
        .attr("dy", ".35em").attr("class", "chartLabel")
        .attr("text-anchor", "middle")
         .attr("transform", "translate(" + (width / 2) + "," + (height / 3.8) + ")")
        .html("35,491,509.98 ل.ل");

    var label_group = svg.append("svg:g")
      .attr("class", "lblGroup")
      .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");


  }

  d3.select(window).on('resize', resize);

  function resize() {

    getViewportDimensions();
    setSvgSize();

  }

})();
