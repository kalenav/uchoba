#include <iostream>
#include <stdlib.h>

struct DeckEl
{
    int val;
    DeckEl* next;
    DeckEl* prev;
} *begin, *end;

void addfirstel(DeckEl** dbegin, DeckEl** dend, int value)
{
    *dbegin = new DeckEl;
    (*dbegin)->val = value;
    *dend = *dbegin;
    (*dbegin)->next = (*dend)->next = (*dbegin)->prev = (*dend)->prev = NULL;
    return;
}

void push_front(DeckEl** dend, int value)
{
    DeckEl* temp = new DeckEl;
    temp->val = value;
    temp->prev = *dend;
    temp->next = NULL;
    (*dend)->next = temp;
    (*dend) = temp;
    return;
}

void push_back(DeckEl** dbegin, int value)
{
    DeckEl* temp = new DeckEl;
    temp->val = value;
    temp->prev = NULL;
    temp->next = *dbegin;
    (*dbegin)->prev = temp;
    (*dbegin) = temp;
}

void viewdeckfrombeg(DeckEl* dbegin)
{
    DeckEl* temp = dbegin;
    while (temp != NULL)
    {
        printf("%d ", temp->val);
        temp = temp->next;
    }
    return;
}

void viewdeckfromend(DeckEl* dend)
{
    DeckEl* temp = dend;
    while (temp != NULL)
    {
        printf("%d ", temp->val);
        temp = temp->prev;
    }
    return;
}

void individual(DeckEl** dbegin, DeckEl** dend)
{
    int max = -999;
    DeckEl* auxend = new DeckEl;
    DeckEl* redundant;
    auxend->prev = NULL;
    while ((*dbegin) != NULL)
    {
        push_front(&auxend, (*dbegin)->val);
        if (auxend->val > max) max = auxend->val;
        redundant = *dbegin;
        (*dbegin) = (*dbegin)->next;
        delete redundant;
    }
    while (auxend->prev != NULL)
    {
        if (auxend->val != max)
        {
            if (*dbegin == NULL) addfirstel(dbegin, dend, auxend->val);
            else push_back(dbegin, auxend->val);
        }
        redundant = auxend;
        auxend = auxend->prev;
        delete redundant;
    }
    printf("Took all %d's from the deck.\n", max);
    return;
}

int main()
{
    int choice;
    while (true)
    {
        printf("Choose action:\n");
        printf("1. Fill deck at random\n");
        printf("2. Add element at the beginning\n");
        printf("3. Add element at the end\n");
        printf("4. View deck from the beginning\n");
        printf("5. View deck from the end\n");
        printf("6. Individual task (find and delete max element)\n");
        printf("7. End program\n");
        scanf_s("%d", &choice);
        printf("\n");
        switch (choice)
        {
            case 1:
            {
                int els;
                printf("How many elements? ");
                scanf_s("%d", &els);
                if (begin != NULL && end != NULL)
                {
                    printf("A deck already exists.");
                    break;
                }
                addfirstel(&begin, &end, (double)rand() / (RAND_MAX + 1) * 18 - 9);
                for (int i = 0; i < els - 1; i++) push_front(&end, (double)rand() / (RAND_MAX + 1) * 18 - 9);
                break;
            }
            case 2:
            {
                int newel;
                printf("Input element: ");
                scanf_s("%d", &newel);
                if (begin == NULL || end == NULL)
                {
                    addfirstel(&begin, &end, newel);
                    printf("\n");
                    continue;
                }
                push_back(&begin, newel);
                break;
            }
            case 3:
            {
                int newel;
                printf("Input element: ");
                scanf_s("%d", &newel);
                if (begin == NULL || end == NULL)
                {
                    addfirstel(&begin, &end, newel);
                    printf("\n");
                    break;
                }
                push_front(&end, newel);
                break;
            }
            case 4:
            {
                if (begin == NULL || end == NULL)
                {
                    printf("Deck empty!\n");
                    break;
                }
                viewdeckfrombeg(begin);
                printf("\n");
                break;
            }
            case 5:
            {
                if (begin == NULL || end == NULL)
                {
                    printf("Deck empty!\n");
                    break;
                }
                viewdeckfromend(end);
                printf("\n");
                break;
            }
            case 6:
            {
                if (begin == NULL || end == NULL)
                {
                    printf("Deck empty!\n");
                    break;
                }
                individual(&begin, &end);
                break;
            }
            case 7:
            {
                return 0;
            }
        }
        printf("\n");
    }
}