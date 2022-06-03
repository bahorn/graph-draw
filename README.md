# Graph Drawing Thing

Really basic and terrible undirected graph drawer, built with
[cytoscape.js](https://js.cytoscape.org).

Written so I could draw some gadgets I needed in a proof and run some tests on
them.

## Usage

Start the UI with:

```
# setup the graph convert script
virtualenv -p python3 .venv
source .venv/bin/activate
pip install networkx

# the editor
cd web
bower install cytoscape cytoscape-cxtmenu
python3 -m http.server
```

Commands are as follows:

* Click to create a node
* Right click a vertex to access a menu to either delete or add the selected
  vertices as an edge to this vertex.
* Right click an edge to delete it.
* You can highlight multiple vertices by holding shift.
* Click save in the corner to download the graph, then run `convert.py` to
  convert the downloaded file to a graphml.
* `output.json` (not the graphml) can be loaded back in by dragging and
  dropping it back into the browser window.

## License

MIT

Some code is from the [cytoscape documentation](https://github.com/cytoscape/cytoscape.js/tree/master)
, under MIT as well.
