(function(){
  window.cy = cytoscape({
    container: document.getElementById('cy'),

    style: fetch('cy-style.json').then(function(res){
      return res.json();
    }),

    elements: []
  });

  let defaults = {
    menuRadius: function(ele){ return 100; },
    selector: 'node',
    commands: [
      {
        content: 'Delete',
        select: function (ele) {
          cy.remove(ele);
        },
        enabled: true
      },
      /*
      {
        content: 'Label',
        select: function (ele) {
        },
        enabled: true
      },
      */
      {
        content: 'Connect',
        select: function (ele) {
          let selected = cy.$(':selected').jsons();
          selected.forEach((vertex) => {
            if (vertex.group != 'nodes') {
              return;
            }

            let src = ele.id();
            let dst = vertex.data.id;

            if (src == dst) {
              return;
            }

            /* Avoiding creating duplicate edges */
            let labels = [src, dst].sort();
            src = labels[0];
            dst = labels[1];
            
            window.cy.add({
              group: 'edges',
              data: {
                id: src + "_" + dst,
                source: src,
                target: dst
              }
            });
          });

        },
        enabled: function () {
          return cy.$(':selected').length > 1;
        }
      }
    ], 
    fillColor: 'rgba(0, 0, 0, 0.75)',
    activeFillColor: 'rgba(1, 105, 217, 0.75)', 
    activePadding: 20,
    indicatorSize: 24,
    separatorWidth: 3,
    spotlightPadding: 4,
    adaptativeNodeSpotlightRadius: false,
    minSpotlightRadius: 24,
    maxSpotlightRadius: 38,
    openMenuEvents: 'cxttapstart taphold',
    itemColor: 'white',
    itemTextShadowColor: 'transparent',
    zIndex: 9999,
    atMouse: false,
    outsideMenuCancel: false
  };

  let menu = window.cy.cxtmenu(defaults);

  window.cy.on('tap', (event) => {
    if (event.target != cy) {
      return;
    }
    /* Add a vertex */
    cy.add({
      group: 'nodes',
      position: {x: event.position.x, y: event.position.y}
    });
  });

  window.cy.on('cxttap', (event) => {
    if (event.target == cy) {
      return;
    }
    /* Check if it's an edge */
    if (event.target.group() == "edges") {
      cy.remove(event.target);
    }
  });

})();

// https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function save() {
  if (!window.cy) {
    return;
  }
  

  download(JSON.stringify(window.cy.json(true)), "output.json", "text/json");
}

function dropHandler(ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);
        file.text().then(
          value => {window.cy.json(JSON.parse(value))}
        ).catch(
          err => { console.log(err)}
        );
      }
      /* only access the first file */
      break;
    }
  }
}

function dragOverHandler(ev) {
  console.log('File(s) in drop zone');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}


