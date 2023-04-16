const xhr = new XMLHttpRequest();
xhr.open("GET", "/csv_files", true);
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const response = JSON.parse(xhr.responseText);
    const files = response.files;

    // Create a queue to load and process the CSV files
    const q = d3.queue();

    // Add tasks to the queue for each CSV file
    files.forEach(function (file) {
      q.defer(d3.csv, file);
    });

    // Define a color scale for the trendCenter nodes
    const centerColorScale = d3
      .scaleOrdinal(d3.schemeCategory20)
      .domain(d3.range(files.length));

    // Run the queue
    q.awaitAll(function (error, results) {
      if (error) throw error;

      // Process the loaded CSV data
      const nodes = [];
      const links = [];
      const trendCenters = [];

      nodes.push({
        id: 0,
        content: "center",
        color: "#1DA1F2",
      });

      results.forEach(function (data, i) {
        const trend = `trend${i + 1}`;

        // Add trend center node to nodes array
        const trendCenter = {
          id: `${trend}_center`,
          content: `${trend} Center`,
          color: centerColorScale(i),
        };

        nodes.push(trendCenter);
        trendCenters.push(trendCenter);

        // Create nodes for every trend
        data.forEach(function (d) {
          const node = {
            id: d.id,
            id_tweet: d.id_tweet,
            content: d.content,
            trend: trend,
            color: "green",
            links: [],
          };
          nodes.push(node);

          links.push({
            source: node,
            target: trendCenter,
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
          return `${node.id}`;
        })
        .nodeColor(function (node) {
          return node.color;
        })
        .d3Force("center", d3.forceCenter())
        //.nodeRelSize(5) // Set node size to 5
        .onNodeClick(function (node) {
          console.log(node.rawContent);
        });
    });
  }
};
xhr.send();
