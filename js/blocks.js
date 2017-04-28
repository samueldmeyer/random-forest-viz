(function () {

build_block("#actual", ["actual"]);
build_block("#predictor_1", ["predictor_1"]);
build_block("#predictor_2", ["predictor_2"]);
build_block("#predictor_all", ["predictor_1", "predictor_2", "predictor_3"]);

function build_block(div_name, rows){
    var nrow = rows.length;
    console.log("get here");

    var margin = {top: 30, right: 90, bottom: 30, left: 120};
    var gridsize = 50,
    gapsize = 5,
    class_1_color = "#9de4e8",
    class_0_color = "#ff8f2d",
    ncol = 10,
    w = 600,
    h = nrow * (gridsize + gapsize);

    var svg = d3.select(div_name)
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var blocks_filename = 'data/blocks.csv';
    
    var cols = [];
    for (i = 0; i < 10; i++){
        cols.push(i+1);
    };

    d3.csv(blocks_filename, function(d){
        console.log(d);
        var rects = svg.selectAll("rect")
        .data(d)
        .enter()
        .append("rect")
        .filter(function(d) { return rows.indexOf(d.name) >= 0 });

        rects.attr("x", function(d, i) {
            return ((i%ncol) * (gridsize + gapsize));
        })
        .attr("y", function(d, i) {
            return (Math.floor(i/ncol) * (gridsize + gapsize*4));
        })
        .attr("width", gridsize)
        .attr("height", gridsize)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "bordered")
        .attr("fill", function(d){
            return d.value == 1? class_1_color:class_0_color;
        });

        var rowLabels = svg.selectAll(".row_label")
        .data(rows)
        .enter().append("text")
        .text(function (d) { return d.split("_").join(" "); })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * (gridsize + gapsize*4); })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + (gridsize + gapsize) / 2 + ")");

        var colLabels = svg.selectAll(".col_lables")
        .data(cols)
        .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, i) { return i * (gridsize + gapsize); })
        .attr("y", 0)
        .style("text-anchor", "start")
        .attr("transform", "translate("+ gridsize/2.5 + ",-6)");
    })
};
})();
