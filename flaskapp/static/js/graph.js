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

      const centralNode = {
        id: "center",
        content: "Central node",
        color: "red",
      };
      nodes.push(centralNode);

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

        // Add link from central node to trend center
        links.push({
          source: centralNode,
          target: trendCenter,
        });

        // Create nodes for every trend
        data.forEach(function (d) {
          const node = {
            id: d.id,
            date: d.date,
            content: d.rawContent,
            trend: trend,
            user: d.user,
            reply: d.replyCount,
            retweet: d.retweetCount,
            like: d.likeCount,
            quote: d.quoteCount,
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
          return `${node.content}`;
        })
        .nodeColor(function (node) {
          return node.color;
        })
        .nodeVal(function (node) {
          if (node.id === "center" || node.id.includes("_center")) {
            return 50;
          }
        })
        .linkWidth(1)
        .linkDirectionalParticles(2)
        .linkDirectionalParticleSpeed(0.007)
        .nodeOpacity(0.75)
        .onNodeClick(function (node) {
          // Center the graph on the clicked node
          Graph.cameraPosition(
            {
              x: node.x,
              y: node.y,
              z: node.z + 150,
            },
            node,
            1000
          );
        })
        .d3Force("center", d3.forceCenter());
    });
  }
};
xhr.send();
