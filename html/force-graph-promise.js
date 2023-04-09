// Define the list of CSV files
const files = [
  "test1.csv",
  "test2.csv",
  "test3.csv",
  "test4.csv",
  "test5.csv",

  // add more files as needed
];
// debug
//console.log(files);

// Create a queue to load and process the CSV files
const q = d3.queue();

// Add tasks to the queue for each CSV file
files.forEach(function (file) {
  q.defer(d3.csv, file);
});

// Define colors for each trend
const colors = ["#ff0000", "#00ff00", "#0000ff"];

// Run the queue
q.awaitAll(function (error, results) {
  if (error) throw error;

  // Process the loaded CSV data
  const nodes = [];
  const links = [];
  const trendCenters = [];

  console.log(results);

  results.forEach(function (data, i) {
    //console.log(data);
    //console.log(i + 1);
    const trend = `trend${i + 1}`;
    // Add trend center node to nodes array
    const trendCenter = {
      id: `${trend}_center`,
      content: `${trend} Center`,
      color: "#ffc107",
    };

    nodes.push(trendCenter);
    trendCenters.push(trendCenter);

    // console.log(data);
    // console.log(nodes);

    // // Create nodes for every trend
    data.forEach(function (d) {
      const node = {
        id: d.id,
        id_tweet: d.id_tweet,
        content: d.content,
        trend: trend,
        color: colors[i],
        links: [],
      };
      nodes.push(node);

      links.push({
        source: node,
        target: trendCenter,
      });
    });

    // Add links between trend centers also

    // for (k = 0; k < trendCenters.length - 1; k++) {
    //   links.push({
    //     source: trendCenters[k].id,
    //     target: trendCenters[k + 1].id,
    //   });
    //   console.log("coucou" + k);
    // }
    // links.push({
    //   souce: trendCenters[trendCenters.length - 1].id,
    //   target: trendCenters[0].id,
    //});

    // Create links between nodes of the current trend and its center
    // data.forEach(function (d) {
    //   links.push({
    //     source: d.id,
    //     target: trendCenter.id,
    //   });
    // });
  });

  // const trends = {};
  // nodes.forEach(function (node) {
  //   if (node.id.startsWith("trend")) {
  //     trends[node.id] = node;
  //   } else {
  //     const trend = node.trend;
  //     if (trends[trend]) {
  //       trends[trend].push(node);
  //     } else {
  //       trends[trend] = [node];
  //     }
  //   }
  // });

  // console.log(trends);
  // console.log(typeof nodes);

  // const center = nodes[0];
  // Object.values(nodes)
  //   .slice(1)
  //   .forEach((node) => {
  //     links.push({ source: center, target: node });
  //   });

  // Create force graph
  const Graph = ForceGraph3D()(document.getElementById("3d-graph"))
    .graphData({
      nodes: nodes,
      links: links,
    })
    .nodeLabel(function (node) {
      return `${node.id}`;
    })
    .nodeColor(function (node) {
      return node.color;
    })
    .d3Force("center", d3.forceCenter())
    .onNodeClick(function (node) {
      console.log(node.rawContent);
    });
});
