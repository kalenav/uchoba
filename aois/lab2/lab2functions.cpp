#include <iostream>
#include "lab2header.h"
#include "math.h"
#include "lab2tests/pch.h"
#include <string>

using namespace std;

void push(int** arr, int val, int length)
{
	int* newArr = new int[length + 1];
	for (int i = 0; i < length; i++) newArr[i] = (*arr)[i];
	newArr[length] = val;
	int* dummy = (*arr);
	(*arr) = newArr;
	delete dummy;
}

int* decimalToBinary(int number, int bits)
{
	int* binaryForm = new int[bits];
	int currRemainder = number;
	for (int i = bits - 1; i >= 0; i--)
	{
		binaryForm[i] = currRemainder % 2;
		currRemainder /= 2;
	}
	return binaryForm;
}

bool elementInArr(int* arr, int element, int length) // searches for a number in an array
{
	for (int i = 0; i < length; i++) if (arr[i] == element) return true;
	return false;
}

void allocMemoryAndFillTruthTableArguments(int*** truthTable, int argumentsQuantity, int truthTableWidth) // prepares the truth table
{
	(*truthTable) = new int* [argumentsQuantity + 1]; 
	for (int i = 0; i < argumentsQuantity + 1; i++) (*truthTable)[i] = new int [truthTableWidth];
	int* currentInputInBinary;
	for (int j = 0; j < truthTableWidth; j++)
	{
		currentInputInBinary = decimalToBinary(j, argumentsQuantity);
		for (int i = 0; i < argumentsQuantity; i++) (*truthTable)[i][j] = currentInputInBinary[i];
	}
}

int** numericFormToTruthTable(int* inputs, int inputQuantity)
{
	int requiredBits = 1; // will store the required number of bits to store the largest input
	for (int i = 0; i < inputQuantity; i++)
	{
		while (inputs[i] > pow(2, requiredBits) - 1) requiredBits++; // we can store numbers up to 2^n - 1 with n binary digits
	}
	int argumentsQuantity = requiredBits;
	int truthTableWidth = pow(2, requiredBits);
	int** truthTable;
	allocMemoryAndFillTruthTableArguments(&truthTable, argumentsQuantity, truthTableWidth);
	for (int j = 0; j < truthTableWidth; j++)
	{
		if (elementInArr(inputs, j, inputQuantity)) truthTable[argumentsQuantity][j] = 1;
		else truthTable[argumentsQuantity][j] = 0;
	}
	return truthTable;
}

int** indexFormToTruthTable(int input)
{
	int argumentsQuantity = 0;
	while (input > pow(2, pow(2, argumentsQuantity)) - 1) argumentsQuantity++; // for n arguments, there is 2^n possible function outputs; 2^n bits can store numbers up to 2^(2^n) - 1, so we increase n until we get enough bits
	int truthTableWidth = pow(2, argumentsQuantity);
	int** truthTable;
	allocMemoryAndFillTruthTableArguments(&truthTable, argumentsQuantity, truthTableWidth);
	int* functionValues = decimalToBinary(input, truthTableWidth);
	for (int j = 0; j < truthTableWidth; j++) truthTable[argumentsQuantity][j] = functionValues[j];
	return truthTable;
}

int** arbitraryToTruthTable(string input)
{
	int** truthTable;
	allocMemoryAndFillTruthTableArguments(&truthTable, 3, 8);
	bool x1, x2, x3;
	input = setNegatingArgumentParentheses(input);
	for (int j = 0; j < 8; j++)
	{
		if (truthTable[0][j] == 1) x1 = true;
		else x1 = false;
		if (truthTable[1][j] == 1) x2 = true;
		else x2 = false;
		if (truthTable[2][j] == 1) x3 = true;
		else x3 = false;
		if (threeArgumentLogicalFunctionParser(input, x1, x2, x3)) truthTable[3][j] = 1;
		else truthTable[3][j] = 0;
	}
	return truthTable;
}

