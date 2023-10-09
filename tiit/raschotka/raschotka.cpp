#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include <stdio.h>

struct Node
{
    int adjacentqty = 0, val;
    Node** adjacent;
};

struct Graph
{
    int nodeqty;
    Node** nodes;
};

void fillTestNodeValues(Graph* graph)
{
    for (int currnode = 1; currnode <= (*graph).nodeqty; currnode++)
    {
        (*graph).nodes[currnode]->val = currnode;
    }
}

void allocMemoryFor(Graph* graph)
{
    (*graph).nodes = new Node* [graph->nodeqty + 1];
    for (int currnode = 1; currnode <= (*graph).nodeqty; currnode++)
    {
        (*graph).nodes[currnode] = new Node;
        (*graph).nodes[currnode]->adjacent = new Node*;
    }
}

bool areAdjacent(Node* node1, Node* node2)
{
    for (int curradj = 0; curradj < node1->adjacentqty; curradj++)
    {
        if (node1->adjacent[curradj] == node2) return true;
    }
    return false;
}

Graph intersectionOf(Graph* graphs, int graphqty)
{
    Graph intersection;
    intersection.nodeqty = graphs[1].nodeqty;
    Graph graphWithFewestNodes = graphs[1];
    for (int currgraph = 2; currgraph <= graphqty; currgraph++)
    {
        if (graphs[currgraph].nodeqty < intersection.nodeqty)
        {
            intersection.nodeqty = graphs[currgraph].nodeqty;
            graphWithFewestNodes = graphs[currgraph];
        }
    }
    intersection.nodes = new Node* [intersection.nodeqty];
    for (int currnode = 1; currnode <= intersection.nodeqty; currnode++)
    {
        intersection.nodes[currnode] = new Node;
    }
    Graph tempgraph;
    for (int currnode = 1; currnode <= intersection.nodeqty; currnode++)
    {
        for (int curradjnode = 1; curradjnode <= intersection.nodeqty; curradjnode++)
        {
            for (int currgraph = 1; currgraph <= graphqty; currgraph++)
            {
                tempgraph = graphs[currgraph];
                if (!(areAdjacent(tempgraph.nodes[currnode], tempgraph.nodes[curradjnode]))) goto nextadjnode;
            }
            intersection.nodes[currnode]->adjacentqty++;
            nextadjnode:;
        }
        intersection.nodes[currnode]->adjacent = new Node* [intersection.nodes[currnode]->adjacentqty];
    }
    int currindex = 0;
    for (int currnode = 1; currnode <= intersection.nodeqty; currnode++)
    {
        for (int curradjnode = 1; curradjnode <= intersection.nodeqty; curradjnode++)
        {
            for (int currgraph = 1; currgraph <= graphqty; currgraph++)
            {
                tempgraph = graphs[currgraph];
                if (!(areAdjacent(tempgraph.nodes[currnode], tempgraph.nodes[curradjnode]))) goto nextadjnode2;
            }
            intersection.nodes[currnode]->adjacent[currindex++] = graphWithFewestNodes.nodes[curradjnode];
            nextadjnode2:;
        }
        currindex = 0;
    }
    return intersection;
}

void printAdjacencyListsOf(Graph graph)
{
    for (int currnode = 1; currnode <= graph.nodeqty; currnode++)
    {
        printf("%d ", graph.nodes[currnode]->adjacentqty);
        for (int curradjnode = 0; curradjnode < graph.nodes[currnode]->adjacentqty; curradjnode++)
        {
            printf("%d ", graph.nodes[currnode]->adjacent[curradjnode]->val);
        }
        printf("\n");
    }
}

bool compareGraphs(Graph graph1, Graph graph2)
{
    if (graph1.nodeqty != graph2.nodeqty) return false;
    for (int currnode = 1; currnode <= graph1.nodeqty; currnode++)
    {
        if (graph1.nodes[currnode]->adjacentqty != graph2.nodes[currnode]->adjacentqty) return false;
        for (int curradjnode = 0; curradjnode < graph1.nodes[currnode]->adjacentqty; curradjnode++)
        {
            if (graph1.nodes[currnode]->adjacent[curradjnode]->val != graph2.nodes[currnode]->adjacent[curradjnode]->val) return false;
        }
    }
    return true;
}

