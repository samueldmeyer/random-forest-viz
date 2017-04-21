// Maybe do this: http://bl.ocks.org/Kcnarf/9e4813ba03ef34beac6e

var data;

// TODO: change these to be on selection update, not on click
// TODO: Add selection of columns
$('#data-button').on('click', function() {
  for (var j = 0; j < 10; j++) {
    var selectedRow = getRandomInt(1, 15);
    d3.selectAll("tr").style('background-color', 'white')
    .filter(function (d, i) { return i === selectedRow;})
      .style('background-color', 'white')
      .transition().delay(j * 100).duration(200).style('background-color', 'blue')
      .transition().delay(j * 100).duration(200).style('background-color', 'LightBlue');
  }
});

$('#train-tree-button').on('click', function() {
  var svg = d3.select('svg');
  svg.append('circle').attr('r', 30).attr('fill', 'white').attr('cy', 150).attr('cx', 0)
    .transition().duration(200).attr('fill', 'LightBlue')
    .transition().duration(2000).attr('cx', getRandomInt(100, 300)).attr('cy', getRandomInt(50, 300))
    .transition().duration(500).attr('r', 0)
    .on("end", growTree);

  function growTree() {
    var x = parseFloat(this.getAttribute('cx'));
    var y = parseFloat(this.getAttribute('cy'));
    svg.append("image").attr("xlink:href","img/noun_337864_cc.svg")
      .attr("x", x)
      .attr("y", y)
      .attr("width", 0)
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("width", 100)
      .attr("height", 100)
      .attr("x", x - 50)
      .attr("y", y - 50);
  }

  // d3.xml("img/noun_337864_cc.svg").mimeType("image/svg+xml").get(function(error, xml) {
  //   if (error) throw error;
  //   var svgNode = xml.getElementsByTagName("path")[0];
  //   svg.node().appendChild(svgNode);
  // });
});

d3.csv("data/agaricus-lepiota-color.csv", function(error, response) {
  console.log('data:', response);
  data = response;

  var table = d3.select('#create-forest-table').append('table');
  // If we want an SVG table: http://stackoverflow.com/questions/6987005/create-a-table-in-svg
  // https://www.vis4.net/blog/posts/making-html-tables-in-d3-doesnt-need-to-be-a-pain/
  var columns = [
    { head: 'Edibility', cl: 'title', html: d3.f('edibility') },
    { head: 'Cap Shape', cl: 'center', html: d3.f('cap-shape') },
    { head: 'Cap Color', cl: 'center', html: d3.f('cap-color') },
    { head: 'Bruises', cl: 'center', html: d3.f('bruises') },
    { head: 'Odor', cl: 'center', html: d3.f('odor') }
  ];
  table.append('thead').append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
    .attr('class', d3.f('cl'))
    .text(d3.f('head'));
  table.append('tbody')
     .selectAll('tr')
     .data(data).enter()
     .append('tr')
     .selectAll('td')
     .data(function(row, i) {
         // evaluate column objects against the current row
         return columns.map(function(c) {
             var cell = {};
             d3.keys(c).forEach(function(k) {
                 cell[k] = typeof c[k] == 'function' ? c[k](row,i) : c[k];
             });
             return cell;
         });
     }).enter()
     .append('td')
     .html(d3.f('html'))
     .attr('class', d3.f('cl'));
  // end table creation




});


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
