#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include <math.h>
using namespace std;

struct TreeEl
{
    TreeEl* left = NULL, * right = NULL;
    int val;
};


void buildTreeFromArr(TreeEl** root, int* arr, int currel, int lastel)
{
    if (currel < lastel)
    {
        *root = new TreeEl;
        (*root)->val = arr[currel];
        buildTreeFromArr(&(*root)->left, arr, 2 * currel + 1, lastel);
        buildTreeFromArr(&(*root)->right, arr, 2 * currel + 2, lastel);
    }
}

void buildBalancedTreeFromSortedArr(TreeEl** root, int* arr, int startfrom, int finishat)
{
    if (startfrom == finishat)
    {
        *root = NULL;
        return;
    }
    int middleel = (startfrom + finishat) / 2;
    *root = new TreeEl;
    (*root)->val = arr[(startfrom + finishat) / 2];
    buildBalancedTreeFromSortedArr(&(*root)->left, arr, startfrom, middleel);
    buildBalancedTreeFromSortedArr(&(*root)->right, arr, middleel + 1, finishat);
}

void displayTree(TreeEl* root, int level)
{
    if (root == NULL) return;
    string s;
    displayTree(root->right, level + 1);
    for (int i = 0; i < level; i++) s += "  ";
    cout << s << root->val << endl;
    displayTree(root->left, level+1);
}

void addNodeToTree(TreeEl** root, int val)
{
    if ((*root)->val == val) return;
    if (val > (*root)->val)
    {
        if ((*root)->right == NULL)
        {
            TreeEl* temp = new TreeEl;
            temp->val = val;
            temp->left = NULL;
            temp->right = NULL;
            (*root)->right = temp;
            return;
        }
        addNodeToTree(&(*root)->right, val);
    }
    if (val < (*root)->val)
    {
        if ((*root)->left == NULL)
        {
            TreeEl* temp = new TreeEl;
            temp->val = val;
            temp->left = NULL;
            temp->right = NULL;
            (*root)->left = temp;
            return;
        }
        addNodeToTree(&(*root)->left, val);
    }
}

TreeEl* searchInTree(TreeEl* node, int val)
{
    if (node == NULL) return NULL;
    if (val == node->val) return node;
    TreeEl* temp = searchInTree(node->right, val);
    if (temp) return temp;
    temp = searchInTree(node->left, val);
    return temp;
}

void deleteNodeByKey(TreeEl** root, int val)
{
}

void viewTreeDirect(TreeEl* root)
{
    if (root == NULL) return;
    printf("%d ", root->val);
    viewTreeDirect(root->left);
    viewTreeDirect(root->right);
}

void viewTreeReverse(TreeEl* root)
{
    if (root == NULL) return;
    viewTreeReverse(root->left);
    viewTreeReverse(root->right);
    printf("%d ", root->val);
}

void fillArrFromTree(TreeEl* root, int** els, int* index)
{
    if (root == NULL) return;
    (*els)[(*index)++] = root->val;
    fillArrFromTree(root->left, els, index);
    fillArrFromTree(root->right, els, index);
}

void sort(int** arr, int elsqty)
{
    int changes, temp;
    do
    {
        changes = 0;
        for (int i = 0; i < elsqty - 1; i++)
        {
            if ((*arr)[i] > (*arr)[i + 1])
            {
                temp = (*arr)[i];
                (*arr)[i] = (*arr)[i + 1];
                (*arr)[i + 1] = temp;
                changes++;
            }
        }
    }     while (changes > 0);
}

void countTreeNodes(TreeEl* root, int* num)
{
    if (root == NULL) return;
    (*num)++;
    countTreeNodes(root->left, num);
    countTreeNodes(root->right, num);
}

void deleteTree(TreeEl** root)
{
    if (*root == NULL) return;
    deleteTree(&(*root)->left);
    deleteTree(&(*root)->right);
    delete *root;
}

