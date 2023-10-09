#include <iostream>
#include "lab4header.h"
#include <math.h>

using namespace std;

int main()
{
	int argumentsQuantity;
	printf("Input arguments quantity: ");
	while (true)
	{
		try // idk why this doesn't work in some cases
		{
			cin >> argumentsQuantity;
			if (argumentsQuantity <= 0) throw 0;
		}
		catch(int error)
		{
			printf("It appears that you have entered something that was not allowed. My disappointment is immeasurable and my day is ruined. I beg of you, input a positive integer.\n");
			cin.clear();
			cin.ignore(256, '\n');
			continue;
		}
		break;
	}
	int truthTableWidth = pow(2, argumentsQuantity);
	int** truthTable = new int* [argumentsQuantity + 2];
	for (int i = 0; i < argumentsQuantity + 2; i++) truthTable[i] = new int [truthTableWidth];
	int* currentVariableSetInBinary;
	for (int j = 0; j < truthTableWidth; j++)
	{
		currentVariableSetInBinary = decimalToBinary(j, argumentsQuantity);
		for (int i = 0; i < argumentsQuantity; i++) truthTable[i][j] = currentVariableSetInBinary[i];
	}
	int** truthTableD;
	int** truthTableB;
	allocMemoryAndFillTruthTableArguments(&truthTableD, argumentsQuantity, truthTableWidth);
	allocMemoryAndFillTruthTableArguments(&truthTableB, argumentsQuantity, truthTableWidth);
	printf("Input the bi's and di's:\n");
	int dummy;
	for (int j = 0; j < truthTableWidth; j++)
	{
		printf("d%d = ", j);
		while (true)
		{
			try
			{
				cin >> dummy;
				if (dummy < 0 || dummy > 1) throw 0;
			}
			catch (int error)
			{
				printf("It appears that you have entered something that was not allowed. My disappointment is immeasurable and my day is ruined. I beg of you, input a positive integer.\n");
				cin.clear();
				cin.ignore(256, '\n');
				continue;
			}
			break;
		}
		truthTable[argumentsQuantity][j] = dummy;
		truthTableD[argumentsQuantity][j] = dummy;
	}
	printf("\n");
	for (int j = 0; j < truthTableWidth; j++)
	{
		printf("b%d = ", j);
		while (true)
		{
			try
			{
				cin >> dummy;
				if (dummy < 0 || dummy > 1) throw 0;
			}
			catch (int error)
			{
				printf("It appears that you have entered something that was not allowed. My disappointment is immeasurable and my day is ruined. I beg of you, input a positive integer.\n");
				cin.clear();
				cin.ignore(256, '\n');
				continue;
			}
			break;
		}
		truthTable[argumentsQuantity + 1][j] = dummy;
		truthTableB[argumentsQuantity][j] = dummy;
	}
	fullNormalForms B = truthTableToFullNormalForms(truthTableB, argumentsQuantity, truthTableWidth);
	string B_full = (size(B.conjunctive) > size(B.disjunctive)) ? B.disjunctive : B.conjunctive;
	fullNormalForms D = truthTableToFullNormalForms(truthTableD, argumentsQuantity, truthTableWidth);
	string D_full = (size(D.conjunctive) > size(D.disjunctive)) ? D.disjunctive : D.conjunctive;
	cout << endl << B_full << endl;
	cout << D_full << endl << endl;
	string B_minimized = reduceViaTableCalculatingMethod(B_full, stage1(B_full));
	string D_minimized = reduceViaTableCalculatingMethod(D_full, stage1(D_full));
	cout << B_minimized << endl;
	cout << D_minimized << endl << endl;
	printf("It appears that the scheme for your machine will require the following:\n\n");
	printf("%d single input negators\n", requiredSingleInputNegators(B_minimized) + requiredSingleInputNegators(D_minimized));
	int currDisjunctors, currConjunctors, transistors = 0;
	for (int i = 0; i < truthTableWidth; i++)
	{
		currDisjunctors = requiredNInputDisjunctors(B_minimized, i) + requiredNInputDisjunctors(D_minimized, i);
		currConjunctors = requiredNInputConjunctors(B_minimized, i) + requiredNInputConjunctors(D_minimized, i);
		if (currDisjunctors > 0)
		{
			printf("%d %d-input disjunctor(s)\n", currDisjunctors, i);
		}
		if (currConjunctors > 0)
		{
			printf("%d %d-input conjunctor(s)\n", currConjunctors, i);
		}
		transistors += currDisjunctors;
		transistors += currConjunctors;
	}
	printf("\nWhich is %d transistors.\n", transistors);
	return 0;
}