fullNormalForms truthTableToFullNormalForms(int** truthTable, int argumentsQuantity, int truthTableWidth) // prints FDNF and FCNF forms of a function from its truth table
{
	string disjunctive, conjunctive;
	int disjunctiveConstituentNumber = 0, conjunctiveConstituentNumber = 0;
	bool firstIteration = true; // needed to print the pluses between the terms correctly
	for (int j = 0; j < truthTableWidth; j++)
	{
		if (truthTable[argumentsQuantity][j] != 1) continue; // we only need to account for sets of variables that a function yields 1 from
		disjunctiveConstituentNumber++;
		if (firstIteration) firstIteration = false;
		else disjunctive += " + ";
		disjunctive.push_back('(');
		for (int i = 0; i < argumentsQuantity; i++)
		{
			if (truthTable[i][j] == 0) disjunctive.push_back('!'); // the variable is negated if its value in the current set is 0
			disjunctive.push_back('x');
			disjunctive += to_string(i + 1);
			if (i != argumentsQuantity - 1) disjunctive += " * ";  // print a multiplication sign if the cycle is not on its last iteration
		}
		disjunctive.push_back(')');
	}
	firstIteration = true;
	for (int j = 0; j < truthTableWidth; j++)
	{
		if (truthTable[argumentsQuantity][j] != 0) continue; // we only need to account for sets of variables that a function yields 0 from
		conjunctiveConstituentNumber++;
		if (firstIteration) firstIteration = false;
		else conjunctive += " * ";
		conjunctive.push_back('(');
		for (int i = 0; i < argumentsQuantity; i++)
		{
			if (truthTable[i][j] == 1) conjunctive.push_back('!'); // the variable is negated if its value in the current set is 1
			conjunctive.push_back('x');
			conjunctive += to_string(i + 1);
			if (i != argumentsQuantity - 1) conjunctive += " + "; // print an addition sign if the cycle is not on its last iteration
		}
		conjunctive.push_back(')');
	}
	fullNormalForms result;
	if (disjunctiveConstituentNumber == 0) // meaning that the function doesn't ever return 1, that is, it's the constant function 0
	{
		result.disjunctive = "0";
		result.conjunctive = "0";
		return result;
	}
	if (conjunctiveConstituentNumber == 0) // meaning that the function doesn't ever return 0, that is, it's the constant function 1
	{
		result.disjunctive = "1";
		result.conjunctive = "1";
		return result;
	}
	result.disjunctive = disjunctive;
	result.conjunctive = conjunctive;
	return result;
}

void printmatr(int** matr, int height, int width) // just for debug purposes
{
	for (int i = 0; i < height; i++)
	{
		for (int j = 0; j < width; j++)
		{
			printf("%d ", matr[i][j]);
		}
		printf("\n");
	}
}

