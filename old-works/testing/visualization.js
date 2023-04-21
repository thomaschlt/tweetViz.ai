d3.csv("../processed-data/test2.csv").then(function (data) {
  var nodes = [];
  var links = [];

  // Convert CSV data into nodes and links
  data.forEach(function (d) {
    nodes.push({
      id: d.id,
      date: d.date,
      tweet_id: d.tweet_id,
      content: d.content,
      likes: d.likes,
      retweets: d.retweets,
    });

    links.push({
      source: d.id,
      target: d.tweet_id,
    });
  });

  // Define the force-directed graph layout
  var simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id(function (d) {
        return d.id;
      })
    )
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(400, 300));

  // Create links
  var link = svg
    .append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", 1);

  // Create nodes
  var node = svg
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("fill", "blue")
    .call(drag(simulation));

  // Update the position of nodes and links during the simulation
  simulation.on("tick", function () {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  });
});

function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
