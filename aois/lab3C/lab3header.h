#include <string>
#include <iostream>

using namespace std;

class StringArray
{
private: 
	string* arr;
	int size = 0;
public:
	StringArray();
	StringArray(string input);
	StringArray(const StringArray& copying);
	~StringArray();
	void push(string pushing);
	bool has(string searching);
	int getSize();
	string operator[](int index);
	void operator=(const StringArray& copying);
};

class BoolArray
{
private:
	bool* arr;
	int size = 0;
public:
	BoolArray();
	BoolArray(const BoolArray& copying);
	~BoolArray();
	void push(bool pushing);
	int getSize();
	bool operator[](int index);
	void operator=(const BoolArray& copying);
};

bool isSKNF(string input, int argumentsQuantity);

bool isSDNF(string input, int argumentsQuantity);

bool bothSumOrProduct(string left, string right);

bool areNeighboring(string left, string right);

bool areEquivalent(string left, string right);

bool aSubfunctionOf(string function, string subfunction);

bool evaluateImplicant(string implicant, BoolArray args);

bool evaluateFunction(string function, BoolArray args);

bool redundantRow(bool** table, int tableHeight, int tableWidth, int row, bool* ignoredRows);

bool checkImplicantImportance(string input, string implicant);

string reduceViaCalculatingMethod(string stage1output);

string reduceViaTableCalculatingMethod(string initialInput, string stage1output);

string concatenateNeighboring(string left, string right);

string concatenateAllNeighboringIn(string input);

string consumeAllIn(string input);

string stage1(string input);