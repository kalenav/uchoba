class Node {
    _data;

    constructor(data) {
        this._data = data;
    }
}

class Arc {
    _directed;

    constructor(source, destination, directed = true) {
        this._source = source;
        this._destination = destination;
        this._directed = directed;
    }

    get isDirected() {
        return this._directed;
    }

    get source() {
        return this._source;
    }

    get destination() {
        return this._destination;
    }
}

class Graph {
    _nodes;
    _arcs;

    constructor(nodes, arcs) {
        this._nodes = nodes.slice();
        this._arcs = arcs.slice();
    }

    isConnected() {
        const untouchedNodeMarker = 1;
        const reachableUntouchedNodeMarker = 2;
        const reachableTouchedNodeMarker = 3;

        const markers = this._nodes.map(() => untouchedNodeMarker);
        markers[0] = reachableUntouchedNodeMarker;

        while (markers.some(marker => marker === reachableUntouchedNodeMarker)) {
            const someReachableUntouchedNodeIndex = markers.findIndex(marker => marker === reachableUntouchedNodeMarker);
            markers[someReachableUntouchedNodeIndex] = reachableTouchedNodeMarker;
            const someReachableTouchedNode = this._nodes[someReachableUntouchedNodeIndex];

            this._getReachableNodes(someReachableTouchedNode).forEach(adjacentNode => {
                const currAdjacentNodeIndex = this._nodes.findIndex(node => node === adjacentNode);
                if (markers[currAdjacentNodeIndex] === reachableTouchedNodeMarker) {
                    return;
                }
                markers[currAdjacentNodeIndex] = reachableUntouchedNodeMarker;
            });
        }

        return markers.filter(marker => marker === untouchedNodeMarker).length === 0;
    }

    _getReachableNodes(node) {
        return this._nodes.filter(otherNode => {
            return this._arcs.some(arc => {
                const currNodeIsSource = arc.source === node && arc.destination === otherNode;
                const currNodeIsDestination = arc.source === otherNode && arc.destination === node;
                if (arc.isDirected) {
                    return currNodeIsSource;
                } else {
                    return currNodeIsSource || currNodeIsDestination;
                }
            });
        });
    }
}