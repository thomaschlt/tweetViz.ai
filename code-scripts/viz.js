d3.csv("withScores.csv", function (data) {
  var nodes = [];
  data.forEach(function (d) {
    var node = {
      id: d.id,
      date: new Date(d.date),
      content: d.rawContent,
      user: d.user,
      replyCount: d.replyCount,
      retweetCount: d.retweetCount,
      likeCount: d.likeCount,
      quoteCount: d.quoteCount,
      sentiment: {
        negative: d.Roberta_neg,
        neutral: d.Roberta_neu,
        positive: d.Roberta_pos,
      },
    };
    nodes.push(node);
  });
  var svg = d3.select("#my-svg").call(
      d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform);
      })
    ),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  var simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(10));

  var node = svg
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("fill", "steelblue");

  var label = svg
    .append("g")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("dy", ".35em")
    .text(function (d) {
      return d.id;
    });

  simulation.on("tick", function () {
    node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });

    label
      .attr("x", function (d) {
        return d.x + 8;
      })
      .attr("y", function (d) {
        return d.y;
      });
  });
});