Graph graphFromFile(FILE* input)
{
    Graph result;
    int tempqty;
    fscanf(input, "%d", &tempqty);
    result.nodeqty = tempqty;
    result.nodes = new Node* [tempqty + 1];
    for (int currnode = 1; currnode <= tempqty; currnode++)
    {
        result.nodes[currnode] = new Node;
    }
    for (int currnode = 1; currnode <= tempqty; currnode++)
    {
        Node* temp = result.nodes[currnode];
        temp->val = currnode;
        fscanf(input, "%d", &(temp->adjacentqty));
        temp->adjacent = new Node * [temp->adjacentqty];
        int tempnode;
        for (int curr = 0; curr < temp->adjacentqty; curr++)
        {
            fscanf(input, "%d", &tempnode);
            temp->adjacent[curr] = result.nodes[tempnode];
        }
    }
    return result;
}

void test1(int* testsPassed, FILE* input)
{
    Graph expectedResult;
    expectedResult.nodeqty = 2;
    allocMemoryFor(&expectedResult);
    fillTestNodeValues(&expectedResult);
    expectedResult.nodes[1]->adjacentqty = 1;
    expectedResult.nodes[1]->adjacent[0] = expectedResult.nodes[2];
    expectedResult.nodes[2]->adjacentqty = 1;
    expectedResult.nodes[2]->adjacent[0] = expectedResult.nodes[1];

    Graph* graphs = new Graph[3];
    graphs[1].nodeqty = 3;
    graphs[2].nodeqty = 2;
    for (int currgraph = 1; currgraph <= 2; currgraph++)
    {
        allocMemoryFor(&(graphs[currgraph]));
        fillTestNodeValues(&(graphs[currgraph]));
        graphs[currgraph] = graphFromFile(input);
    }

    Graph actualResult = intersectionOf(graphs, 2);
    printAdjacencyListsOf(actualResult);
    if (compareGraphs(expectedResult, actualResult))
    {
        printf("\nTest passed");
        (*testsPassed)++;
    }
    else printf("Test failed");
    printf("\n\n");
}

void test2(int* testsPassed, FILE* input)
{
    Graph expectedResult;
    expectedResult.nodeqty = 4;
    allocMemoryFor(&expectedResult);
    fillTestNodeValues(&expectedResult);
    expectedResult.nodes[1]->adjacentqty = 2;
    expectedResult.nodes[1]->adjacent[0] = expectedResult.nodes[2];
    expectedResult.nodes[1]->adjacent[1] = expectedResult.nodes[3];
    expectedResult.nodes[2]->adjacentqty = 1;
    expectedResult.nodes[2]->adjacent[0] = expectedResult.nodes[1];
    expectedResult.nodes[3]->adjacentqty = 1;
    expectedResult.nodes[3]->adjacent[0] = expectedResult.nodes[1];
    expectedResult.nodes[4]->adjacentqty = 0;

    Graph* graphs = new Graph[3];
    graphs[1].nodeqty = 4;
    graphs[2].nodeqty = 5;
    for (int currgraph = 1; currgraph <= 2; currgraph++)
    {
        allocMemoryFor(&(graphs[currgraph]));
        fillTestNodeValues(&(graphs[currgraph]));
        graphs[currgraph] = graphFromFile(input);
    }

    Graph actualResult = intersectionOf(graphs, 2);
    printAdjacencyListsOf(actualResult);
    if (compareGraphs(expectedResult, actualResult))
    {
        printf("\nTest passed");
        (*testsPassed)++;
    }
    else printf("\nTest failed");
    printf("\n\n");
}

void test3(int* testsPassed, FILE* input)
{
    Graph expectedResult;
    expectedResult.nodeqty = 4;
    allocMemoryFor(&expectedResult);
    fillTestNodeValues(&expectedResult);
    expectedResult.nodes[1]->adjacentqty = 0;
    expectedResult.nodes[2]->adjacentqty = 0;
    expectedResult.nodes[3]->adjacentqty = 1;
    expectedResult.nodes[3]->adjacent[0] = expectedResult.nodes[4];
    expectedResult.nodes[4]->adjacentqty = 1;
    expectedResult.nodes[4]->adjacent[0] = expectedResult.nodes[3];

    Graph* graphs = new Graph[4];
    graphs[1].nodeqty = 4;
    graphs[2].nodeqty = 6;
    graphs[3].nodeqty = 5;
    for (int currgraph = 1; currgraph <= 3; currgraph++)
    {
        allocMemoryFor(&(graphs[currgraph]));
        fillTestNodeValues(&(graphs[currgraph]));
        graphs[currgraph] = graphFromFile(input);
    }

    Graph actualResult = intersectionOf(graphs, 3);
    printAdjacencyListsOf(actualResult);
    if (compareGraphs(expectedResult, actualResult))
    {
        printf("\nTest passed");
        (*testsPassed)++;
    }
    else printf("\nTest failed");
    printf("\n\n");
}

