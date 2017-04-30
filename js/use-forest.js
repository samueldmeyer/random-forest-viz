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
      .attr('r', 30);
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
    svg.selectAll('.decision-dot')
      .data(treeList)
      .attr('fill', 'gray')
      .transition()
      .duration(1000)
      .attr('fill', function(d) {return d.color === "green" ? "rgb(198, 239, 213)" : "rgb(180, 156, 193)"})
      .transition()
      .duration(2000)
      .attr('cx', function(d) {
        if (d.color==="red") {
          return 510 + 70 * redIndex.next().value;
        } else {
          return 510 - 70 * greenIndex.next().value;
        }
      })
      .attr('cy', 500);
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
      .text("Mushroom is edible!")
      .attr("font-family", 'Roboto", sans-serif')
      .attr("font-size", "10px")
      .attr("fill", "black")
      .attr("x", 440)
      .attr("y", 450)
      .transition()
      .duration(1000)
      .ease(d3.easeBackOut.overshoot(2))
      .attr("x", 400)
      .attr("y", 450)
      .attr('font-size', '20px');
  }
  function reverse3() {
    svg.select('text')
    .transition()
    .attr('x', 440)
    .attr('font-size', '10px')
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
    .attr("xlink:href", function(d, i) {return "img/tree_icons/tree_" + i + ".png"})
    .attr("width", 88)
    .attr("height", 91)
    // .attr("xlink:href","img/noun_337864_cc.svg")
    .attr('x', d3.f('x'))
    .attr('y', d3.f('y'));
  $('input[type=radio][name=use-forest-radio]').on('change', function() {
    if (this.id == 'start-use') {
      if (currentState === 1) {
        reverse1();
      } else if (currentState === 2) {
        reverse2();
        reverse1();
      } else if (currentState === 3) {
        reverse3();
        reverse2();
        reverse1();
      }
      currentState = 0;
      updateText(3000, 'Click on "Send Copies" to send copies of the features of the mushroom to each tree.');
    } else if (this.id == 'copies-use') {
      if (currentState === 0) {
        transition1();
      } else if (currentState === 2) {
        reverse2();
      } else if (currentState === 3) {
        reverse3();
        reverse2();
      }
      currentState = 1;
      updateText(3000, 'Click on "Vote" to have each tree decide whether it believes the mushroom is poinsonous or not.');
    } else if (this.id == 'vote-use') {
      if (currentState === 1) {
        transition2();
      } else if (currentState === 0) {
        transition1();
        setTimeout(transition2, 4500);
      } else if (currentState === 3) {
        reverse3();
      }
      currentState = 2;
      updateText(2000, 'Click on "End" to see the final result.');
    } else if (this.id == 'end-use') {
      if (currentState === 2) {
        transition3();
      } else if (currentState === 1) {
        transition2();
        transition3();
      } else if (currentState === 0) {
        transition1();
        setTimeout(transition2, 4500);
        setTimeout(transition3, 4500);
      }
      currentState = 3;
      updateText(1000, 'Based on the random forest, the mushroom is probably not poinsonous. Enjoy!');
    }
  });
})();
