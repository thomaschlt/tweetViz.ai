function createForceGraph(files) {
  // Create a queue to load and process the CSV files
  const q = d3.queue();

  // Add tasks to the queue for each CSV file
  files.slice(0, 37).forEach(function (file) {
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
          id: d.tweet_id,
          date: d.tweet_datetime,
          content: d.tweet_text,
          trend: d.searched_by_hashtag,
          user: d.user_name,
          retweet: d.retweet_count,
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
  });
}

const xhr = new XMLHttpRequest();
xhr.open("GET", "/csv_files/2021-August-trends", true);
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const response = JSON.parse(xhr.responseText);
    const files = response.files;
    createForceGraph(files);

    // controls
    const gui = new dat.GUI();
    // Add button control

    const executeButton = {
      execute: function () {
        executeScript();
      },
    };

    const executeScript = () => {
      fetch("/execute_script", {
        method: "POST",
      })
        .then((response) => {
          if (response.ok) {
            alert("Your data has been updated!");
          } else {
            alert("Please try again!");
          }
        })
        .catch((error) => {
          console.error("Error executing script:", error);
          alert("Error executing script!");
        });
    };

    gui.add(executeButton, "execute").name("Refresh Data");

    fetch("/folders")
      .then((response) => response.json())
      .then((data) => {
        const folders = data.folders;
        console.log(folders);
        const controller = gui
          .add({ option: "2021-August-trends" }, "option", folders)
          .name("Select a folder");

        // Modify the onChange function to get the CSV files for the selected folder
        controller.onChange(function (value) {
          fetch(`/csv_files/${value}`)
            .then((response) => response.json())
            .then((data) => {
              const files = data.files;
              createForceGraph(files);
              console.log(files);
            });
        });
      });

    gui
      .add(
        {
          restart: function () {
            location.reload();
          },
        },
        "restart"
      )
      .name("Default Data");

    // Add button control
    const homeButton = {
      goToHome: function () {
        window.location.href = "/";
      },
    };

    gui.add(homeButton, "goToHome").name("Go to Home");
  }
};
xhr.send();