void test4(int* testsPassed, FILE* input)
{
    Graph expectedResult;
    expectedResult.nodeqty = 6;
    allocMemoryFor(&expectedResult);
    fillTestNodeValues(&expectedResult);
    expectedResult.nodes[1]->adjacentqty = 0;
    expectedResult.nodes[2]->adjacentqty = 1;
    expectedResult.nodes[2]->adjacent[0] = expectedResult.nodes[3];
    expectedResult.nodes[3]->adjacentqty = 1;
    expectedResult.nodes[3]->adjacent[0] = expectedResult.nodes[2];
    expectedResult.nodes[4]->adjacentqty = 0;
    expectedResult.nodes[5]->adjacentqty = 0;
    expectedResult.nodes[6]->adjacentqty = 0;
    
    Graph* graphs = new Graph [4];
    graphs[1].nodeqty = 6;
    graphs[2].nodeqty = 7;
    graphs[3].nodeqty = 9;
    for (int currgraph = 1; currgraph <= 3; currgraph++)
    {
        allocMemoryFor(&(graphs[currgraph]));
        fillTestNodeValues(&(graphs[currgraph]));
        graphs[currgraph] = graphFromFile(input);
    }

    Graph actualResult = intersectionOf(graphs, 3);
    printAdjacencyListsOf(actualResult);
    if (compareGraphs(expectedResult, actualResult))
    {
        printf("\nTest passed");
        (*testsPassed)++;
    }
    else printf("\nTest failed");
    printf("\n\n");
}

void test5(int* testsPassed, FILE* input)
{
    Graph expectedResult;
    expectedResult.nodeqty = 11;
    allocMemoryFor(&expectedResult);
    fillTestNodeValues(&expectedResult);
    expectedResult.nodes[1]->adjacentqty = 1;
    expectedResult.nodes[1]->adjacent[0] = expectedResult.nodes[2];
    expectedResult.nodes[2]->adjacentqty = 1;
    expectedResult.nodes[2]->adjacent[0] = expectedResult.nodes[1];
    expectedResult.nodes[3]->adjacentqty = 0;
    expectedResult.nodes[4]->adjacentqty = 0;
    expectedResult.nodes[5]->adjacentqty = 0;
    expectedResult.nodes[6]->adjacentqty = 1;
    expectedResult.nodes[6]->adjacent[0] = expectedResult.nodes[7];
    expectedResult.nodes[7]->adjacentqty = 1;
    expectedResult.nodes[7]->adjacent[0] = expectedResult.nodes[6];
    expectedResult.nodes[8]->adjacentqty = 0;
    expectedResult.nodes[9]->adjacentqty = 0;
    expectedResult.nodes[10]->adjacentqty = 0;
    expectedResult.nodes[11]->adjacentqty = 0;

    Graph* graphs = new Graph[5];
    graphs[1].nodeqty = 12;
    graphs[2].nodeqty = 11;
    graphs[3].nodeqty = 16;
    graphs[4].nodeqty = 11;
    for (int currgraph = 1; currgraph <= 4; currgraph++)
    {
        allocMemoryFor(&(graphs[currgraph]));
        fillTestNodeValues(&(graphs[currgraph]));
        graphs[currgraph] = graphFromFile(input);
    }

    Graph actualResult = intersectionOf(graphs, 4);
    printAdjacencyListsOf(actualResult);
    if (compareGraphs(expectedResult, actualResult))
    {
        printf("\nTest passed");
        (*testsPassed)++;
    }
    else printf("\nTest failed");
    printf("\n\n");
}

