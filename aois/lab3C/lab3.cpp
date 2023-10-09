#include <iostream>
#include "lab3header.h"

using namespace std;

int main()
{
	/*int argumentsQuantity;
	printf("How many arguments will there be in the function?\n");
	while (true)
	{
		cin >> argumentsQuantity;
		if (cin.fail() || argumentsQuantity <= 0)
		{
			printf("It appears that you have entered something that was not allowed. My disappointment is immeasurable and my day is ruined. I beg of you, tell me, how many arguments there will be in the function.\n");
			cin.clear();
			cin.ignore(256, '\n');
			continue;
		}
		break;
	}
	string function;
	printf("\nInput the function:\n");
	while (true)
	{
		getline(cin >> ws, function);
		if (cin.fail())
		{
			printf("It appears that you have entered something that was not allowed. My disappointment is immeasurable and my day is ruined. At least input some tangible text, will you?\n");
			cin.clear();
			cin.ignore(256, '\n');
			continue;
		}
		if (!isSDNF(function, argumentsQuantity) && !isSKNF(function, argumentsQuantity))
		{
			printf("It appears that you have entered something that is not in its full form. My disappointment is measurable and my day is not yet ruined. Please input a function it its full form.\n");
			cin.clear();
			cin.ignore(256, '\n');
			continue;
		}
		break;
	}
	printf("\nIt appears that the minimized form of your function is ");*/
	checkImplicantImportance("(x1 * !x2) + (x1 * x2) + (!x1 * x2) + (!x1 * !x2)", "x1 * x2");
	printf(".\n\n");
	return 0;
}

