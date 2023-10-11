#include "lab3header.h"
#include "../lab2/lab2header.h"
#include "../lab1letstrythatagain/lab1ltta.h"
#include <string>

StringArray::StringArray()
{

}

StringArray::StringArray(string input)
{
	int expressionQuantity = 0;
	for (int i = 0; i < input.length(); i++) if (input[i] == '(') expressionQuantity++;
	string currExpression;
	bool readingSymbols = false;
	for (int i = 0; i < input.length(); i++)
	{
		if (input[i] == ')')
		{
			readingSymbols = false;
			if (!(*this).has(currExpression)) (*this).push(currExpression);
			currExpression = "";
		}
		if (readingSymbols) currExpression += input[i];
		if (input[i] == '(') readingSymbols = true;
	}
}

StringArray::StringArray(const StringArray& copying)
{
	size = copying.size;
	arr = new string[size];
	for (int i = 0; i < size; i++) arr[i] = copying.arr[i];
}

StringArray::~StringArray()
{
	if(size > 0) delete[] arr;
}

void StringArray::operator=(const StringArray& copying)
{
	size = copying.size;
	arr = new string[size];
	for (int i = 0; i < size; i++) arr[i] = copying.arr[i];
}

void StringArray::push(string pushing)
{
	string* newArr = new string[++size];
	for (int i = 0; i < size - 1; i++) newArr[i] = arr[i];
	newArr[size - 1] = pushing;
	string* dummy = arr;
	arr = newArr;
	delete[] dummy;
}

bool StringArray::has(string searching)
{
	for (int i = 0; i < size; i++)
	{
		if (arr[i] == searching) return true;
	}
	return false;
}

int StringArray::getSize() { return size; }

string StringArray::operator[](int index)
{
	return arr[index];
}

BoolArray::BoolArray()
{

}

BoolArray::BoolArray(const BoolArray& copying)
{
	size = copying.size;
	arr = new bool[size];
	for (int i = 0; i < size; i++) arr[i] = copying.arr[i];
}

BoolArray::~BoolArray()
{
	if (size > 0) delete[] arr;
}

void BoolArray::operator=(const BoolArray& copying)
{
	size = copying.size;
	arr = new bool[size];
	for (int i = 0; i < size; i++) arr[i] = copying.arr[i];
}

void BoolArray::push(bool pushing)
{
	bool* newArr = new bool[++size];
	for (int i = 0; i < size - 1; i++) newArr[i] = arr[i];
	newArr[size - 1] = pushing;
	bool* dummy = arr;
	arr = newArr;
	delete[] dummy;
}

int BoolArray::getSize() { return size; }

bool BoolArray::operator[](int index)
{
	return arr[index];
}

bool isSKNF(string input, int argumentsQuantity)
{
	int* variablesInCurrentParenthesesSet = new int [argumentsQuantity];
	bool insideParentheses = false;
	bool* argumentsFound = new bool[argumentsQuantity];
	for (int i = 0; i < argumentsQuantity; i++) argumentsFound[i] = false;
	for (int i = 0; i < size(input); i++)
	{
		if (input[i] == '(')
		{
			for (int j = 0; j < argumentsQuantity; j++) variablesInCurrentParenthesesSet[j] = 0;
			insideParentheses = true;
		}
		if (insideParentheses && input[i] != ' ' && input[i] != '!' && input[i] != 'x' && input[i] != '*') variablesInCurrentParenthesesSet[(int)(input[i] - '0') - 1]++;
		if (insideParentheses && input[i] == '*') return false;
		if (input[i] == ')')
		{
			if (i < size(input) - 2 && input[i + 2] == '+') return false;
			for (int j = 0; j < argumentsQuantity; j++) if (variablesInCurrentParenthesesSet[j] != 1) return false;
			insideParentheses = false;
		}
		if (input[i] == 'x') argumentsFound[(int)(input[i + 1]) - '0' - 1] = true;
	}
	for (int i = 0; i < argumentsQuantity; i++) if (argumentsFound[i] != true) return false;
	return true;
}

