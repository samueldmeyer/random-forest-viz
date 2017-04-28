(function () {
  $('#use-forest-button').on('click', function() {
    var svg = d3.select('#use-forest svg');
    svg.selectAll("*").remove();
    svg.append("image").attr("xlink:href","img/noun_990340_w_arrows.svg")
      .attr("x", 390)
      .attr("y", 0)
      .attr("width", 230)
      .attr("height", 150);
      // .transition()
      // .duration(1000)
      // .attr("width", 100)
      // .attr("height", 100)
      // .attr("x", x - 50)
      // .attr("y", y - 50);


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

    svg.selectAll('.d-tree')
      .data(treeList)
      .enter()
      .append('image')
      .attr('class', 'd-tree')
      .attr("xlink:href", function(d, i) {return "img/tree_icons/tree_" + i + ".png"})
      // .attr("xlink:href","img/noun_337864_cc.svg")
      .attr('x', d3.f('x'))
      .attr('y', d3.f('y'));

    svg.selectAll('.decision-mushroom')
      .data(treeList)
      .enter()
      .append('image').attr("xlink:href","img/noun_990340_cc.svg")
      // .append('image').attr("xlink:href",function(d, i) {return "tree_" + i + ".svg"})
      .attr('class', 'decision-mushroom')
      .attr("x", function(d) {return d.x + 30})
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

    function* idMaker() {
      var index = 1;
      while(true)
        yield index++;
    }

    var redIndex = idMaker();
    var greenIndex = idMaker();

    svg.selectAll('.decision-dot')
      .data(treeList)
      .enter()
      .append('circle')
      .attr('r', 0)
      .attr('fill', "gray") // d3.f('color')
      .attr('cy', function(d) {return d.y + 40;}) //d3.f('y'))
      .attr('cx', function(d) {return d.x + 40;}) // d3.f('x'))
      .transition()
      .delay(3000)
      .duration(1000)
      .attr('r', 30)
      .transition()
      .duration(1000)
      .attr('fill', function(d) {return d.color})
      .transition()
      .duration(2000)
      .attr('cx', function(d) {
        if (d.color==="red") {
          return 510 + 70 * redIndex.next().value;
        } else {
          return 510 - 70 * greenIndex.next().value;
        }
      })
      .attr('cy', 500)
      .filter(function(d, i) {return i === 1;})
      .on('end', function() {
        svg.append("text")
          .text("Mushroom is edible!")
          .attr("font-family", 'Roboto", sans-serif')
          .attr("font-size", "20px")
          .attr("fill", "black")
          .attr("x", 400)
          .attr("y", 570);
      });
  });
})();
