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
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function transition1() {
    svg.selectAll('.decision-mushroom')
      .data(treeList)
      .enter()
      .append('image').attr("xlink:href","img/noun_990340_cc.svg")
      // .append('image').attr("xlink:href",function(d, i) {return "tree_" + i + ".svg"})
      .attr('class', 'decision-mushroom')
      .attr("x", function(d) {return d.x + 1})
      .attr("y", 150)
      .attr("width", 20)
      .attr("height", 20)
      .transition()
      .delay(function(d, i) {
        return 10 * i;
      }).duration(2000)
      .attr("x", function(d) {return d.x + 2;})
      .attr("y", function(d) {return d.y + 2;})
      .transition()
      .duration(1000)
      .attr("width", 0)
      .attr("height", 0)
      .attr("x", function(d) {return d.x + 12;})
      .attr("y", function(d) {return d.y + 12;})
      .remove()
    svg.selectAll('.decision-dot')
      .data(treeList)
      .enter()
      .append('circle')
      .attr('class', 'decision-dot')
      .attr('r', 0)
      .attr('fill', "gray") // d3.f('color')
      .attr('cy', function(d) {return d.y + 10;}) //d3.f('y'))
      .attr('cx', function(d) {return d.x + 10;}) // d3.f('x'))
      .transition()
      .delay(3500)
      .duration(1000)
      .attr('r', 10);
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
      var index = 0;
      while(true)
        yield index++;
    }
    var redIndex = idMaker();
    var redIndex2 = idMaker();
    var greenIndex = idMaker();
    var greenIndex2 = idMaker();
    var decisionDot = svg.selectAll('.decision-dot').data(treeList);
    decisionDot.enter()
      .append('circle')
      .attr('class', 'decision-dot')
      .attr('fill', "gray") // d3.f('color')
      .attr('cy', function(d) {return d.y + 5;}) //d3.f('y'))
      .attr('cx', function(d) {return d.x + 5;}) // d3.f('x'))
      .attr('r', 10);
    decisionDot.attr('fill', 'gray').attr('r', 10)
      .transition()
      .duration(1000)
      .attr('fill', function(d) {return d.color === "green" ? "rgb(198, 239, 213)" : "rgb(180, 156, 193)"})
      .transition()
      .duration(2000)
      .delay(function(d, i) {
        return 10 * i;
      }).attr('cx', function(d) {
        if (d.color==="red") {
          return 460 + 20 + 20 * (redIndex.next().value % 20);
        } else {
          return 460 - 20 - 20 * (greenIndex.next().value % 20);
        }
      }).attr('cy', function(d) {
        if (d.color==="red") {
          return 430 + 20 * Math.floor(redIndex2.next().value / 20);
        } else {
          return 430 + 20 * Math.floor(greenIndex2.next().value / 20);
        }
      }); //450
  }
  function reverse2() {
    svg.selectAll('.decision-dot')
      .data(treeList)
      .transition()
      .duration(1000)
      .attr('cy', function(d) {return d.y + 10;})
      .attr('cx', function(d) {return d.x + 10;})
      .attr('fill', 'gray');
  }
  function transition3() {
    svg.append("text")
      .text("58 vote edible")
      .attr("font-family", 'Roboto", sans-serif')
      .attr("font-size", "10px")
      .attr("fill", "black")
      .attr("x", 350)
      .attr("y", 512)
      .transition()
      .duration(1000)
      .ease(d3.easeBackOut.overshoot(2))
      .attr("x", 310)
      .attr("y", 512)
      .attr('font-size', '20px');
    setTimeout(function() {
      svg.append("text")
      .text("7 vote poisonous")
      .attr("font-family", 'Roboto", sans-serif')
      .attr("font-size", "10px")
      .attr("fill", "black")
      .attr("x", 530)
      .attr("y", 512)
      .transition()
      .duration(1000)
      .ease(d3.easeBackOut.overshoot(2))
      .attr("x", 490)
      .attr("y", 512)
      .attr('font-size', '20px');
    }, 1000);
  }
  function reverse3() {
    svg.selectAll('text')
      .remove();
  }
  var svg = d3.select('#use-forest svg');
  var currentState = 0;

  var redList = [132,235,224,186,159,87,151,0,166,19,179,184,135,227,229,
                 106,109,234,149, 23, 27, 39, 62, 51]
  var treeList = [];
  for (let j = 0; j < 5; j++) {
    for (let i = 0; i < 13; i++) {
      treeList.push({
        x: 207 + i * 40,
        y: 200 + j * 40,
        color: redList.indexOf(i+j*25) === -1 ? "green" : "red"
      })
    }
  }
  svg.append("image").attr("xlink:href","img/noun_990340_w_arrows.svg")
    .attr("x", 340)
    .attr("y", 0)
    .attr("width", 230)
    .attr("height", 150);
  svg.selectAll('.d-tree')
    .data(treeList)
    .enter()
    .append('image')
    .attr('class', 'd-tree')
    .attr("xlink:href", function(d, i) {return "img/tree_icons/tree_" + getRandomInt(0,9) + ".png"})
    .attr("width", 20)
    .attr("height", 22)
    // .attr("xlink:href","img/noun_337864_cc.svg")
    .attr('x', d3.f('x'))
    .attr('y', d3.f('y'));

  var state0Text = 'Here, we have 65 trees. We send copies of the features of the mushroom to each tree.';
  var state1Text = 'Next, we have each tree decide whether it believes the mushroom is poisonous or not.';
  var state2Text = 'Next, we tally the votes to see the final result.';
  var state3Text = 'By a vote of 58-7, the forest has decided that the mushroom is edible.';
  $('#use-step-text').text(state0Text);
  $('#use-forest-next').on('click', function() {
    switch (currentState) {
      case 0:
        transition1();
        updateText(4000, state1Text);
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
