// Maybe do this: http://bl.ocks.org/Kcnarf/9e4813ba03ef34beac6e
(function () {
var createForestData;
var selectedRowsList;
var currentState = 0;

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

var state0Text = 'Click on "Next" to select some mushrooms for training ' +
  'the first tree. They are selected with replacement, so some mushrooms ' +
  'might be included twice.'
var state1Text = 'Next, we select some features of the ' +
  'mushrooms for training the first tree. They are selected with ' +
  'replacement, so some features might be included twice.'
var state2Text = 'Next, we will train a tree. The new decision tree will be ' +
  'a good predictor for the selected features and mushrooms.'
var state3Text = 'To add more trees, click "Next". We can just keep adding ' +
  'trees trained on new random data until the forest is big enough. Normally ' +
  'we want a few hundred trees, but you don\'t need to do that many.'
$('#step-text').text(state0Text);
function updateState1() {
  $('#create-forest-back').removeClass('disabled');
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
      .transition().delay(200).duration(200).style('background-color', 'LightBlue');
  }
  // hide rows not selected
  d3.selectAll("tbody tr").filter(function(d, i) {
    return selectedRowArr.indexOf(i + 1) === -1; // +1 to deal with selecting only body rows
  }).transition().duration(1000).delay(selectedRowArr.length * 100 + 600).style("opacity", 0.05);
}
function updateState2() {
  var selectedColArr = [0];
  d3.selectAll("th").style('background-color', 'white');
  // select columns and highlight feature names
  for (let j = 0; j < 3; j++) {
    selectedColArr.push(getRandomInt(1,5));
  }
  for (let j = 0; j < selectedColArr.length; j++) {
    col = selectedColArr[j];
    d3.selectAll("th").filter(function (d, i) { return i === col;})
      .style('background-color', 'white')
      .transition().delay(j * 100).duration(200).style('background-color', 'blue')
      .transition().delay(200).duration(200).style('background-color', 'white');
  }
  var tr = d3.selectAll("tbody tr").filter(function(d, i) {
    return selectedRowsList.indexOf(i + 1) > -1;
  });
  // remove light blue row highlight
  tr.transition().duration(100)
    .style('background-color', 'white');
  var td = tr.selectAll("td");
  // color selected data green
  td.transition().delay((selectedColArr.length - 1) * 100 + 600).duration(1000)
  .style("background-color", function(d, i) {
    if (selectedColArr.indexOf(i) > -1) {
      return "#2CA02C";
    }
  });
  // hide unselected columns
  var tdNotSelected = d3.selectAll("tr").selectAll("td, th")
    .filter(function(d, i) {
      return selectedColArr.indexOf(i) === -1;
    });
  tdNotSelected.transition().delay(selectedColArr.length * 100 + 1000).duration(1000)
    .style("opacity", 0.05).style("background-color", "white");
}
function updateState3() {
  var svg = d3.select('#create-forest svg');
  svg.append('circle').attr('r', 30).attr('fill', 'white').attr('cy', 150).attr('cx', 0)
    .transition().duration(200).attr('fill', '#2CA02C')
    .transition().duration(2000).ease(d3.easeBackInOut.overshoot(2)).attr('cx', getRandomInt(100, 300)).attr('cy', getRandomInt(50, 300))
    .transition().duration(500).ease(d3.easePoly).attr('r', 0)
    .on("end", growTree);
  function growTree() {
    var x = parseFloat(this.getAttribute('cx'));
    var y = parseFloat(this.getAttribute('cy'));
    svg.append("image") //.attr("xlink:href","img/noun_337864_cc.svg")
      .attr("xlink:href","img/tree_icons/tree_" + getRandomInt(0, 10) + ".svg")
      .attr("class", "training-tree")
      .attr("x", x)
      .attr("y", y)
      .attr("width", 0)
      .attr("height", 0)
      .transition()
      .duration(100)
      .attr("width", 10)
      .attr("height", 10)
      .attr("x", x - 5)
      .attr("y", y - 5)
      .on("end", function() {
        svg.append("text") //.attr("xlink:href","img/noun_337864_cc.svg")
          .text("training.")
          .attr('class', 'train-current')
          .attr("x", x - 30)
          .attr("y", y + 20)
          .attr("width", 0)
          .attr("height", 0)
          .transition()
          .delay(500)
          .text('training..')
          .transition()
          .delay(500)
          .text('training...')
          .transition()
          .delay(500)
          .text('training.')
          .transition()
          .delay(500)
          .text('training..')
          .transition()
          .delay(500)
          .text('training...')
          .remove()
          .on("end", function() {
            svg.selectAll('.training-tree')
              .transition()
              .duration(1000)
              .attr("width", 100)
              .attr("height", 100)
              .attr("x", x - 50)
              .attr("y", y - 50)
              .attr("class", null);
          });
      });
  }
}
$('#create-forest-next').on('click', function() {
  if (currentState < 4) {
    currentState += 1;
  }
  if (currentState === 1) {
    updateState1();
    updateText(2300, state1Text);
  } else if (currentState === 2) {
    updateState2();
    updateText(2300, state2Text);
  } else if (currentState === 3) {
    updateState3();
    updateText(6500, state3Text);
  } else if (currentState === 4) {
    d3.selectAll("tr")
      .style('background-color', 'white').style('opacity', 1);
    d3.selectAll("th, td")
      .style('background-color', 'white').style('opacity', 1);
    updateState1();
    setTimeout(updateState2, 2300);
    setTimeout(updateState3, 4600);
    updateText(11100, state3Text);
  }
});

$('#create-forest-back').on('click', function () {
  if (currentState > 0) {
    currentState -= 1;
  }
  if (currentState === 0) {
    d3.selectAll("tr")
      .style('background-color', 'white').style('opacity', 1);
    d3.selectAll("th, td")
      .style('background-color', 'white').style('opacity', 1);
    updateText(0, state0Text);
  } else if (currentState === 1) {
    d3.selectAll("th, td")
      .style('background-color', 'white').style('opacity', 1);
    updateText(0, state1Text);
  } else if (currentState === 2) {
    updateText(0, state2Text);
  }
});

d3.csv("data/formatted_mushroom_dataset.csv", function(error, response) {
  // console.log('createForestData:', response);
  createForestData = response.slice(0, 16);

  var table = d3.select('#create-forest-table').append('table');
  // If we want an SVG table: http://stackoverflow.com/questions/6987005/create-a-table-in-svg
  // https://www.vis4.net/blog/posts/making-html-tables-in-d3-doesnt-need-to-be-a-pain/
  var columns = [
    { head: 'Edibility', cl: 'center table-title', html: d3.f('edibility') },
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