TreeEl* individual(TreeEl* root, TreeEl* min, TreeEl* max, TreeEl** remembered, double average, double* mindiff)
{
    if (*mindiff > fabs(average - root->val))
    {
        *mindiff = fabs(average - root->val);
        *remembered = root;
    }
    if (*mindiff == 0) return root;
    TreeEl* tempminleft = searchInTree(root->left, min->val);
    TreeEl* tempmaxleft = searchInTree(root->left, max->val);
    TreeEl* tempminright = searchInTree(root->right, min->val);
    TreeEl* tempmaxright = searchInTree(root->right, max->val);
    if (tempminleft || tempmaxleft) individual(root->left, min, max, remembered, average, mindiff);
    if (tempminright || tempmaxright) individual(root->right, min, max, remembered, average, mindiff);
    return *remembered;
}

int main()
{
    int elqty;
    printf("Input array size: ");
    scanf_s("%d", &elqty);
    int* arr = new int[elqty];
    printf("Input an array with no repeating elements: ");
    for (int i = 0; i < elqty; i++) scanf_s("%d", &(arr[i]));
    TreeEl* root;
    buildTreeFromArr(&root, arr, 0, elqty);
    printf("Tree formed. ");
    int choice;
    int newel;
    while (true)
    {
        printf("Choose action:\n1. Add node\n2. Find node by key\n3. Delete node by key\n4. View tree (direct)\n5. View tree (reverse)\n6. View tree (in asceding order of nodes' data)\n7. Display tree graphically\n8. Balance tree\n9. Individual task: find the node with a key closest to average between the nodes with max and min keys\n10. End program\n");
        scanf_s("%d", &choice);
        printf("\n");
        switch (choice)
        {
            case 1:
            {
                printf("Input element to add: ");
                scanf("%d", &newel);
                if (searchInTree(root, newel))
                {
                    printf("Such an element already exists in the tree");
                    break;
                }
                addNodeToTree(&root, newel);
                break;
            }
            case 2:
            {
                printf("Input the value to look for: ");
                int val;
                scanf("%d", &val);
                if (searchInTree(root, val)) printf("There is a node with such a key");
                else printf("There is no node with such a key");
                break;
            }
            case 3:
            {
                break;
            }
            case 4:
            {
                viewTreeDirect(root);
                break;
            }
            case 5:
            {
                viewTreeReverse(root);
                break;
            }
            case 6:
            {
                int nodes = 0;
                countTreeNodes(root, &nodes);
                int* vals = new int[nodes];
                int index = 0;
                fillArrFromTree(root, &vals, &index);
                sort(&vals, nodes);
                for (int i = 0; i < nodes; i++) printf("%d ", vals[i]);
                break;
            }
            case 7:
            {
                printf("\n");
                displayTree(root, 0);
                break;
            }
            case 8:
            {
                int newnodesqty = 0;
                countTreeNodes(root, &newnodesqty);
                int* newtree = new int[newnodesqty];
                int index = 0;
                fillArrFromTree(root, &newtree, &index);
                sort(&newtree, newnodesqty);
                deleteTree(&root);
                buildBalancedTreeFromSortedArr(&root, newtree, 0, newnodesqty);
                printf("Tree balanced.");
                break;
            }
            case 9:
            {
                int nodes = 0;
                countTreeNodes(root, &nodes);
                int* vals = new int[nodes];
                int index = 0;
                fillArrFromTree(root, &vals, &index);
                int min = 999, max = -999;
                double sum = 0;
                for (int i = 0; i < nodes; i++)
                {
                    if (vals[i] > max) max = vals[i];
                    if (vals[i] < min) min = vals[i];
                    sum += vals[i];
                }
                double average = sum / nodes, mindiff = 999;
                TreeEl* closesttoavg, * minnode = searchInTree(root, min), * maxnode = searchInTree(root, max);
                individual(root, minnode, maxnode, &closesttoavg, average, &mindiff);
                printf("The key of the found node is %d", closesttoavg->val);
                break;
            }
            case 10:
            {
                return 0;
            }
        }
        printf("\n\n");
    }
}