bool isSDNF(string input, int argumentsQuantity)
{
	int* variablesInCurrentParenthesesSet = new int[argumentsQuantity];
	bool insideParentheses = false;
	bool* argumentsFound = new bool[argumentsQuantity];
	for (int i = 0; i < argumentsQuantity; i++) argumentsFound[i] = false;
	for (int i = 0; i < size(input); i++)
	{
		if (input[i] == '(')
		{
			for (int j = 0; j < argumentsQuantity; j++) variablesInCurrentParenthesesSet[j] = 0;
			insideParentheses = true;
		}
		if (insideParentheses && input[i] != ' ' && input[i] != '!' && input[i] != 'x' && input[i] != '+') variablesInCurrentParenthesesSet[(int)(input[i] - '0') - 1]++;
		if (insideParentheses && input[i] == '+') return false;
		if (input[i] == ')')
		{
			if (i < size(input) - 2 && input[i + 2] == '*') return false;
			for (int j = 0; j < argumentsQuantity; j++) if (variablesInCurrentParenthesesSet[j] != 1) return false;
			insideParentheses = false;
		}
		if (input[i] == 'x') argumentsFound[(int)(input[i+1]) - '0' - 1] = true;
	}
	for (int i = 0; i < argumentsQuantity; i++) if (argumentsFound[i] != true) return false;
	return true;
}

bool bothSumOrProduct(string left, string right)
{
	string twoOrMoreArgumentFunction;
	if (size(left) == 2)
	{
		if (size(right) == 2) return true;
		else twoOrMoreArgumentFunction = right;
	}
	else twoOrMoreArgumentFunction = left;
	char connector;
	for (int i = 0; i < size(twoOrMoreArgumentFunction); i++)
	{
		if (twoOrMoreArgumentFunction[i] == '+')
		{
			connector = '+';
			break;
		}
		if (twoOrMoreArgumentFunction[i] == '*')
		{
			connector = '*';
			break;
		}
		if (i == size(twoOrMoreArgumentFunction) - 1) return false;
	}
	for (int i = 2; i < size(left); i++)
	{
		if (left[i] == 'x')
		{
			if (left[i - 1] == '!')
			{
				if (left[i - 3] != connector) return false;
			}
			else if (left[i - 2] != connector) return false;
		}
	}
	for (int i = 2; i < size(right); i++)
	{
		if (right[i] == 'x')
		{
			if (right[i - 1] == '!')
			{
				if (right[i - 3] != connector) return false;
			}
			else if (right[i - 2] != connector) return false;
		}
	}
	return true;
}

bool areNeighboring(string left, string right)
{
	if (!bothSumOrProduct(left, right)) return false;
	int differentArguments = 0;
	int leftArguments = 0, rightArguments = 0;
	for (int leftIndex = 0; leftIndex < size(left) - 1; leftIndex++)
	{
		if (left[leftIndex] == 'x')
		{
			leftArguments++;
			bool leftNegated = (leftIndex > 0 && left[leftIndex - 1] == '!');
			for (int rightIndex = 0; rightIndex < size(right) - 1; rightIndex++)
			{
				if (right[rightIndex] == 'x' && right[rightIndex + 1] == left[leftIndex + 1])
				{
					bool rightNegated = (rightIndex > 0 && right[rightIndex - 1] == '!');
					if(leftNegated ^ rightNegated) differentArguments++;
					break;
				}
				if (rightIndex == size(right) - 2) return false;
			}
		}
	}
	for (int rightIndex = 0; rightIndex < size(right); rightIndex++)
	{
		if (right[rightIndex] == 'x') rightArguments++;
	}
	if (leftArguments != rightArguments) return false;
	if (differentArguments == 1) return true;
	else return false;
}

bool areEquivalent(string left, string right)
{
	if (!bothSumOrProduct(left, right)) return false;
	int leftArguments = 0, rightArguments = 0;
	for (int leftIndex = 0; leftIndex < size(left) - 1; leftIndex++)
	{
		if (left[leftIndex] == 'x')
		{
			leftArguments++;
			bool leftNegated = (leftIndex > 0 && left[leftIndex - 1] == '!');
			for (int rightIndex = 0; rightIndex < size(right) - 1; rightIndex++)
			{
				if (right[rightIndex + 1] == left[leftIndex + 1])
				{
					rightArguments++;
					bool rightNegated = (rightIndex > 0 && right[rightIndex - 1] == '!');
					if (leftNegated ^ rightNegated) return false;
					break;
				}
				if (rightIndex == size(right) - 2) return false;
			}
		}
	}
	if (leftArguments != rightArguments) return false;
	return true;
}