bool isCorrectArbitraryThreeArgumentFunction(string input) // will check if the input string is... well, it's all in the name, why did i even bother writing this
{
	int bracketsOpened = 0; // will increase by one for every opening bracket and decrease by one for every closing bracket; if it isn't 0 at the end, then there are more opening brackets than there are closing brackets, or vice versa, which isn't allowed
	bool argument1Found = false; 
	bool argument2Found = false; // these variables will turn true if the corresponding symbol is found
	bool argument3Found = false;
	bool disjunctionFound = false;
	bool conjunctionFound = false;
	for (int i = 0; i < size(input); i++)
	{
		// firstly, if the current symbol doesn't come from the set of allowed characters, the input string is already incorrect
		if (input[i] != '!' 
			&& input[i] != 'x' 
			&& input[i] != '1' 
			&& input[i] != '2'
			&& input[i] != '3' 
			&& input[i] != '(' 
			&& input[i] != ')' 
			&& input[i] != '&' 
			&& input[i] != '|') return false;
		// if the current symbol is a 'x', then the symbol after it must be either '1', '2' or '3'; otherwise the input is incorrect
		if (input[i] == 'x')
		{
			if (i == size(input) - 1 // if the 'x' symbol is at the end of input, there can't be any number following it
				|| (int)(input[i + 1] - '0') < 0 // these conditions are based on the fact that the ASCII codes for all digits are consecutive, 
				|| (int)(input[i + 1] - '0') > 3 // meaning that the difference between the digit's code and the code of '0' is the actual digit. this can be used to check if the symbol following 'x' comes from the set { '1', '2', '3' }
				|| (i > 0
					&& input[i - 1] != '&' // what is more, 'x' can only be preceded by an operator, a '!' or a '(', except for the case when 'x' is the first symbol in the input
					&& input[i - 1] != '|'
					&& input[i - 1] != '!'
					&& input[i - 1] != '(')) return false;
		}
		if (input[i] == '1') argument1Found = true;
		if (input[i] == '2') argument2Found = true; // pretty straightforward
		if (input[i] == '3') argument3Found = true;
		if (input[i] == '(')
		{
			// if the current symbol is a '(', then it can only be followed by 'x', '(' or '!'
			if (i == size(input) - 1 // there can't be an opening parenthesis at the end of input
				|| (input[i + 1] != 'x' 
					&& input[i + 1] != '(' 
					&& input[i + 1] != '!')) return false;
			bracketsOpened++;
		}
		if (input[i] == ')')
		{
			// if the current symbol is a ')', then it can only be followed by '&', '|' or ')'
			if (i == 0 // there can't be a closing parenthesis at the beginning of input
				|| (i < size(input) - 1 
					&& input[i + 1] != '&' 
					&& input[i + 1] != '|' 
					&& input[i + 1] != ')')) return false;
			bracketsOpened--;
		}
		if (input[i] == '&')
		{
			conjunctionFound = true;
			// if the current symbol is a '&', then it can only be followed by another '&' or an opening parenthesis 
			// furthermore, it can only be preceded by a closing parenthesis or a variable number
			if (i == 0
				|| i == size(input) - 1
				|| (input[i + 1] != '&'
					&& input[i - 1] != ')'
					&& input[i - 1] != '1'
					&& input[i - 1] != '2'
					&& input[i - 1] != '3')) return false;
			else i++; // the second '&' symbol is skipped
		}
		if (input[i] == '|')
		{
			disjunctionFound = true;
			// full analogy to the above
			if (i == 0
				|| i == size(input) - 1
				|| (input[i + 1] != '|'
					&& input[i - 1] != ')'
					&& input[i - 1] != '1'
					&& input[i - 1] != '2'
					&& input[i - 1] != '3')) return false;
			else i++;
		}
		if (input[i] == '!' // if the current symbol is a '!', then it can only be followed by 'x' or '(', and it can't be at the end of input
			&& (i == size(input) - 1
				|| (input[i + 1] != 'x' && input[i + 1] != '(')
				|| (i > 0 // moreover, the '!' can only be preceded by an operator or an opening parenthesis, except for the case then it is the first symbol in the input
					&& input[i - 1] != '&'
					&& input[i - 1] != '|'
					&& input[i - 1] != '('))) return false;
	}
	if (!argument1Found || !argument2Found || !argument3Found 
		|| (!disjunctionFound && !conjunctionFound)) return false; // if some of the arguments weren't found or there were no operators at all, the input is incorrect
	if (bracketsOpened != 0) return false; // if there are "lone" parentheses, the input is incorrect
	return true;
}

