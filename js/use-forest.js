(function () {
  function updateText(delay, text) {
    d3.select('#use-step-text')
      .transition()
      .duration(500)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay(delay)
      .text(text)
      .style("opacity", 1);
  }
  var currentState = 0;
  function transition1() {
    svg.selectAll('.decision-mushroom')
      .data(treeList)
      .enter()
      .append('image').attr("xlink:href","img/noun_990340_cc.svg")
      // .append('image').attr("xlink:href",function(d, i) {return "tree_" + i + ".svg"})
      .attr('class', 'decision-mushroom')
      .attr("x", function(d) {return d.x + 20})
      .attr("y", 150)
      .attr("width", 50)
      .attr("height", 50)
      .transition()
      .delay(1000)
      .duration(2000)
      .attr("x", function(d) {return d.x + 20;})
      .attr("y", function(d) {return d.y + 20;})
      .transition()
      .duration(1000)
      .attr("width", 0)
      .attr("height", 0)
      .attr("x", function(d) {return d.x + 45;})
      .attr("y", function(d) {return d.y + 45;})
      .remove()
    svg.selectAll('.decision-dot')
      .data(treeList)
      .enter()
      .append('circle')
      .attr('class', 'decision-dot')
      .attr('r', 0)
      .attr('fill', "gray") // d3.f('color')
      .attr('cy', function(d) {return d.y + 40;}) //d3.f('y'))
      .attr('cx', function(d) {return d.x + 40;}) // d3.f('x'))
      .transition()
      .delay(3000)
      .duration(1000)
      .attr('r', 20);
  }
  function reverse1() {
    svg.selectAll('.decision-dot')
      .data(treeList)
      .transition()
      .duration(1000)
      .attr('r', 0)
      .remove();
  }
  function transition2() {
    function* idMaker() {
      var index = 1;
      while(true)
        yield index++;
    }
    var redIndex = idMaker();
    var greenIndex = idMaker();
    var decisionDot = svg.selectAll('.decision-dot').data(treeList);
    decisionDot.enter()
      .append('circle')
      .attr('class', 'decision-dot')
      .attr('fill', "gray") // d3.f('color')
      .attr('cy', function(d) {return d.y + 40;}) //d3.f('y'))
      .attr('cx', function(d) {return d.x + 40;}) // d3.f('x'))
      .attr('r', 20);
    decisionDot.attr('fill', 'gray').attr('r', 20)
      .transition()
      .duration(1000)
      .attr('fill', function(d) {return d.color === "green" ? "rgb(198, 239, 213)" : "rgb(180, 156, 193)"})
      .transition()
      .duration(2000)
      .attr('cx', function(d) {
        if (d.color==="red") {
          return 510 + 50 * redIndex.next().value;
        } else {
          return 510 - 50 * greenIndex.next().value;
        }
      })
      .attr('cy', 450);
  }
  function reverse2() {
    svg.selectAll('.decision-dot')
      .data(treeList)
      .transition()
      .duration(1000)
      .attr('cy', function(d) {return d.y + 40;})
      .attr('cx', function(d) {return d.x + 40;})
      .attr('fill', 'gray');
  }
  function transition3() {
    svg.append("text")
      .text("4 vote edible")
      .attr("font-family", 'Roboto", sans-serif')
      .attr("font-size", "10px")
      .attr("fill", "black")
      .attr("x", 400)
      .attr("y", 512)
      .transition()
      .duration(1000)
      .ease(d3.easeBackOut.overshoot(2))
      .attr("x", 360)
      .attr("y", 512)
      .attr('font-size', '20px');
    setTimeout(function() {
      svg.append("text")
      .text("1 votes poisonous")
      .attr("font-family", 'Roboto", sans-serif')
      .attr("font-size", "10px")
      .attr("fill", "black")
      .attr("x", 580)
      .attr("y", 512)
      .transition()
      .duration(1000)
      .ease(d3.easeBackOut.overshoot(2))
      .attr("x", 540)
      .attr("y", 512)
      .attr('font-size', '20px');
    }, 1000);
  }
  function reverse3() {
    svg.selectAll('text')
      .remove();
  }
  var svg = d3.select('#use-forest svg');
  var treeList = [
    {
      x: 400,
      y: 200,
      color: "green"
    }, {
      x: 500,
      y: 200,
      color: "red"
    }, {
      x: 550,
      y: 300,
      color: "green"
    }, {
      x: 450,
      y: 300,
      color: "green"
    }, {
      x: 350,
      y: 300,
      color: "green"
    }
  ]
  svg.append("image").attr("xlink:href","img/noun_990340_w_arrows.svg")
    .attr("x", 390)
    .attr("y", 0)
    .attr("width", 230)
    .attr("height", 150);
  svg.selectAll('.d-tree')
    .data(treeList)
    .enter()
    .append('image')
    .attr('class', 'd-tree')
    .attr("xlink:href", function(d, i) {return "img/tree_icons/tree_" + i + ".svg"})
    .attr("width", 88)
    .attr("height", 91)
    // .attr("xlink:href","img/noun_337864_cc.svg")
    .attr('x', d3.f('x'))
    .attr('y', d3.f('y'));

  var state0Text = 'First, we send copies of the features of the mushroom to each tree.';
  var state1Text = 'Next, we have each tree decide whether it believes the mushroom is poisonous or not.';
  var state2Text = 'Next, we tally the votes to see the final result.';
  var state3Text = 'By a vote of 4-1, the forest has decided that the mushroom is edible.';
  $('#use-step-text').text(state0Text);
  $('#use-forest-next').on('click', function() {
    switch (currentState) {
      case 0:
        transition1();
        updateText(3000, state1Text);
        $('#use-forest-back').removeClass('disabled');
        break;
      case 1:
        transition2();
        updateText(3000, state2Text);
        break;
      case 2:
        transition3();
        updateText(2000, state3Text);
        $('#use-forest-next').addClass('disabled');
        break;
      case 3:
        break;
      default:
        break;
    }
    if (currentState < 3) {
      currentState += 1;
    }
  });

  $('#use-forest-back').on('click', function() {
    switch (currentState) {
      case 0:
        break;
      case 1:
        reverse1();
        updateText(1000, state0Text);
        $('#use-forest-back').addClass('disabled');
        break;
      case 2:
        reverse2();
        updateText(1000, state1Text);
        break;
      case 3:
        reverse3();
        updateText(0, state2Text);
        $('#use-forest-next').removeClass('disabled');
        break;
      default:
        break;
    }
    if (currentState > 0) {
      currentState -= 1;
    }
  });
})();