void tests(FILE* input)
{
    int testsPassed = 0;
    printf("----------------------Test 1----------------------\n\n2 graphs\n\nAdjacency lists of graph 1:\n2 2 3\n1 1\n1 1\n\nAdjacency lists of graph 2:\n1 2\n1 1\n\nExpected:\n1 2\n1 1\n\nGot:\n");
    test1(&testsPassed, input);
    printf("----------------------Test 2----------------------\n\n2 graphs\n\nAdjacency lists of graph 1:\n3 2 3 4\n1 1\n1 1\n1 1\n\nAdjacency lists of graph 2:\n3 2 3 5\n1 1\n2 1 4\n1 3\n1 1\n\nExpected:\n2 2 3\n1 1\n1 1\n0\n\nGot:\n");
    test2(&testsPassed, input);
    printf("----------------------Test 3----------------------\n\n3 graphs\n\nAdjacency lists of graph 1:\n2 2 3\n1 1\n2 1 4\n1 3\n\nAdjacency lists of graph 2:\n0\n0\n1 4\n1 3\n0\n0\n\nAdjacency lists of graph 3:\n4 2 3 4 5\n1 1\n2 1 4\n1 1\n1 1\n\nExpected:\n0\n0\n1 4\n1 3\n\nGot:\n");
    test3(&testsPassed, input);
    printf("----------------------Test 4----------------------\n\n3 graphs\n\nAdjacency lists of graph 1:\n2 2 4\n2 1 3\n2 2 4\n3 1 3 5\n2 4 6\n1 5\n\nAdjacency lists of graph 2:\n4 2 5 6 7\n3 1 3 4\n1 2\n1 2\n1 1\n1 1\n1 1\n\nAdjacency lists of graph 3:\n1 3\n1 3\n4 1 2 4 9\n2 3 5\n2 6 7\n2 5 8\n2 5 8\n3 6 7 9\n2 3 8\n\nExpected:\n0\n1 3\n1 2\n0\n0\n0\n\nGot:\n");
    test4(&testsPassed, input);
    printf("----------------------Test 5----------------------\n\n4 graphs\n\nAdjacency lists of graph 1:\n11 2 3 4 5 6 7 8 9 10 11 12\n3 1 6 7\n3 1 4 6\n3 1 3 5\n3 1 4 6\n4 1 2 5 7\n4 1 2 6 8\n3 1 7 9\n 3 1 8 10\n3 1 9 11\n3 1 10 12\n2 3 11\n\nAdjacency lists of graph 2:\n10 2 3 4 5 6 7 8 9 10 11\n5 1 3 4 10 11\n3 1 2 5\n3 1 2 6\n5 1 3 6 8 10\n5 1 4 5 7 11\n3 1 6 10\n3 1 5 11\n3 1 10 11\n5 1 2 5 7 9\n5 1 2 6 8 9\n\nAdjacency lists of graph 3:\n3 2 8 15\n3 1 3 14\n3 2 4 13\n3 3 5 12\n3 4 6 11\n3 5 7 10\n3 6 8 9\n3 1 7 16\n2 7 14\n2 6 13\n2 5 16\n2 4 15\n2 3 10\n2 2 9\n2 1 12\n2 8 11\n\nAdjacency lists of graph 4:\n4 2 5 6 9\n4 1 3 8 10\n4 2 4 9 11\n4 3 6 7 10\n4 1 4 8 11\n3 1 4 7\n5 6 8 9 10 11\n3 2 5 7\n3 1 3 7\n3 2 4 7\n3 3 5 7\n\nExpected:\n1 2\n1 1\n0\n0\n0\n1 7\n1 6\n0\n0\n0\n0\n\nGot:\n");
    test5(&testsPassed, input);
    printf("%d/5 tests passed\n\n", testsPassed);
}

int main()
{
    FILE* input = fopen("input.txt", "r");
    tests(input);
    fclose(input);
    int graphcount = 0;
    printf("How many graphs will there be? ");
    scanf("%d", &graphcount);
    Graph* graphs = new Graph[graphcount+1];
    int tempqty;
    for (int currgraph = 1; currgraph <= graphcount; currgraph++)
    {
        printf("\nHow many nodes will there be in graph %d? ", currgraph);
        scanf("%d", &tempqty);
        graphs[currgraph].nodeqty = tempqty;
        graphs[currgraph].nodes = new Node* [tempqty+1];
        for (int currnode = 1; currnode <= tempqty; currnode++)
        {
            graphs[currgraph].nodes[currnode] = new Node;
        }
        for (int currnode = 1; currnode <= tempqty; currnode++)
        {
            printf("\nInput the nodes adjacent to node %d: first their quantity, then their numbers\n", currnode);
            Node* temp = graphs[currgraph].nodes[currnode];
            temp->val = currnode;
            scanf("%d", &(temp->adjacentqty));
            temp->adjacent = new Node* [temp->adjacentqty];
            int tempnode;
            for (int curr = 0; curr < temp->adjacentqty; curr++) 
            {
                scanf("%d", &tempnode);
                temp->adjacent[curr] = graphs[currgraph].nodes[tempnode];
            }
        }
    }
    printf("\n\nThe intersection of these graphs will be given by the following adjacency lists:\n");
    printAdjacencyListsOf(intersectionOf(graphs, graphcount));
    return 0;
}