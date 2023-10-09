#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include <stdio.h>

struct Dominoe
{
    short dnum, adjacentqty, depth = 0;
    bool fallen = false;
    Dominoe** adjacent;
};

struct DominoeDeckEl
{
    Dominoe* el;
    DominoeDeckEl* next;
    DominoeDeckEl* prev;
};

void pop_front(DominoeDeckEl** head, Dominoe** taking)
{
    DominoeDeckEl* temp = (*head);
    *taking = temp->el;
    (*head) = temp->next;
    delete temp;
}

void push_first(DominoeDeckEl** head, DominoeDeckEl** tail, Dominoe* newdominoe)
{
    DominoeDeckEl* temp = new DominoeDeckEl;
    temp->el = newdominoe;
    temp->next = NULL;
    temp->prev = NULL;
    (*head) = (*tail) = temp;
}

void push_back(DominoeDeckEl** head, DominoeDeckEl** tail, Dominoe* newdominoe)
{
    DominoeDeckEl* temp = new DominoeDeckEl;
    temp->el = newdominoe;
    temp->next = NULL;
    temp->prev = *tail;
    (*tail)->next = temp;
    (*tail) = temp;
}


int dominoesum(Dominoe* dominoe, short* currtime)
{
    DominoeDeckEl* head = NULL, * tail = NULL;
    int sum = 0;
    dominoe->fallen = true;
    push_first(&head, &tail, dominoe);
    Dominoe** tempadj;
    while (head != NULL)
    {
        pop_front(&head, &dominoe);
        if (*currtime < dominoe->depth) *currtime = dominoe->depth;
        tempadj = dominoe->adjacent;
        sum += dominoe->dnum;
        for (short curr = 0; curr < dominoe->adjacentqty; curr++)
        {
            if (tempadj[curr]->fallen == false)
            {
                tempadj[curr]->depth = dominoe->depth + 1;
                if (head == NULL) push_first(&head, &tail, tempadj[curr]);
                else push_back(&head, &tail, tempadj[curr]);
                tempadj[curr]->fallen = true;
            }
        }
    }
    return sum;
}

void renew(Dominoe** dominoes, short dominoesqty)
{
    for (short curr = 1; curr <= dominoesqty; curr++)
    {
        dominoes[curr]->fallen = false;
        dominoes[curr]->depth = 0;
    }
}

int main()
{
    FILE* fp = fopen("input.txt", "r");;
    short dominoesqty = 0;
    fscanf(fp, "%hd", &dominoesqty);
    if (dominoesqty == 0) return 0;
    Dominoe** dominoes = new Dominoe* [dominoesqty+1];
    for (short curr = 1; curr <= dominoesqty; curr++)
    {
        dominoes[curr] = new Dominoe;
    }
    short tempadjqty, tempadjdominoe;
    Dominoe* temp;
    for (short curr = 1; curr <= dominoesqty; curr++)
    {
        temp = dominoes[curr];
        fscanf(fp, "%hd", &tempadjqty);
        temp->adjacentqty = tempadjqty;
        temp->dnum = curr;
        if (tempadjqty == 0) continue;
        temp->adjacent = new Dominoe* [tempadjqty];
        for (short curr = 0; curr < tempadjqty; curr++)
        {
            fscanf(fp, " %hd", &tempadjdominoe);
            temp->adjacent[curr] = dominoes[tempadjdominoe];
        }
        fscanf(fp, "\n");
    }
    fclose(fp);
    short maxtime = -1, currtime = 0, startdominoenum;
    int mastersum = dominoesqty * (dominoesqty + 1) / 2;
    for (short curr = 1; curr <= dominoesqty; curr++)
    {
        if (dominoesum(dominoes[curr], &currtime) == mastersum)
        {
            if (maxtime <= currtime)
            {
                maxtime = currtime;
                startdominoenum = curr;
            }
        }
        currtime = 0;
        renew(dominoes, dominoesqty);
    }
    fp = fopen("output.txt", "w");
    if (maxtime == -1) fprintf(fp, "impossible");
    else fprintf(fp, "%hd\n%hd", maxtime, startdominoenum);
    fclose(fp);
    delete fp;
    return 0;
}
