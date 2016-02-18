  (function() {

    "use strict";

    var height, width, svg, dataGlobal, yAxis2, yAxisLine, yAxisText, xAxisText;
    var format = d3.format("0,000");

    var selectedClass,
      selectedClassCircle,
      selectedClassLine;

    var getViewportDimensions = function () { 
      width = document.getElementById("bubbleChart").offsetWidth;
      height = window.innerHeight * 0.95;
    };

    getViewportDimensions();

    var drawSvg = function () {
      svg = d3.select("#bubbleChart")
        .append("svg");
        setSvgSize();
    };

    var setSvgSize = function () {
      svg
        .attr({
          width: width,
          height: height
        });
    };

    var xScale = d3.scale.linear()
      .domain([5,0])
      .range([width/2,0]);


    var yScale = d3.scale.linear()
      .domain([24,0])
      .range([(height * 0.8),0]);

    var bubbleScale = d3.scale.linear()
      .domain([15000,10160000])
      .range([3,15]);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("top")
      .ticks(5)
      .tickSize(0)
      .tickFormat(function(d,i){ 
        return xTickLabels[i];
      });

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("right")  
      .ticks(24)
      .tickSize(-width * 0.5)

      .tickFormat(function(d,i){
        return yTickLabels[i][0];
      });

    var drawCircles = function () {
      svg.selectAll("circle")
        .data(dataGlobal.data)
        .enter()
        .append("g")
        .attr({
          "class" : function(d,i) {
            return d[4];
          }
        })
        .append("circle")
        .attr({
          "cx" : function(d) {
            return xScale(d[0]);
          },
          "cy" : function(d) {
            return yScale(d[1]);
          },
          "r" : function(d) {
            return bubbleScale(d[3]);
           
          },
          "class" : function(d,i) {
            return d[5] + " circle";
          },
          "data-avg" : function(d,i) {
            return  d[3];
          }
        });


      svg
        .append("g")
        .attr({
          "class" : "xAxis",
        })
        .call(xAxis);

      yAxis2 = svg
        .append("g")
        .attr({
          "class" : "yAxis"
        })
        .style({
          "transform" : function () {
            return "translate(" + ((width/2) + 62) + "px,2em)";
          }
        })
        .call(yAxis);


      xAxisText = d3.selectAll(".xAxis text")
       .attr({
          "class" : function (d,i) {
            return "b-" + d;
          }
        })



      yAxisLine = d3.selectAll(".yAxis line")
        .attr({
          "class" : function (d,i) {
            return "c-" + d;
          }
        });

      yAxisText = d3.selectAll(".yAxis text")
        .attr({
          "class" : function(d,i) {
            return "c-" + d;
          }
        });

      addMouseListeners();

    };

    var dataAvg, tmp = "";
    var addMouseListeners = function () {
     
      yAxisText
        .on("mouseenter", function() {


          selectedClass = d3.select(this).attr("class");
         
          
          
          // circle
          selectedClassCircle = "circle." + selectedClass;

          d3.selectAll(selectedClassCircle).classed("circleHover", true);

          // text
          dataAvg = d3.select(selectedClassCircle).attr("data-avg");
          tmp = d3.select(this).text();

          d3.select(this)
            .classed("textHover", true)
            .text(function(){
              return tmp + " " + format(dataAvg) + "ل.ل";
            });

          //line 
          selectedClassLine = "line." + selectedClass;
          d3.selectAll(selectedClassLine).classed("lineHover", true);
          
        })
        .on("mouseleave", function () {


          // circle 
          d3.selectAll(selectedClassCircle).classed("circleHover", false);

          // text
           d3.select(this)
            .classed("textHover", false)
            .text(function(){
              return tmp;
            });

          // line 
          d3.selectAll(selectedClassLine).classed("lineHover", false);

        });
    };

    d3.json("data/bubbleChartData.json", function(error, json){

      if (error) console.warn(error);

      else {
        dataGlobal = json; 
        drawSvg();
        drawCircles();
      }
   
    });



    d3.select(window).on('resize', resize);

    function resize() {


      getViewportDimensions();
      setSvgSize();

      // update scales 
      xScale
        .range([width/2,0]);

      yScale
        .range([(height * 0.8),0]);

      bubbleScale
        .range([3,15]);

      // update the circle positions and radius  
      svg.selectAll("circle")
        .attr({
          "cx" : function(d) {
            return xScale(d[0]);
          },
          "cy" : function(d) {
            return yScale(d[1]);
          },
          "r" : function(d) {
            return bubbleScale(d[3]);
           
          },
          "class" : function(d) {
            return d[5] + " circle";
          }
        });

      // update the axes 
      xAxis
        .scale(xScale);

      yAxis
        .scale(yScale);

      svg.selectAll(".xAxis")
        .call(xAxis);

      svg.selectAll("g.yAxis")
        .style({
          "transform" : function () {
            return "translate(" + ((width/2) + 62) + "px,2em)";
          }
        })
        .call(yAxis);

    }

    var xTickLabels = ["Birth", "School", "University", "Work", "Family", "Retirement"];
    var yTickLabels = [
      ["Cadastre", "c-0"],
      ["Car Registration", "c-1"],
      ["Certification of Personal Documents", "c-2"],
      ["Civil Register Authentication", "c-3"],
      ["Cleaning of Judicial Record", "c-4"],
      ["Diploma Certification", "c-5"],
      ["Driving Licence", "c-6"],
      ["Driving Licence Replacement", "c-7"],
      ["Electricity Request", "c-8"],
      ["Fines: Parking Ticket", "c-9"],
      ["Hospital Admission", "c-10"],
      ["Housing Loan", "c-11"],
      ["Housing Permit", "c-12"],
      ["Identity card", "c-13"],
      ["Judicial Record", "c-14"],
      ["License for Commercial Enterprise", "c-15"],
      ["Mecanique", "c-16"],
      ["Passport", "c-17"],
      // ["Permit to issue an approval for foreigners' competency licence holders", "c-18"],
      ["Certificate of Deposit", "c-18"],
      ["Passport Renewal", "c-19"],
      ["Results of Official Examinations", "c-20"],
      ["Social Security Procedures", "c-21"],
      ["Social Security Paperwok", "c-22"],
      ["Subscription to Lebanese University", "c-23"],
      ["Water Request", "c-24"]
    ];





  })();