bool threeArgumentLogicalFunctionParser(string input, bool x1, bool x2, bool x3)
{
	// will take a string consisting of x1, x2, x3, &&, ||, (), ! and three arguments and evaluate it as a logical function
	// 
	// this function is recursive and will divide the given string more and more simple parts,
	// until the remaining expressions are either the variables (x1, x2, x3) or binary operations on the variables (e.g. x1&&x3)
	// 
	// by the time this function is called, the negated arguments in original input have been parenthesized
	// thus, if something is negated at this point, it is for sure parenthesized,
	// meaning that the below condition will never work on the first iteration of the function and won't lead to incorrect evaluation
	if (input[0] == '!') 
	{
		string negating;
		for (int i = 1; i < size(input); i++) negating.push_back(input[i]); // we take everything after the negation sign,
		return !threeArgumentLogicalFunctionParser(clearParentheses(negating), x1, x2, x3); // un-parenthesize it and evaluate it as a logical function with inverted output
	}
	if (size(input) == 2) // if the input string is just a single variable
	{
		if (input[1] == '1') return x1;
		if (input[1] == '2') return x2;
		if (input[1] == '3') return x3;
	}
	if (size(input) == 6) // if the input string is a binary operation on two variables
	{
		if (input[2] == '&')
		{
			if ((input[1] == '1' && input[5] == '2') || (input[1] == '2' && input[5] == '1')) return x1 && x2;
			if ((input[1] == '1' && input[5] == '3') || (input[1] == '3' && input[5] == '1')) return x1 && x3;
			if ((input[1] == '2' && input[5] == '3') || (input[1] == '3' && input[5] == '2')) return x2 && x3;
		}
		if (input[2] == '|')
		{
			if ((input[1] == '1' && input[5] == '2') || (input[1] == '2' && input[5] == '1')) return x1 || x2;
			if ((input[1] == '1' && input[5] == '3') || (input[1] == '3' && input[5] == '1')) return x1 || x3;
			if ((input[1] == '2' && input[5] == '3') || (input[1] == '3' && input[5] == '2')) return x2 || x3;
		}
	}
	// if none of the above conditions were satisfied, then the input string is non-elementary;
	// thus either its left side, its right side or both its sides need simplifying, i.e. it is (they are) parenthesized
	int highestOrderOperatorIndex;
	if (input[0] == '(') 
	// if the input starts with a parenthesis, we need to locate the operator that corresponds to it, that is, the operator of the highest order
	{
		int bracketsOpened = 0;
		highestOrderOperatorIndex = 0;
		do
		{
			// this can be achieved by starting at the beginning and counting the amount of open brackets at each point;
			if (input[highestOrderOperatorIndex] == '(') bracketsOpened++;
			if (input[highestOrderOperatorIndex] == ')') bracketsOpened--;
			highestOrderOperatorIndex++;
		} 		while (bracketsOpened > 0); 	// as soon as there are no more open brackets, the function has reached the operator
	}
	// if the input does not start with a parenthesis, then it can only start with a variable,
	// meaning that it is of the form xi||(...) or xi&&||(...); this means that the operator must start at the second index
	else highestOrderOperatorIndex = 2; 
	// the function will now separate the input string into its "left" and "right" sides
	// and apply itself recursively to these sides, eventually yielding the actual output of the input function
	string leftSide, rightSide;
	for (int i = 0; i < highestOrderOperatorIndex; i++) leftSide.push_back(input[i]);
	for (int i = highestOrderOperatorIndex + 2; i < size(input); i++) rightSide.push_back(input[i]);
	if (input[highestOrderOperatorIndex] == '|')
	{
		return threeArgumentLogicalFunctionParser(clearParentheses(leftSide), x1, x2, x3) || threeArgumentLogicalFunctionParser(clearParentheses(rightSide), x1, x2, x3);
	}
	if (input[highestOrderOperatorIndex] == '&')
	{
		return threeArgumentLogicalFunctionParser(clearParentheses(leftSide), x1, x2, x3) && threeArgumentLogicalFunctionParser(clearParentheses(rightSide), x1, x2, x3);
	}
}

string clearParentheses(string input) // will remove the parentheses from the beginning and the end of a string
{
	if (input[0] != '(') return input;
	string result;
	for (int i = 1; i < size(input) - 1; i++) result.push_back(input[i]);
	return result;
}

string setNegatingArgumentParentheses(string input) // will parenthesize the negated arguments (i.e. !x1 -> (!x1))
{
	string result;
	for (int i = 0; i < size(input); i++)
	{
		if (i < size(input) - 2)
		{
			if (input[i] == '!' && input[i + 1] == 'x')
			{
				result += "(!x";
				result.push_back(input[i + 2]);
				result.push_back(')');
				i += 2;
			}
			else result.push_back(input[i]);
		}
		else result.push_back(input[i]);
	}
	return result;
}