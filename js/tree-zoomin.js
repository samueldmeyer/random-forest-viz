// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 90},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom,
rect_width = 100,
rect_height = 30,
max_link_width = 30,
min_link_width = 1.5,
char_to_pxl = 6,
unsplit_color = "lightsteelblue",
split_color = '#fff',
class_0_name = 'poisonous',
class_0_color = '#b49cc1',
class_1_name = 'edible',
class_1_color = '#c6efd5',
json_filepath = 'data/tree_json/';

var i = 0,
duration = 750,
root,
link_stroke_scale,
link_color,
svg;

/* ****************************************
* Building a Tree
**************************************** */
// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

create_buttons($("#treelist"), 20);

function renderTree(file_name){
    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    d3.select("#collapsible_tree").select("svg").remove();

    svg = d3.select("#collapsible_tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("
    + margin.left + "," + margin.top + ")");

    link_color = d3.scaleLinear()
    .domain([1e-6, 1])
    .interpolate(d3.interpolateHcl)
    .range([class_0_color, class_1_color]);

    d3.json(file_name, load_dataset);
}

function load_dataset(treeData){
    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function(d) { return d.children; });
    root.x0 = height / 2;
    root.y0 = 0;

    // Collapse after the second level
    root.children.forEach(collapse);

    // create the scale for link thickness
    var n_samples = root.data.samples;
    link_stroke_scale = d3.scaleLinear()
    .domain([0, n_samples])
    .range([min_link_width, max_link_width]);

    update(root);
}

// Collapse the node and all it's children
function collapse(d) {
    if(d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
    }
}

function update(source) {

    // Assigns the x and y position for the nodes
    var treeData = treemap(root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
    links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d){ d.y = d.depth * 180});

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = svg.selectAll('g.node')
    .data(nodes, function(d) {return d.id || (d.id = ++i); });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

    nodeEnter.append('rect')
    .attr('class', 'node')
    .attr("x", function(d) {
        var label = d.data.name;
        var text_len = label.length * char_to_pxl;
        var width = d3.max([rect_width, text_len]);
        return -width / 2;
    })
    .attr("y", -rect_height/2)
    .attr("width", function(d){
        var label = d.data.name;
        var text_len = label.length * char_to_pxl;
        var width = d3.max([rect_width, text_len]);
        return width;
    })
    .attr("height", rect_height)
    .attr("rx", function(d) { return d.data.type === "split" ? 4 : 0;})
    .attr("ry", function(d) { return d.data.type === "split" ? 4 : 0;})
    .style("stroke", function(d) { return d.data.type === "split" ? "steelblue" : "";})
    .style("fill", get_fill_color);

    nodeEnter.append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) { return d.data.name; });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
    });

    // Update the node attributes and style
    nodeUpdate.select('rect.node')
    //.attr('r', 10)
    .style("fill", get_fill_color)
    .attr('cursor', 'pointer');

    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
        return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

    // On exit reduce the node rectangle size to 0
    nodeExit.select('rect')
    .attr('width', 1e-6)
    .attr('height', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
    .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = svg.selectAll('path.link')
    .data(links, function(d) { return d.id; });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
    .attr("class", "link")
    .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
    })
    .style("stroke-width", function(d) {return link_stroke_scale(d.data.samples);})
    .style("stroke", get_link_color);

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
    .duration(duration)
    .attr('d', function(d){ return diagonal(d, d.parent) })
    .style("stroke-width", function(d) {return link_stroke_scale(d.data.samples);})
    .style("stroke", get_link_color);

    // Remove any exiting links
    var linkExit = link.exit().transition()
    .duration(duration)
    .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
    })
    .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d){
        d.x0 = d.x;
        d.y0 = d.y;
    });

    function get_link_color(d){
        var
        class_0 = d.data.value[0],
        class_1 = d.data.value[1],
        class_ratio = class_1 / (class_0 + class_1);
        return link_color(class_ratio);
    }

    function get_fill_color(d){
        if (d._children){
            return unsplit_color;
        } else if (d.data.type === 'split') {
            return split_color;
        } else if (d.data.name === class_0_name) {
            return class_0_color;
        } else {
            return class_1_color;
        }
    }

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
        path = `M ${s.y} ${s.x}
        C ${(s.y + d.y) / 2} ${s.x},
        ${(s.y + d.y) / 2} ${d.x},
        ${d.y} ${d.x}`

        return path
    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}

/* ****************************************
* button clicking
**************************************** */

function displayChart(tree_id){
   var buttons =  document.querySelectorAll('li[id^="tree_"]');
   for (var i = 0, j = buttons.length; i<j; i++) {
       button_id = buttons[i].id.replace('tree_', '');
       if (button_id == tree_id){
           buttons[i].className = "waves-effect waves-light active";
       }else{
           buttons[i].className = "waves-effect waves-light";
       }
   };

   renderTree(json_filepath + 'tree' + tree_id + '.json');
}

function create_buttons(target_div, num_buttons) {
    var buttons='<ul class="pagination" id="tree_list">',
    img = '<img src="img/tree_icons/tree_',
    img_id;
    for (var i = 0; i < num_buttons; i++ ) {
        img_id = (i % 3);
        buttons += '<li class="waves-effect waves-light" id="tree_'+ i +
        '"><a onclick="displayChart('+ i + ')">' + img + img_id + '.png"' +
        '/> tree ' + (i+1) + '</a></li>';
    }
    console.log(buttons);
    buttons = buttons + "</ul>";
    target_div.html(buttons);
}


// tree icons:
// - Chestnut, beech, Palm Tree by parkjisun from the Noun Project