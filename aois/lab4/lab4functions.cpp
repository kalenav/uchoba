#include "lab4header.h"

int requiredSingleInputNegators(string input)
{
	int quantity = 0;
	for (int i = 0; i < size(input); i++) if (input[i] == '!') quantity++;
	return quantity;
}

int requiredNInputDisjunctors(string input, int N)
{
	char connector;
	for (int i = 0; i < size(input); i++)
	{
		if (input[i] == ' ')
		{
			connector = input[i + 1];
			break;
		}
	}
	if (connector == '*')
	{
		int implicants = 0;
		for (int i = 0; i < size(input); i++)
		{
			if (input[i] == '(') implicants++;
		}
		if (implicants == N) return 1;
		else return 0;
	}
	else
	{
		int disjunctors = 0;
		int variablesInCurrentParenthesesSet = 0;
		for (int i = 0; i < size(input); i++)
		{
			if (input[i] == ')')
			{
				if (variablesInCurrentParenthesesSet == N) disjunctors++;
				variablesInCurrentParenthesesSet = 0;
				continue;
			}
			if (input[i] == 'x') variablesInCurrentParenthesesSet++;
		}
		return disjunctors;
	}
}

int requiredNInputConjunctors(string input, int N)
{
	char connector;
	for (int i = 0; i < size(input); i++)
	{
		if (input[i] == ' ')
		{
			connector = input[i + 1];
			break;
		}
	}
	if (connector == '+')
	{
		int implicants = 0;
		for (int i = 0; i < size(input); i++)
		{
			if (input[i] == '(') implicants++;
		}
		if (implicants == N) return 1;
		else return 0;
	}
	else
	{
		int conjunctors = 0;
		int variablesInCurrentParenthesesSet = 0;
		for (int i = 0; i < size(input); i++)
		{
			if (input[i] == ')')
			{
				if (variablesInCurrentParenthesesSet == N) conjunctors++;
				variablesInCurrentParenthesesSet = 0;
				continue;
			}
			if (input[i] == 'x') variablesInCurrentParenthesesSet++;
		}
		return conjunctors;
	}
}