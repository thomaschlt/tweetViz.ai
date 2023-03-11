var noeuds = [{ id: "0", id_tweet: "central_node" }];

d3.csv("mini.csv", function (data) {
  data.forEach(function (d) {
    noeuds.push({ id: d.id, id_tweet: d.id_tweet });
  });

  var liens = [];
  for (var k = 1; k < noeuds.length; k++) {
    liens.push({ source: 0, target: k });
  }

  //Initialisation du graphe 3D avec les noeuds
  const Graph = ForceGraph3D()(document.getElementById("3d-graph")).graphData({
    nodes: noeuds,
    links: liens,
  });
});