bool aSubfunctionOf(string function, string subfunction)
{
	if (!bothSumOrProduct(function, subfunction)) return false;
	for (int sfIndex = 0; sfIndex < size(subfunction) - 1; sfIndex++)
	{
		if (subfunction[sfIndex] == 'x')
		{
			bool sfargNegated = (sfIndex > 0 && subfunction[sfIndex - 1] == '!');
			for (int fIndex = 0; fIndex < size(function) - 1; fIndex++)
			{
				if (function[fIndex + 1] == subfunction[sfIndex + 1])
				{
					bool fargNegated = (fIndex > 0 && function[fIndex - 1] == '!');
					if (sfargNegated ^ fargNegated) return false;
					break;
				}
				if (fIndex == size(function) - 2) return false;
			}
		}
	}
	return true;
}

bool evaluateImplicant(string input, BoolArray args)
{
	if (size(input) <= 3)
	{
		if (input[0] == '!') return !args[(int)(input[2] - '0') - 1];
		else return args[(int)(input[1] - '0') - 1];
	}
	int separatorIndex = (input[0] == '!') ? 4 : 3;
	bool leftSide = (input[0] == '!') ? !args[(int)(input[2] - '0') - 1] : args[(int)(input[1] - '0') - 1];
	string rightSide;
	for (int i = separatorIndex + 2; i < size(input); i++) rightSide += input[i];
	if (input[separatorIndex] == '+') return leftSide || evaluateImplicant(rightSide, args);
	else return leftSide && evaluateImplicant(rightSide, args);
}

bool evaluateFunction(string input, BoolArray args)
{
	int implicants = 0;
	int separatorIndex;
	bool separatorIndexSet = false;
	for (int i = 0; i < size(input); i++)
	{
		if (input[i] == '(') implicants++;
		if (input[i] == ')' && !separatorIndexSet)
		{
			separatorIndex = i + 2;
			separatorIndexSet = true;
		}
	}
	if (implicants == 1) return evaluateImplicant(clearParentheses(input), args);
	string leftSide;
	for (int i = 0; i < separatorIndex - 1; i++) leftSide += input[i];
	string rightSide;
	for (int i = separatorIndex + 2; i < size(input); i++) rightSide += input[i];
	if (input[separatorIndex] == '+') return evaluateImplicant(clearParentheses(leftSide), args) || evaluateFunction(rightSide, args);
	else return evaluateImplicant(clearParentheses(leftSide), args) && evaluateFunction(rightSide, args);
}

bool checkImplicantImportance(string input, string implicant)
{
	BoolArray lockedArgs;
	int* lockedArgsIndeces = new int[0];
	int lockedArgsQuantity = 0;
	bool disjunctiveImplicant = false;
	for (int i = 0; i < size(implicant); i++)
	{
		if (implicant[i] == ' ')
		{
			if (implicant[i + 1] == '+') disjunctiveImplicant = true;
			else disjunctiveImplicant = false;
			break;
		}
	}
	for (int i = 0; i < size(implicant); i++)
	{
		if (implicant[i] == 'x')
		{
			push(&lockedArgsIndeces, (int)(implicant[i + 1] - '0'), lockedArgsQuantity++);
			if (disjunctiveImplicant)
			{
				if (i == 0 || implicant[i - 1] == ' ')
				{
					lockedArgs.push(false);
				}
				else lockedArgs.push(true);
			}
			else
			{
				if (i == 0 || implicant[i - 1] == ' ')
				{
					lockedArgs.push(true);
				}
				else lockedArgs.push(false);
			}
		}
	}
	string inputWithNoImplicant = "";
	int ignoredIndexLeft, ignoredIndexRight;
	for (int i = 0; i < size(input); i++)
	{
		if (input[i] == '(')
		{
			int prevIndexValue = i;
			i++;
			for (int j = 0; j < size(implicant); j++)
			{
				if (input[i] != implicant[j])
				{
					i = prevIndexValue;
					break;
				}
				else i++;
				if (j == size(implicant) - 1)
				{
					ignoredIndexLeft = prevIndexValue;
					ignoredIndexRight = (i <= size(input) - 3) ? i + 3 : i;
				}
			}
		}
	}
	for (int i = 0; i < size(input); i++)
	{
		if (i >= ignoredIndexLeft && i <= ignoredIndexRight) continue;
		else inputWithNoImplicant += input[i];
	}
	cout << inputWithNoImplicant;
	return true;
}

