(function () {

    build_block("#actual", ["target"]);
    build_block("#predictor_1", ["decision_tree_1"]);
    build_block("#predictor_2", ["decision_tree_2"]);
    build_block("#predictor_3", ["decision_tree_3"]);
    build_block("#predictor_all", ["decision_tree_1", "decision_tree_2", "decision_tree_3"]);
    build_block("#combined_result", ["combined_result", "target"]);

    function build_block(div_name, rows){
        var nrow = rows.length;

        var margin = {top: 30, right: 90, bottom: 30, left: 180};
        var gridsize = 50,
        gapsize = 5,
        wrong_color = "#fce4ec",
        wrong_color_stroke = "#e91e63",
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
            var rects = svg.selectAll("rect")
            .data(d)
            .enter()
            .filter(function(d) { return rows.indexOf(d.name) >= 0 });

            rects.append("circle")
            .attr("cx", function(d, i) {
                return ((i%ncol) * (gridsize + gapsize)) + gridsize/2;
            })
            .attr("cy", function(d, i) {
                return (Math.floor(i/ncol) * (gridsize + gapsize*4)) + gridsize/2;
            })
            .attr("r", gridsize/2)
            .attr("class", "bordered")
            .attr("fill", function(d){
                return d.correct === 'yes'? 'none':wrong_color;
            });

            rects.append('image')
            .attr('xlink:href',function(d){
                return d.value == 1? '../img/mushroom_edible1.svg':
                '../img/mushroom_poisonous1.svg';
            })
            .attr("x", function(d, i) {
                return ((i%ncol) * (gridsize + gapsize)) + 0.25 * gridsize;
            })
            .attr("y", function(d, i) {
                return (Math.floor(i/ncol) * (gridsize + gapsize*4));
            })
            .attr('height', gridsize)
            .attr('width', gridsize/2);

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
