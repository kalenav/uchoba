int* decimalToDirect32bitBin(int num);
int* add(int* num1, int* num2);
int* multiply(int* num1, int* num2);
int** divide(int* num1, int* num2);
bool compare(int* num1, int* num2);

int* addFloatingPoint(int* num1, int* num2);
void printFloatingPoint(int* num);

class BinaryNumber
{
private:
	int* number = new int[32];
	int code = 0;
	int sign = 0;
public:
	BinaryNumber();
	BinaryNumber(int num);
	BinaryNumber(const BinaryNumber& copying);
	void setNumber(int num, int givenCode);
	void setNumber(int* num, int givenCode);
	int* getNumber();
	int getCode();
	void print();
	BinaryNumber convertToDirect();
	BinaryNumber convertToComplementary();
	BinaryNumber convertToInverse();
	void operator<<(int places);
};