string concatenateNeighboring(string left, string right)
{
	string result;
	string currentPossibleExtraTerm = "";
	string extraTerm;
	int extraTermIndex;
	bool breakUpperCycle = false;
	for (int leftIndex = 0; leftIndex < size(left) - 1; leftIndex++)
	{
		if (left[leftIndex] == '!') currentPossibleExtraTerm += '!';
		if (left[leftIndex] == 'x')
		{
			currentPossibleExtraTerm += 'x';
			currentPossibleExtraTerm += left[leftIndex + 1];
			if (currentPossibleExtraTerm[0] == '!')
			{
				for (int rightIndex = 0; rightIndex < size(right) - 1; rightIndex++)
				{
					if (right[rightIndex] == 'x' && right[rightIndex + 1] == currentPossibleExtraTerm[2] && (rightIndex == 0 || right[rightIndex - 1] != '!'))
					{
						extraTermIndex = leftIndex - 1;
						breakUpperCycle = true;
						break;
					}
					if (rightIndex == size(right) - 2) currentPossibleExtraTerm = "";
				}
			}
			else
			{
				for (int rightIndex = 0; rightIndex < size(right) - 1; rightIndex++)
				{
					if (right[rightIndex] == 'x' && right[rightIndex + 1] == currentPossibleExtraTerm[1] && rightIndex != 0 && right[rightIndex - 1] == '!')
					{
						extraTermIndex = leftIndex;
						breakUpperCycle = true;
						break;
					}
					if (rightIndex == size(right) - 2) currentPossibleExtraTerm = "";
				}
			}
		}
		if (breakUpperCycle)
		{
			extraTerm = currentPossibleExtraTerm;
			break;
		}
	}
	int ignoredLeftBorder, ignoredRightBorder;
	bool bordersSet = false;
	if (extraTermIndex == 0)
	{
		ignoredLeftBorder = 0;
		ignoredRightBorder = size(extraTerm) + 2;
		bordersSet = true;
	}
	if (extraTermIndex == size(left) - size(extraTerm))
	{
		ignoredLeftBorder = size(left) - size(extraTerm) - 3;
		ignoredRightBorder = size(left) - 1;
		bordersSet = true;
	}
	if (!bordersSet)
	{
		ignoredLeftBorder = extraTermIndex;
		ignoredRightBorder = extraTermIndex + size(extraTerm) + 2;
	}
	for (int i = 0; i < size(left); i++)
	{
		if (i < ignoredLeftBorder || i > ignoredRightBorder) result += left[i];
	}
	return result;
}

string reduceViaCalculatingMethod(string stage1output)
{
	StringArray implicants(stage1output);
	return stage1output;
}

string reduceViaTableCalculatingMethod(string initialInput, string stage1output)
{
	StringArray initialInputArr(initialInput);
	StringArray stage1outputArr(stage1output);
	int initialInputArrSize = initialInputArr.getSize();
	int stage1outputArrSize = stage1outputArr.getSize();
	bool** table = new bool* [stage1outputArrSize];
	for (int i = 0; i < stage1outputArrSize; i++) table[i] = new bool [initialInputArrSize];
	string expression, constituent;
	for (int currExpression = 0; currExpression < stage1outputArrSize; currExpression++)
	{
		expression = stage1outputArr[currExpression];
		for (int currConstituent = 0; currConstituent < initialInputArrSize; currConstituent++)
		{
			constituent = initialInputArr[currConstituent];
			table[currExpression][currConstituent] = aSubfunctionOf(constituent, expression);
		}
	}
	/*for (int i = 0; i < stage1outputArrSize; i++)
	{
		for (int j = 0; j < initialInputArrSize; j++)
		{
			if (table[i][j]) printf("1 ");
			else printf("0 ");
		}
		printf("\n");
	}
	printf("\n");*/
	bool* ignoredRows = new bool [stage1outputArrSize];
	for (int i = 0; i < stage1outputArrSize; i++) ignoredRows[i] = false;
	for (int i = 0; i < stage1outputArrSize; i++)
	{
		if (redundantRow(table, stage1outputArrSize, initialInputArrSize, i, ignoredRows)) ignoredRows[i] = true;
	}
	string result;
	string connector;
	for (int i = 0; i < size(initialInputArr[0]); i++)
	{
		if (initialInputArr[0][i] == ' ')
		{
			connector += ' ';
			connector += (initialInputArr[0][i + 1] == '*') ? '+' : '*';
			connector += ' ';
			break;
		}
	}
	bool firstImplicant = false;
	for (int i = 0; i < stage1outputArrSize; i++)
	{
		if (!ignoredRows[i])
		{
			if (!firstImplicant) firstImplicant = true;
			else result += connector;
			result += '(';
			result += stage1outputArr[i];
			result += ')';
		}
	}
	return result;
}

