var margin = {top: 20, right: 120, bottom: 20, left: 180},
    width = 960 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root;

let colors =["#003f5c", "#2f4b7c", "#665191", "#a05195", 
              "#d45087", "#f95d6a", "#ff7c43", "#ffa600", 
              "#fee090", "#abd9e9", "#58D99B"];


var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection((d) => { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("sonagiLocations_tree3.json", function(error, sonagi) {
  if (error) throw error;

  root = sonagi;
  root.x0 = height / 2;
  root.y0 = 0;

  root.children.forEach(collapse);
  update(root);

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }
  
});

d3.select(self.frameElement).style("height", "800px");

function update(source) {
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach((d) => { 
    if (d.depth == 1) {
      d.y = 0; //depth = level
    } else if (d.depth == 2) {
      d.y = d.depth * 20; 
    } else if (d.depth ==0) {
      d.y = -50; 
    }
  });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, (d) => { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", (d) => { 
        return "translate(" + source.y0 + "," + source.x0 + ")"; 
      })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      // .style("fill", (d) => { return colors[d.id - 1] })
      .style("fill", (d) => { return d._children ? colors[d.id - 1] :colors[d.id - 1]; });

let text =  nodeEnter.append("text")
      .attr("x", (d) => { return d.children || d._children ? -10 : 10; })
      .attr("y", (d) => { return  0;})
      // .attr("y", (d) => { return d.children || d._children ? -15 : 0; })
      .attr("dy", ".35em")
      .attr("text-anchor", (d) => { return d.children || d._children ? "end" : "start"; })
      .text((d) => { return d.name; })
      .style("fill-opacity", 1e-6);
      
  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", (d) => { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", (d)=> {
        if (d.depth === 0) { // 
          return 8;
        } else if (d.depth ===1){
          return 5;
        } else {
          return 2.5;
        }
      })
      // .style("fill", (d) => { return d._children ? colors[d.id - 1] : "#f1e583"; });
      .style("fill", (d) => { 
        if (d.depth === 1 || d.depth === 0) {
        return colors[d.id - 1] }
        else if (d.depth === 2) {
          return colors[d.parent.id - 1] 
        }
      });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", (d) => { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, (d) => { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", (d) => {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", (d) => {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach((d) => {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// // Toggle children on click.
function click(d) {

  console.log("d is", d);
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}