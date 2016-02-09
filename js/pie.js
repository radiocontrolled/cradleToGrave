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

    
    var dataArray = [1406155,2077083,1356747,12510402,15548302,2592821]; // first value is official amount, second value is bribe

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

    //Draw arc paths  
    arcs.append("path")
      .attr({
        "d": arc,
        "class": function(d,i){
          return " arc color-"+i;
        }
      });
      
  }

  d3.select(window).on('resize', resize);

  function resize() {

    getViewportDimensions();
    setSvgSize();

  }

})();
