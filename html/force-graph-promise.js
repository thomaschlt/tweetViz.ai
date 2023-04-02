// Define the list of CSV files
const files = [
  "test1.csv",
  "test2.csv",
  "test3.csv",
  // add more files as needed
];

console.log(files);

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

  results.forEach(function (data, i) {
    const trend = `trend${i + 1}`;
    const trendCenter = {
      id: `${trend}_center`,
      content: `${trend} Center`,
      color: "#ffc107",
    };

    // Create nodes for the current trend
    data.forEach(function (d) {
      nodes.push({
        id: d.id,
        id_tweet: d.id_tweet,
        content: d.content,
        trend: trend,
        color: colors[i],
        links: [],
      });
    });

    // Add trend center node to nodes array
    nodes.push(trendCenter);

    // Create links between nodes of the current trend and its center
    data.forEach(function (d) {
      links.push({
        source: d.id,
        target: trendCenter.id,
      });
    });
  });

  // Create force graph
  const Graph = ForceGraph3D()(document.getElementById("3d-graph"))
    .graphData({
      nodes: nodes,
      links: links,
    })
    .nodeLabel(function (node) {
      return `${node.content}`;
    })
    .nodeColor(function (node) {
      return node.color;
    })
    .d3Force("center", d3.forceCenter())
    .onNodeClick(function (node) {
      console.log(node.id);
    });
});
