#include <string>

using namespace std;

struct fullNormalForms
{
	string conjunctive;
	string disjunctive;
};

void push(int** arr, int val, int length);

int* decimalToBinary(int number, int bits);

bool elementInArr(int* arr, int elem, int length);

void allocMemoryAndFillTruthTableArguments(int*** truthTable, int argumentsQuantity, int truthTableWidth);

int** numericFormToTruthTable(int* inputs, int inputQuantity);

int** indexFormToTruthTable(int input);

int** arbitraryToTruthTable(string input);

fullNormalForms truthTableToFullNormalForms(int** truthTable, int argumentsQuantity, int truthTableWidth);

void printmatr(int** matr, int i, int j);

bool isCorrectArbitraryThreeArgumentFunction(string input);

bool threeArgumentLogicalFunctionParser(string input, bool x1, bool x2, bool x3);

string clearParentheses(string input);

string setNegatingArgumentParentheses(string input);