bool redundantRow(bool** table, int tableHeight, int tableWidth, int row, bool* ignoredRows)
{
	bool** tableCut = new bool* [tableHeight - 1];
	for (int i = 0; i < tableHeight - 1; i++) tableCut[i] = new bool[tableWidth];
	int offset = 0;
	for (int i = 0; i < tableHeight - 1; i++)
	{
		if (i == row) offset = 1;
		for (int j = 0; j < tableWidth; j++)
		{
			tableCut[i][j] = table[i + offset][j];
			//if (tableCut[i][j]) printf("1 ");
			//else printf("0 ");
		}
		//printf("\n");
	}
	bool trueInCurrentColumn;
	for (int j = 0; j < tableWidth; j++)
	{
		trueInCurrentColumn = false;
		for (int i = 0; i < tableHeight - 1; i++)
		{
			if (ignoredRows[i]) continue;
			if (tableCut[i][j]) trueInCurrentColumn = true;
		}
		if (!trueInCurrentColumn) return false;
	}
	return true;
}

string concatenateAllNeighboringIn(string input)
{
	StringArray constituents(input);
	StringArray orderMinusOneImplicants;
	string currImplicant, currLeftConstituent, currRightConstituent;
	int constituentsArraySize = constituents.getSize();
	bool* usedConstituents = new bool [constituentsArraySize];
	for (int i = 0; i < constituentsArraySize; i++) usedConstituents[i] = false;
	for (int leftIndex = 0; leftIndex < constituentsArraySize; leftIndex++)
	{
		currLeftConstituent = constituents[leftIndex];
		for (int rightIndex = leftIndex + 1; rightIndex < constituentsArraySize; rightIndex++)
		{
			currRightConstituent = constituents[rightIndex];
			if (areNeighboring(currLeftConstituent, currRightConstituent))
			{
				usedConstituents[leftIndex] = true;
				usedConstituents[rightIndex] = true;
				currImplicant = concatenateNeighboring(currLeftConstituent, currRightConstituent);
				if (!orderMinusOneImplicants.has(currImplicant)) orderMinusOneImplicants.push(currImplicant);
			}
		}
	}
	StringArray orderMinusTwoImplicants;
	string currLeftImplicant, currRightImplicant;
	int orderMinusOneImplicantsArraySize = orderMinusOneImplicants.getSize();
	bool* usedOrderMinusOneImplicants = new bool [orderMinusOneImplicantsArraySize];
	for (int i = 0; i < orderMinusOneImplicantsArraySize; i++) usedOrderMinusOneImplicants[i] = false;
	for (int leftIndex = 0; leftIndex < orderMinusOneImplicantsArraySize; leftIndex++)
	{
		currLeftImplicant = orderMinusOneImplicants[leftIndex];
		for (int rightIndex = leftIndex + 1; rightIndex < orderMinusOneImplicantsArraySize; rightIndex++)
		{
			currRightImplicant = orderMinusOneImplicants[rightIndex];
			if (areNeighboring(currLeftImplicant, currRightImplicant))
			{
				usedOrderMinusOneImplicants[leftIndex] = true;
				usedOrderMinusOneImplicants[rightIndex] = true;
				currImplicant = concatenateNeighboring(currLeftImplicant, currRightImplicant);
				if (!orderMinusTwoImplicants.has(currImplicant)) orderMinusTwoImplicants.push(currImplicant);
				break;
			}
		}
	}
	int orderMinusTwoImplicantsArraySize = orderMinusTwoImplicants.getSize();
	string connector;
	for (int i = 0; i < size(input); i++)
	{
		if (input[i] == ' ')
		{
			connector += ' ';
			if (input[i + 1] == '*') connector += '+';
			else connector += '*';
			connector += ' ';
			break;
		}
		if (i == size(input) - 1) connector = "   ";
	}
	string intermediateResult;
	for (int i = 0; i < constituentsArraySize; i++)
	{
		if (!usedConstituents[i])
		{
			intermediateResult += '(';
			intermediateResult += constituents[i];
			intermediateResult += ')';
			intermediateResult += connector;
		}
	}
	for (int i = 0; i < orderMinusOneImplicantsArraySize; i++)
	{
		if (!usedOrderMinusOneImplicants[i])
		{
			intermediateResult += '(';
			intermediateResult += orderMinusOneImplicants[i];
			intermediateResult += ')';
			intermediateResult += connector;
		}
	}
	for (int i = 0; i < orderMinusTwoImplicantsArraySize; i++)
	{
		intermediateResult += '(';
		intermediateResult += orderMinusTwoImplicants[i];
		intermediateResult += ')';
		intermediateResult += connector;
	}
	string result;
	int intermediateResultSize = size(intermediateResult); // or else the below condition wont work in case the input was an empty string, since size() return an unsigned int, and subtracting something from 0 in unsigned int sends it to 4 billion instead of negatives
	for (int i = 0; i < intermediateResultSize - 3; i++) result += intermediateResult[i];
	return result;
}

