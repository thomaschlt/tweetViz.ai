//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fonction qui permet de traiter les fichiers CSV et d'afficher un graphe des données en question      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function createForceGraph(files) {
  // Crée une file d'attente pour charger et traiter les fichiers CSV
  const q = d3.queue();

  // Ajoute des tâches à la file d'attente pour chaque fichier CSV
  files.slice(0, 37).forEach(function (file) {
    q.defer(d3.csv, file);
  });

  // Définition des palettes de couleur pour les noeuds central et périphérique
  const centerColorScale = d3
    .scaleOrdinal(d3.schemeCategory20)
    .domain(d3.range(files.length));

  const colorScale = d3
    .scaleLinear()
    .domain([-1, 0, 1])
    .range(["red", "yellow", "green"]);

  // Exécute la file d'attente
  q.awaitAll(function (error, results) {
    if (error) throw error;

    // Définition des éléments du graphe
    const nodes = [];
    const links = [];
    const trendCenters = [];

    // Définition du noeud central
    const centralNode = {
      id: "center",
      content: "Twitter Trends",
      color: "red",
    };
    nodes.push(centralNode);

    results.forEach(function (data, i) {
      const filename = files[i].split("/").pop().replace(".csv", "");
      const trend = `trend_${filename}`;

      // Ajoute des noeuds centraux pour chaque tendance
      const trendCenter = {
        id: `${trend}_center`,
        content: `${filename} `,
        color: centerColorScale(i),
      };

      nodes.push(trendCenter);
      trendCenters.push(trendCenter);

      // Ajout de connexions entre chaque noeud central de tendance et le noeud central du graphe
      links.push({
        source: centralNode,
        target: trendCenter,
      });

      // Ajout d'un noeud pour chaque tweet
      data.forEach(function (d) {
        var color;
        var neg = d.Roberta_neg;
        var neu = d.Roberta_neu;
        var pos = d.Roberta_pos;

        // Défintion de sa couleur suivant l'échelle et en fonction des coefficients de sentiments
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

    // Défintion du graphique fondé sur les forces
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
        // Animation de centrage du noeud cliqué
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
      // Définition d'une force centrale pour que les noeuds se repoussent entre eux
      .d3Force("center", d3.forceCenter());
  });
}
///////////////////////////////////////////////////////////////////////////////////////////
// Mise en place d'une requête asynchrone pour gérer les transferts de fichiers CSV      //
///////////////////////////////////////////////////////////////////////////////////////////

const xhr = new XMLHttpRequest();
xhr.open("GET", "/csv_files/2021-August-trends", true);
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const response = JSON.parse(xhr.responseText);
    const files = response.files;
    createForceGraph(files);

    // Définition d'un panneau de contrôle
    const gui = new dat.GUI();

    // Ajout d'un bouton pour scraper les données en live
    const executeButton = {
      execute: function () {
        executeScript();
      },
    };
    gui.add(executeButton, "execute").name("Refresh Data");

    // Ajout d'un bouton pour recharger les données par défaut et le graphe
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

    // Ajout d'un bouton pour retourner à la page d'accueil
    const homeButton = {
      goToHome: function () {
        window.location.href = "/";
      },
    };
    gui.add(homeButton, "goToHome").name("Go to Home");

    //////////////////////////////////////
    // Fonctions reliées aux boutons    //
    //////////////////////////////////////

    // Fonction qui lance le script de scraping en live
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

    // Fonction qui récupère les dossiers et les fichiers CSV
    fetch("/folders")
      .then((response) => response.json())
      .then((data) => {
        const folders = data.folders;
        console.log(folders);
        const controller = gui
          .add({ option: "2021-August-trends" }, "option", folders)
          .name("Select a folder");

        // Réagit au clic de l'utilisateur pour recharger un graphe adapté aux données qu'il souhaite observer
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
  }
};
xhr.send();
