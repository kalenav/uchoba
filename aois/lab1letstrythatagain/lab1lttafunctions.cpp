#include "lab1ltta.h"
#include <iostream>

int* decimalToDirect32bitBin(int num)
{
	int* resultReverse = new int[32];
	bool isNegative = false;
	if (num < 0)
	{
		num *= -1;
		isNegative = true;
	}
	for (int i = 0; i < 31; i++)
	{
		resultReverse[i] = num % 2;
		num /= 2;
	}
	if (isNegative) resultReverse[31] = 1;
	else resultReverse[31] = 0;
	int* result = new int[32];
	for (int i = 0; i < 32; i++) result[i] = resultReverse[31 - i];
	return result;
}

int* add(int* num1, int* num2)
{
	int* result = new int[32];
	int carrying = 0;
	int temp;
	for (int i = 31; i >= 0; i--)
	{
		temp = num1[i] + num2[i] + carrying;
		result[i] = temp % 2;
		if (temp > 1) carrying = 1;
		else carrying = 0;
	}
	return result;
}

int* multiply(int* num1, int* num2)
{
	int* result = new int[32];
	for (int i = 0; i < 32; i++) result[i] = 0;
	BinaryNumber currterm;
	currterm.setNumber(num1, 0);
	for (int i = 31; i >= 1; i--)
	{
		if (num2[i] == 1) result = add(result, currterm.getNumber());
		currterm << 1;
	}
	if ((num1[0] == 0 && num2[0] == 0) || (num1[0] == 1 && num2[0] == 1)) result[0] = 0;
	else result[0] = 1;
	return result;
}

int** divide(int* num1, int* num2)
{
	int** result = new int* [2];
	int* integerPart = new int[32];
	int* fractionalPart = new int[5];
	if ((num1[0] == 0 && num2[0] == 0) || (num1[0] == 1 && num2[0] == 1)) integerPart[0] = 0;
	else integerPart[0] = 1;
	for (int i = 1; i < 32; i++) integerPart[i] = 0;
	BinaryNumber currterm(0), one(1), divisorNegative;
	num2[0] = 1;
	divisorNegative.setNumber(num2, 0);
	divisorNegative.convertToComplementary();
	for (int i = 1; i < 32; i++)
	{
		currterm << 1;
		if(num1[i] == 1) currterm.setNumber(add(currterm.getNumber(), one.getNumber()), 0);
		if(compare(num2, currterm.getNumber())) integerPart[i] = 0;
		else
		{
			integerPart[i] = 1;
			currterm.setNumber(add(currterm.getNumber(), divisorNegative.getNumber()), 0);
		}
	}
	for (int i = 0; i < 5; i++)
	{
		currterm << 1;
		if (compare(num2, currterm.getNumber())) fractionalPart[i] = 0;
		else
		{
			fractionalPart[i] = 1;
			currterm.setNumber(add(currterm.getNumber(), divisorNegative.getNumber()), 0);
		}
	}
	result[0] = integerPart;
	result[1] = fractionalPart;
	return result;
}

bool compare(int* num1, int* num2)
{
	for (int i = 1; i < 32; i++)
	{
		if (num1[i] > num2[i]) return true;
		if (num1[i] < num2[i]) return false;
	}
	return false;
}

int* addFloatingPoint(int* num1, int* num2)
{
	int* result = new int[32];
	for (int i = 1; i < 9; i++)
	{
		if (num1[i] < num2[i])
		{
			while (num1[i] < num2[i])
			{
				for (int j = 8; j >= 1; j--)
				{
					if (num1[j] == 1) num1[j] = 0;
					else
					{
						num1[j] = 1;
						break;
					}
				}
				for (int j = 31; j >= 10; j--) num1[j] = num1[j - 1];
				num1[9] = 0;
			}
			break;
		}
		if (num2[i] < num1[i])
		{
			while (num2[i] < num1[i])
			{
				for (int j = 8; j >= 1; j--)
				{
					if (num2[j] == 1) num2[j] = 0;
					else
					{
						num2[j] = 1;
						break;
					}
				}
				for (int j = 31; j >= 10; j--) num2[j] = num2[j - 1];
				num2[9] = 0;
			}
			break;
		}
	}
	result[0] = 0;
	for (int i = 1; i < 9; i++) result[i] = num1[i];
	int carrying = 0;
	int temp;
	for (int i = 31; i >= 9; i--)
	{
		temp = num1[i] + num2[i] + carrying;
		result[i] = temp % 2;
		if (temp > 1) carrying = 1;
		else carrying = 0;
	}
	return result;
}

