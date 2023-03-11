d3.csv("mini.csv", function (data) {
  var nodes = [];
  data.forEach(function (d) {
    var node = {
      id: d.id,
      id_tweet: d.id_tweet,
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

  var width = window.innerWidth;
  var height = window.innerHeight;

  var svg = d3
    .select("#my-svg")
    .attr("width", width)
    .attr("height", height)
    .call(
      d3
        .zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", function () {
          svg.attr("transform", d3.event.transform);
        })
    );

  var simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force(
      "collide",
      d3.forceCollide().radius((d) => d.likeCount * 10)
    );

  function getNodeColor(negativeScore, neutralScore, sentimentScore) {
    // Map negative score to red
    let red;
    if (negativeScore > 0) {
      red = 255;
    } else {
      red = Math.round((1 + negativeScore) * 255);
    }

    // Map neutral score to yellow
    let yellow = Math.round((1 - Math.abs(neutralScore)) * 255);

    // Map sentiment score to green
    let green;
    if (sentimentScore > 0) {
      green = Math.round((1 - sentimentScore) * 255);
    } else {
      green = 255;
    }

    // Convert RGB values to hex color code
    let color = "#" + rgbToHex(red, yellow, green);

    return color;
  }

  function rgbToHex(red, green, blue) {
    let rHex = red.toString(16).padStart(2, "0");
    let gHex = green.toString(16).padStart(2, "0");
    let bHex = blue.toString(16).padStart(2, "0");
    return rHex + gHex + bHex;
  }

  var node = svg
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 20)
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
