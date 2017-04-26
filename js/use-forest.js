(function () {
  $('#use-forest-button').on('click', function() {
    var svg = d3.select('#use-forest svg');
    svg.append("image").attr("xlink:href","img/noun_990340_cc.svg")
      .attr("x", 450)
      .attr("y", 150)
      .attr("width", 100)
      .attr("height", 100);
      // .transition()
      // .duration(1000)
      // .attr("width", 100)
      // .attr("height", 100)
      // .attr("x", x - 50)
      // .attr("y", y - 50);


    var treeList = [
      {
        x: 350,
        y: 100,
        color: "red"
      }, {
        x: 550,
        y: 100,
        color: "red"
      }, {
        x: 450,
        y: 0,
        color: "green"
      }, {
        x: 450,
        y: 250,
        color: "red"
      }
    ]

    svg.selectAll('.d-tree')
      .data(treeList)
      .enter()
      .append('image')
      .attr('class', 'd-tree')
      .attr("xlink:href","img/noun_337864_cc.svg")
      .attr('x', d3.f('x'))
      .attr('y', d3.f('y'));

    svg.selectAll('.decision-mushroom')
      .data(treeList)
      .enter()
      .append('image').attr("xlink:href","img/noun_990340_cc.svg")
      .attr('class', 'decision-mushroom')
      .attr("x", 450)
      .attr("y", 150)
      .attr("width", 100)
      .attr("height", 100)
      .transition()
      .duration(2000)
      .attr("width", 0)
      .attr("height", 0)
      .attr("x", function(d) {return d.x + 50;})
      .attr("y", function(d) {return d.y + 50;})
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
      .attr('fill', function(d) {return d.color}) // d3.f('color')
      .attr('cy', function(d) {return d.y + 50;}) //d3.f('y'))
      .attr('cx', function(d) {return d.x + 50;}) // d3.f('x'))
      .transition()
      .delay(2000)
      .attr('r', 30)
      .transition()
      .duration(2000)
      .attr('cx', function(d) {
        if (d.color==="red") {
          return 510 + 70 * redIndex.next().value;
        } else {
          return 510 - 70 * greenIndex.next().value;
        }
      })
      .attr('cy', 350)
      .each(function(d) {console.log(d.color);});
  });
})();
