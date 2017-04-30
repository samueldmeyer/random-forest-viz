// Maybe do this: http://bl.ocks.org/Kcnarf/9e4813ba03ef34beac6e
(function () {
var createForestData;
var selectedRowsList;

function updateText(delay, text) {
  d3.select('#step-text')
    .transition()
    .duration(500)
    .style("opacity", 0)
    .transition()
    .duration(500)
    .delay(delay)
    .text(text)
    .style("opacity", 1);
}

$('input[type=radio][name=group1]').on('change', function() {
  if (this.id == 'start-build') {
    d3.selectAll("tr").style('background-color', 'white');
    d3.selectAll("th").style('background-color', 'white');
    d3.selectAll("td").style('background-color', null);
    updateText(0, 'Click on "Select Rows" to select some mushrooms for training the first tree. They are selected with replacement, so some mushrooms might be included twice.');
  } else if (this.id == 'data-button') {
    d3.selectAll("td").style('background-color', null);
    var selectedRowArr = [];
    d3.selectAll("tr").style('background-color', 'white');
    for (let j = 0; j < 10; j++) {
      selectedRowArr.push(getRandomInt(1, 15));
    }
    selectedRowsList = selectedRowArr;
    for (let j = 0; j < selectedRowArr.length; j++) {
      row = selectedRowArr[j];
      d3.selectAll("tr").filter(function (d, i) { return i === row;})
        .style('background-color', 'white')
        .transition().delay(j * 100).duration(200).style('background-color', 'blue')
        .transition().delay(j * 100).duration(200).style('background-color', 'LightBlue');
    }
    updateText(2000, 'Click on "Select Columns" to select some features of the mushrooms for training the first tree. They are selected with replacement, so some features might be included twice.');
  } else if (this.id == 'column-select-option') {
    var selectedColArr = [0];
    d3.selectAll("th").style('background-color', 'white');
    for (let j = 0; j < 3; j++) {
      selectedColArr.push(getRandomInt(1,5));
    }
    for (let j = 0; j < selectedColArr.length; j++) {
      col = selectedColArr[j];
      d3.selectAll("th").filter(function (d, i) { return i === col;})
        .style('background-color', 'white')
        .transition().delay(j * 100).duration(200).style('background-color', 'blue')
        .transition().delay(j * 100).duration(200).style('background-color', 'LightBlue');
    }
    var tr = d3.selectAll("tbody tr").filter(function(d, i) {
      return selectedRowsList.indexOf(i + 1) > -1;
    });
    console.log(tr);
    var td = tr.selectAll("td");
    // debugger;
    td.transition().delay(selectedColArr.length * 200).duration(2000)
    .style("background-color", function(d, i) {
      if (selectedColArr.indexOf(i) > -1) {
        return "DarkBlue";
      }
    });
    //.selectAll('td')
    updateText(800, 'Click on "Train Decision Tree" to train a tree. Using the selected features and mushrooms, we add a tree to the forest.');
  } else if (this.id == 'train-tree-button') {
    var svg = d3.select('#create-forest svg');
    svg.append('circle').attr('r', 30).attr('fill', 'white').attr('cy', 150).attr('cx', 0)
      .transition().duration(200).attr('fill', 'DarkBlue')
      .transition().duration(2000).ease(d3.easeBackInOut.overshoot(2)).attr('cx', getRandomInt(100, 300)).attr('cy', getRandomInt(50, 300))
      .transition().duration(500).ease(d3.easePoly).attr('r', 0)
      .on("end", growTree);

    function growTree() {
      var x = parseFloat(this.getAttribute('cx'));
      var y = parseFloat(this.getAttribute('cy'));
      svg.append("image") //.attr("xlink:href","img/noun_337864_cc.svg")
        .attr("xlink:href","img/tree_icons/tree_" + getRandomInt(0, 10) + ".png")
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

    updateText(3000, 'To add more trees, go back to the beginning to get a different set of mushrooms and features to train a new tree.');

    // http://stackoverflow.com/questions/21209549/embed-and-refer-to-an-external-svg-via-d3-and-or-javascript
    // d3.xml("img/noun_337864_cc.svg").mimeType("image/svg+xml").get(function(error, xml) {
    //   if (error) throw error;
    //   var svgNode = xml.getElementsByTagName("path")[0];
    //   svg.node().appendChild(svgNode);
    // });
  }
});

d3.csv("data/formatted_mushroom_dataset.csv", function(error, response) {
  // console.log('createForestData:', response);
  createForestData = response.slice(0, 16);

  var table = d3.select('#create-forest-table').append('table');
  // If we want an SVG table: http://stackoverflow.com/questions/6987005/create-a-table-in-svg
  // https://www.vis4.net/blog/posts/making-html-tables-in-d3-doesnt-need-to-be-a-pain/
  var columns = [
    { head: 'Edibility', cl: 'center title', html: d3.f('edibility') },
    { head: 'Cap Shape', cl: 'center', html: d3.f('cap shape') },
    { head: 'Cap Color', cl: 'center', html: d3.f('cap color') },
    { head: 'Bruises', cl: 'center', html: d3.f('bruise') },
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
     .data(createForestData).enter()
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
})();
