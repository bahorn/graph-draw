#!/usr/bin/env python3
"""
Converts graphs from the format used internally by cytoscape.js to graphml.
"""
import sys
import json
import networkx as nx


def convert(file):
    """
    Convert the cytoscape format into networkx's representation.
    """
    nodes = []
    edges = []
    for element in file['elements']:
        if element['group'] == 'nodes':
            nodes.append(element['data']['id'])
        elif element['group'] == 'edges':
            edges.append(
                (element['data']['source'], element['data']['target'])
            )

    graph = nx.Graph()

    for node in nodes:
        graph.add_node(node)
    for edge in edges:
        graph.add_edge(*edge)

    return graph


def main(argv):
    """
    Main
    """
    if len(argv) < 3:
        return
    file = json.load(open(argv[1]))
    nx_graph = convert(file)
    nx.write_graphml(nx_graph, argv[2])


if __name__ == "__main__":
    main(sys.argv)
