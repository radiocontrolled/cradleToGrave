(function() {

  "use strict";

  var height, width, svg, dataCircle, min, max, xScale, bubbleScale, svgCircles, dataRect, processedDataForRect, rect, rectScale,
  labelAvg, labelProcedure, colourScale, legendText, legendLine;

  var body = jQuery("body");

  var format = d3.format("0,000");

  function getViewportDimensions() { 

    // portrait
    if(window.innerHeight > window.innerWidth){
      width = document.getElementById("main").offsetWidth;
      if(!body.hasClass("portrait")) {
        body.addClass("portrait");
      }
    }

    // if landscape
    else {
      width = document.getElementById("main").offsetWidth / 1.5;  
      if(body.hasClass("portrait")) {
        body.removeClass("portrait");
      }
    }
   
    height = window.innerHeight;
  }

  getViewportDimensions();

  function drawSvg() {
    svg = d3.select("#vis")
      .append("svg");

      setSvgSize();
  }

  function setSvgSize() {
    svg
      .attr({
        width: width,
        height: height
      });
  }



  d3.json("data/dataPieSummary.json", function(error, json) {
    if (error) console.warn(error);
    dataCircle = json;
    drawSvg();
    drawLegend();

    // min/max values for horozontal scale
    min = d3.min(dataCircle, function(d) { return d.Avg; });
    max = d3.max(dataCircle, function(d) { return d.Avg; });


    // visualiseCircles();
  });

  d3.json("data/dataPie.json", function(error, json) {
    if (error) console.warn(error);
    dataRect = json; 
    // visualiseBarChart("birth");

  });

  // http://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
  function sortFunction(a, b) {
    if (a[1] === b[1]) {
      return 0;
    }
    else {
      return (a[1] > b[1]) ? -1 : 1;
    }
  }

  function visualiseCircles () {

    xScale = d3.scale.linear()
      .domain([5,0])
      .range([width*0.8,0]);

    bubbleScale = d3.scale.linear()
      .domain([min,max])
      .range([5,25]);    

    svgCircles = svg.append("g")
      .classed("circle-wrap", true);

    svgCircles.selectAll("circle")
      .data(dataCircle)
      .enter()
      .append("g")
      .append("circle")
      .attr({
        "cx" : function(d,i) {
          return xScale(i) + (width * 0.10);
        },
        "cy" : "92%",
        'r' : function(d) {
          return bubbleScale(d.Avg);
        }, 
        "class" : function (d) {
          return d.Stage;
        }
      });

    }

    function remove (stage) {
      d3.selectAll("rect").remove();
      d3.selectAll(".average").remove();
      d3.selectAll(".labelProcedure").remove();
    }

    function drawLegend () {
      legendText = svg.append("text")
        .attr({
          "id": "legend",
          "font-size" : "10px",
          "transform" : "translate(" + (width * 0.05) + "," + (height * 0.21)  + ")",
          "fill" : "#989798"
        })
        .text("Avg. Bribe per Procedure");

      legendLine = svg.append("line")
        .attr({
          "x1" : width * 0.00001, 
          "y1" : 10, 
          "y2" : 10, 
          "x2" : width*0.90,
          "transform" : "translate(" + (width * 0.05) + "," + (height * 0.20)  + ")",
          "stroke" : "#989798",
          "stroke-width" : "1px"
        });
    }

    

    function visualiseBarChart (stage) {
    
      function processData (stage) {
        processedDataForRect = [];
        for(var i = 0; i < dataRect.length; i++) {
          if(dataRect[i].Stage === stage) {
            var innerArray = [];
            innerArray.push(dataRect[i].Stage);
            innerArray.push(dataRect[i].Avg);
            innerArray.push(dataRect[i].Procedure);
            processedDataForRect.push(innerArray);
          } 
        }
      }

      processData(stage);

      // get the lowest and highest bribe amount 
      var arrayOfAverageBribes = processedDataForRect.map(function(x){return x[1];});
      var min = d3.min(arrayOfAverageBribes);
      var max = d3.max(arrayOfAverageBribes);

      processedDataForRect = processedDataForRect.sort(sortFunction);

      // console.log("stage: " + stage);
      // console.log("dataset: " + processedDataForRect);

      rectScale = d3.scale.linear()
        .domain([min, max])
        .range([(width*0.01), (width*0.90)]);

      rect = svg.selectAll("rect")
        .data(processedDataForRect);

      colourScale = d3.scale.linear()
        .domain([min,max])
        .range(["#d91f2b","#6c0f15"]);

      rect
        .enter()
        .append("rect")
        .attr("transform", "translate(" + (width * 0.05) + "," + (height * 0.26)  + ")")
        .attr({
          "class" : function(d) {
            return d[0];
          },
          "height": 5,
          "y": function(d,i) {
            return i * (height/20); 
          }, 
          "fill" : function(d,i) {
            return colourScale(d[1]);
          },
          "width" : 0
        })
        .transition()
        .duration(1000)
        .attr({"width": function(d) {
            return rectScale(d[1]);
          }
        });

      labelProcedure = svg.selectAll("text.labelProcedure")
        .data(processedDataForRect)
        .enter()
        .append("text")
        .classed("labelProcedure", true)
        .attr("transform", "translate(" + 0 + "," + (height * 0.26)  + ")")
        .text(function(d,i){
          return d[2] + ", " + format(d[1]);
        })
        .attr({
          "fill" : "#989798",
          "font-size" : "10px",
          "x" : function(d) {
            return width * 0.05;
          },
          "y": function(d,i) {
            return i * (height/20) - 4; 
          }
      });
          
    }

    d3.select(window).on('resize', resize);

    function resize() {
      getViewportDimensions();
      setSvgSize();

     xScale 
        .range([width*0.8,0]);

      bubbleScale
        .range([5,25]);    

      svgCircles.selectAll("circle")
        .attr({
          "cx" : function(d,i) {
            return xScale(i) + (width * 0.10);
          },
          "cy" : "10%",
          'r' : function(d) {
            return bubbleScale(d.Avg);
          }
        });
 
       svgCircles.selectAll("text")
          .attr({
            "x" : function(d,i) {
              return xScale(i)+ (width * 0.10);
            },
            "y" : "20%",
            "text-anchor" : "middle"
          });
    
      rectScale
        .range([(width*0.01), (width*0.90)]);

      rect = svg.selectAll("g rect")
        .attr({
          "y": function(d,i) {
            return i * (height/15); 
          }, 
          "width" : 0
        })
        .transition()
        .duration(1000)
        .attr({"width": function(d) {
            return rectScale(d[1]);
          }
        });
    }


   var swiperInit = function () {
     var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        direction: 'vertical',
        a11y: true,
        mousewheelControl: true,
        keyboardControl: true,
        onSlideChangeEnd: function() {
          
          switch(swiper.activeIndex) {
            case 1 : 
              // d3.select("circle.Birth").style("fill", "#989798");
              d3.select("text.Birth").classed("show", true);
              visualiseBarChart("birth");

            break; 

            case 2 : 
              // d3.select("circle.School").style("fill", "#989798");
              // d3.select("circle.Birth").style("fill", "#7FB9E6");

              remove();
              visualiseBarChart("school");


              d3.select("text.School").classed("show", true);
              d3.select("text.Birth").classed("show", false);
            break; 

            case 3 : 
              // d3.select("circle.University").style("fill", "#989798");
              // d3.select("circle.School").style("fill", "#7FB9E6");

              remove();
              visualiseBarChart("university");

              d3.select("text.University").classed("show", true);
              d3.select("text.School").classed("show", false);
            break; 

            case 4 : 
              // d3.select("circle.Work").style("fill", "#989798");
              // d3.select("circle.University").style("fill", "#7FB9E6");

              remove();
              visualiseBarChart("work");
    
              d3.select("text.Work").classed("show", true);
              d3.select("text.University").classed("show", false);
            break;

            case 5 : 
              // d3.select("circle.Family").style("fill", "#989798"); 
              // d3.select("circle.Work").style("fill", "#7FB9E6");

              remove();
              visualiseBarChart("family");

              d3.select("text.Family").classed("show", true);
              d3.select("text.Work").classed("show", false);
            break; 

            case 6 : 
              // d3.select("circle.Retirement").style("fill", "#989798");
              // d3.select("circle.Family").style("fill", "#7FB9E6");

              remove();
              visualiseBarChart("retirement");

              d3.select("text.Retirement").classed("show", true);
              d3.select("text.Family").classed("show", false);

            break; 

            default: 
            break; 


          }
        },
        onSlidePrevEnd: function () {

             
          switch(swiper.activeIndex) {
          
            case 1 : // birth
              // d3.select("circle.Birth").style("fill", "#989798");
              // d3.select("circle.School").style("fill", "#7FB9E6"); 

              visualiseBarChart("birth");
              d3.select("text.School").classed("show", false);

              remove();
              visualiseBarChart("birth");

            break; 

            case 2 : // school
              // d3.select("circle.School").style("fill", "#989798");
              // d3.select("circle.University").style("fill", "#7FB9E6"); 

              d3.select("text.University").classed("show", false);

              remove();
              visualiseBarChart("school");

            break; 

            // case 3 : // uni
            //   d3.select("circle.University").style("fill", "#989798");
            //   d3.select("circle.Work").style("fill", "#7FB9E6"); 

              d3.select("text.Work").classed("show", false);

              remove();
              visualiseBarChart("university");

            break; 
           
            case 4 : // work 
              // d3.select("circle.Work").style("fill", "#989798");
              // d3.select("circle.Family").style("fill", "#7FB9E6"); 


              d3.select("text.Family").classed("show", false);

              remove();
              visualiseBarChart("work");

            break; 

            case 5 : // family 
              // d3.select("circle.Family").style("fill", "#989798");
              // d3.select("circle.Retirement").style("fill", "#7FB9E6"); 

              remove();
              visualiseBarChart("family");

              d3.select("text.Retirement").classed("show", false);

            break; 

            case 6 : // retirement
            break; 

            default: 
            break; 


          }


          
        }
      });
  }(); // calling swiperInit

})();
