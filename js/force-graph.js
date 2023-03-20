var noeuds = [
  { id: "1000", id_tweet: "central_node", content: "center", color: "#ffc107" },
];

d3.csv("../data/final.csv", function (data) {
  const colorScale = d3
    .scaleLinear()
    .domain([-1, 0, 1])
    .range(["red", "yellow", "green"]);
  //échelle bien implémentée

  data.forEach(function (d) {
    var color;
    var neg = d.Roberta_neg;
    var neu = d.Roberta_neu;
    var pos = d.Roberta_pos;

    if (neg > pos && neg > neu) {
      color = colorScale(neg);
    } else if (pos > neg && pos > neu) {
      color = colorScale(pos);
    } else {
      color = colorScale(neu);
    }
    noeuds.push({
      id: d.id,
      id_tweet: d.id_tweet,
      content: d.rawContent,
      neg: neg,
      neu: neu,
      pos: pos,
      color: color,
    });
  });

  var liens = [];
  for (var k = 1; k < noeuds.length; k++) {
    liens.push({ source: noeuds[0].id, target: noeuds[k].id });
  }

  //console.log(liens) - debug

  //Initialisation du graphe 3D avec les noeuds
  const Graph = ForceGraph3D()(document.getElementById("3d-graph"))
    .graphData({
      nodes: noeuds,
      links: liens,
    })
    .nodeLabel((node) => `${node.content}`)
    .nodeColor((node) => node.color)
    .d3Force("center", d3.forceCenter())
    .onNodeClick(
      (node) =>
        (window.location.href = `tweetWidget.html?tweet_id=${node.id_tweet}`)
    );
});