void printFloatingPoint(int* num)
{
	printf("%d | ", num[0]);
	for (int i = 1; i < 9; i++) printf("%d ", num[i]);
	printf("| ");
	for (int i = 9; i < 32; i++) printf("%d ", num[i]);
	printf("\n\n");
}

BinaryNumber::BinaryNumber()
{
	setNumber(0, 0);
}
BinaryNumber::BinaryNumber(int num)
{
	setNumber(num, 0);
}
BinaryNumber::BinaryNumber(const BinaryNumber& copying)
{
	setNumber(copying.number, copying.code);
}
void BinaryNumber::setNumber(int num, int givenCode)
{
	number = decimalToDirect32bitBin(num);
	if (num < 0) sign = 1;
	else sign = 0;
	switch (givenCode)
	{
		case 1:
		{
			(*this).convertToComplementary();
			break;
		}
		case 2:
		{
			(*this).convertToInverse();
			break;
		}
	}
	code = givenCode;
}
void BinaryNumber::setNumber(int* num, int givenCode)
{
	for (int i = 0; i < 32; i++) number[i] = num[i];
	code = givenCode;
	sign = num[0];
}
int BinaryNumber::getCode() { return code; }
int* BinaryNumber::getNumber() { return number; }
void BinaryNumber::print() 
{ 
	for (int i = 0; i < 32; i++) printf("%d ", number[i]); 
	printf("\n\n");
}
BinaryNumber BinaryNumber::convertToDirect()
{
	if (code == 0 || sign == 0) return *this;
	if (code == 1)
	{
		int* newNum = new int[32];
		for (int i = 1; i < 32; i++)
		{
			if (number[i] == 0) newNum[i] = 1;
			else newNum[i] = 0;
		}
		newNum[0] = 1;
		newNum = add(newNum, decimalToDirect32bitBin(1));
		setNumber(newNum, 0);
		return *this;
	}
	if (code == 2)
	{
		int* newNum = new int[32];
		for (int i = 1; i < 32; i++)
		{
			if (number[i] == 0) newNum[i] = 1;
			else newNum[i] = 0;
		}
		newNum[0] = 1;
		setNumber(newNum, 0);
		return *this;
	}
}
BinaryNumber BinaryNumber::convertToComplementary()
{
	if (code == 1 || sign == 0) return *this;
	if (code == 0)
	{
		int* newNum = new int[32];
		for (int i = 1; i < 32; i++)
		{
			if (number[i] == 0) newNum[i] = 1;
			else newNum[i] = 0;
		}
		newNum[0] = 1;
		setNumber(add(newNum, decimalToDirect32bitBin(1)), 1);
		return *this;
	}
	else return (*this).convertToDirect().convertToComplementary();
}
BinaryNumber BinaryNumber::convertToInverse()
{
	if (code == 2 || sign == 0) return *this;
	if (code == 0)
	{
		int* newNum = new int[32];
		for (int i = 1; i < 32; i++)
		{
			if (number[i] == 0) newNum[i] = 1;
			else newNum[i] = 0;
		}
		newNum[0] = 1;
		setNumber(newNum, 2);
		return *this;
	}
	else return (*this).convertToDirect().convertToInverse();
}
void BinaryNumber::operator<<(int places)
{
	for (int i = places; i < 32; i++) number[i - places] = number[i];
	for (int i = 31; i > 31 - places; i--) number[i] = 0;
}