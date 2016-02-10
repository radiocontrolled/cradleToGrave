var agg = { label: 'Aggressive', pct: [30, 10, 6, 30, 14, 10] },
    bal = { label: 'Balanced',   pct: [24,  7, 2, 18, 13, 36] },
    mod = { label: 'Moderate',   pct: [12,  4, 2, 10, 11, 61] },
    inc = { label: 'Income',     pct: [ 0,  0, 0,  0,  0,100] },

    data = agg;

var labels = ['LCAP', 'MCAP', 'SCAP', 'Intl', 'Alt', 'Fixed'];

var w = 320,                       // width and height, natch
    h = 320,
    r = Math.min(w, h) / 2,        // arc radius
    dur = 750,                     // duration, in milliseconds
    color = d3.scale.category10(),
    donut = d3.layout.pie().sort(null),
    arc = d3.svg.arc().innerRadius(r - 70).outerRadius(r - 20);

// ---------------------------------------------------------------------
var svg = d3.select("#d3portfolio").append("svg:svg")
    .attr("width", w).attr("height", h);

var arc_grp = svg.append("svg:g")
    .attr("class", "arcGrp")
    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

var label_group = svg.append("svg:g")
    .attr("class", "lblGroup")
    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

// GROUP FOR CENTER TEXT
var center_group = svg.append("svg:g")
    .attr("class", "ctrGroup")
    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

// CENTER LABEL
var pieLabel = center_group.append("svg:text")
    .attr("dy", ".35em").attr("class", "chartLabel")
    .attr("text-anchor", "middle")
    .text(data.label);

// DRAW ARC PATHS
var arcs = arc_grp.selectAll("path")
    .data(donut(data.pct));
arcs.enter().append("svg:path")
    .attr("stroke", "white")
    .attr("stroke-width", 0.5)
    .attr("fill", function(d, i) {return color(i);})
    .attr("d", arc)
    .each(function(d) {this._current = d});

// DRAW SLICE LABELS
var sliceLabel = label_group.selectAll("text")
    .data(donut(data.pct));
sliceLabel.enter().append("svg:text")
    .attr("class", "arcLabel")
    .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")"; })
    .attr("text-anchor", "middle")
    .text(function(d, i) {return labels[i]; });

// --------- "PAY NO ATTENTION TO THE MAN BEHIND THE CURTAIN" ---------

// Store the currently-displayed angles in this._current.
// Then, interpolate from this._current to the new angles.
function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };
}

// update chart
function updateChart(model) {
    data = eval(model); // which model?

    arcs.data(donut(data.pct)); // recompute angles, rebind data
    arcs.transition().ease("elastic").duration(dur).attrTween("d", arcTween);

    sliceLabel.data(donut(data.pct));
    sliceLabel.transition().ease("elastic").duration(dur)
        .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")"; })
        .style("fill-opacity", function(d) {return d.value==0 ? 1e-6 : 1;});
        
    pieLabel.text(data.label);
}

// click handler
$("#objectives a").click(function() {
    updateChart(this.href.slice(this.href.indexOf('#') + 1));
});