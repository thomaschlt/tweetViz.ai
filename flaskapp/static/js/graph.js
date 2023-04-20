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

    const colorScale = d3
      .scaleLinear()
      .domain([-1, 0, 1])
      .range(["red", "yellow", "green"]);

    // Run the queue
    q.awaitAll(function (error, results) {
      if (error) throw error;

      // Process the loaded CSV data
      const nodes = [];
      const links = [];
      const trendCenters = [];

      const centralNode = {
        id: "center",
        content: "Twitter Trends",
        color: "red",
      };
      nodes.push(centralNode);

      results.forEach(function (data, i) {
        const filename = files[i].split("/").pop().replace(".csv", "");
        const trend = `trend_${filename}`;

        // Add trend center node to nodes array
        const trendCenter = {
          id: `${trend}_center`,
          content: `${filename} `,
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
          var color;
          var neg = d.Roberta_neg;
          var neu = d.Roberta_neu;
          var pos = d.Roberta_pos;

          if (neg > pos && neg > neu) {
            color = colorScale(-neg);
          } else if (pos > neg && pos > neu) {
            color = colorScale(pos);
          } else {
            color = colorScale(neu);
          }

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
            neg: neg,
            neu: neu,
            pos: pos,
            color: color,
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

      // controls
      const gui = new dat.GUI();
      // Add button control
      const executeButton = {
        execute: function () {
          executeScript();
        },
      };
      gui.add(executeButton, "execute").name("Reload the data");
      gui
        .add(
          {
            restart: function () {
              location.reload();
            },
          },
          "restart"
        )
        .name("Reload the graph");

      //Function to execute script
      function executeScript() {
        // Use AJAX to POST request to Flask route "/execute_script"
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/execute_script", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            // Reload the page once the script has finished executing
            location.reload();
          }
        };
        xhr.send(JSON.stringify({}));
      }

      // Add button control
      const homeButton = {
        goToHome: function () {
          window.location.href = "/";
        },
      };
      // const myObject = {
      //   numTrends: 5,
      // };
      // gui
      //   .add(myObject, "numTrends", [5, 10, 15, 20, 25, 30])
      //   .name("Number of Trends");

      gui.add(homeButton, "goToHome").name("Go to Home");
    });
  }
};
xhr.send();
