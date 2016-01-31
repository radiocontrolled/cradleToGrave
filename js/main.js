(function() {

  "use strict";

  var height, width, svg, data, min, max, xScale, bubbleScale, svgCircles;
  var body = jQuery("body");

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
  };

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
    if (error) return console.warn(error);
    data = json;
    drawSvg();

    // min/max values for horozontal scale
    min = d3.min(data, function(d) { return d.Avg; });
    max = d3.max(data, function(d) { return d.Avg; });

    visualise();
  });
    
  function visualise() {

    xScale = d3.scale.linear()
      .domain([5,0])
      .range([width*0.8,0]);

    bubbleScale = d3.scale.linear()
      .domain([min,max])
      .range([5,25]);    

    svgCircles = svg.append("g")
      .classed("circle-wrap", true);

    svgCircles.selectAll("circle")
      .data(data)
      .enter()
      .append("g")

      .append("circle")
      .attr({
        "cx" : function(d,i) {
          return xScale(i) + (width * 0.10);
        },
        "cy" : "10%",
        'r' : function(d) {
          return bubbleScale(d.Avg);
        }, 
        "class" : function (d) {
          return d.Stage;
        }
      })

    svgCircles.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .classed("circle-text", true)
      .attr({
        "x" : function(d,i) {
          return xScale(i)+ (width * 0.10);
        },
        "y" : "20%",
        "text-anchor" : "middle",
        "class" : function (d) {
          return d.Stage ;
        }

      })
      .text(function(d){
        return d.Stage;
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
        })
 
       svgCircles.selectAll("text")
          .attr({
            "x" : function(d,i) {
              return xScale(i)+ (width * 0.10);
            },
            "y" : "20%",
            "text-anchor" : "middle"
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
            case 1 : d3.select("circle.Birth").style("fill", "#d91f2b");

            break; 

            case 2 : d3.select("circle.School").style("fill", "#d91f2b");
                     d3.select("circle.Birth").style("fill", "#7FB9E6");

            break; 

            case 3 : d3.select("circle.University").style("fill", "#d91f2b");
                     d3.select("circle.School").style("fill", "#7FB9E6");
            break; 

            case 4 : d3.select("circle.Work").style("fill", "#d91f2b");
                    d3.select("circle.University").style("fill", "#7FB9E6");
            break;

            case 5 : d3.select("circle.Family").style("fill", "#d91f2b"); 
                    d3.select("circle.Work").style("fill", "#7FB9E6");
            break; 

            case 6 : d3.select("circle.Retirement").style("fill", "#d91f2b");
                    d3.select("circle.Family").style("fill", "#7FB9E6");
            break; 

            default: 
            break; 


          }
        },
        onSlidePrevEnd: function () {

             
          switch(swiper.activeIndex) {
          
            case 1 : // birth
              d3.select("circle.Birth").style("fill", "#d91f2b");
              d3.select("circle.School").style("fill", "#7FB9E6"); 
            break; 

            case 2 : // school
              d3.select("circle.School").style("fill", "#d91f2b");
              d3.select("circle.University").style("fill", "#7FB9E6"); 
            break; 

            case 3 : // uni
              d3.select("circle.University").style("fill", "#d91f2b");
              d3.select("circle.Work").style("fill", "#7FB9E6"); 
            break; 
           
            case 4 : // work 
              d3.select("circle.Work").style("fill", "#d91f2b");
              d3.select("circle.Family").style("fill", "#7FB9E6"); 
            break; 

            case 5 : // family 
              d3.select("circle.Family").style("fill", "#d91f2b");
              d3.select("circle.Retirement").style("fill", "#7FB9E6"); 
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