string consumeAllIn(string input)
{
	string connector;
	for (int i = 0; i < size(input); i++)
	{
		if (input[i] == ' ')
		{
			connector += ' ';
			connector += (input[i + 1] == '*') ? '+' : '*';
			connector += ' ';
			break;
		}
	}
	bool changeMade;
	string result = input;
	do
	{
		changeMade = false;
		StringArray expressions(result);
		StringArray resultArr;
		string currExpression;
		string currLeftExpression, currRightExpression;
		int expressionsArraySize = expressions.getSize();
		bool* consumed = new bool [expressionsArraySize];
		for (int i = 0; i < expressionsArraySize; i++) consumed[i] = false;
		if (expressionsArraySize == 1) resultArr = expressions;
		else 
		{
			for (int leftIndex = 0; leftIndex < expressionsArraySize; leftIndex++)
			{
				currLeftExpression = expressions[leftIndex];
				if (changeMade && !resultArr.has(currLeftExpression) && !consumed[leftIndex]) resultArr.push(currLeftExpression);
				for (int rightIndex = 0; rightIndex < expressionsArraySize; rightIndex++)
				{
					if (leftIndex == rightIndex) continue;
					currRightExpression = expressions[rightIndex];
					if (changeMade && !resultArr.has(currRightExpression) && !consumed[rightIndex])
					{
						resultArr.push(currRightExpression);
						continue;
					}
					if (aSubfunctionOf(currLeftExpression, currRightExpression) && !resultArr.has(currRightExpression))
					{
						resultArr.push(currRightExpression);
						consumed[leftIndex] = true;
						changeMade = true;
					}
					if (aSubfunctionOf(currRightExpression, currLeftExpression) && !resultArr.has(currLeftExpression))
					{
						resultArr.push(currLeftExpression);
						consumed[rightIndex] = true;
						changeMade = true;
					}
				}
			}
		}
		if (!changeMade) resultArr = expressions;
		result = "";
		int resultArrSize = resultArr.getSize();
		for (int i = 0; i < resultArrSize; i++)
		{
			if (i > 0) result += connector;
			result += '(';
			result += resultArr[i];
			result += ')';
		}
	} 	
	while (changeMade);
	return result;
}

string stage1(string input)
{
	string result = input, prevResult;
	do
	{
		prevResult = result;
		result = concatenateAllNeighboringIn(result);
		result = consumeAllIn(result);
	} 	
	while (prevResult != result);
	return result;
}