#include <iostream>

using namespace std;

class NaturalFraction
{
private:
	int numerator, denominator;
	bool numeratorSet, denominatorSet;
	void reduce();
public:
	NaturalFraction();
	NaturalFraction(NaturalFraction& currFraction);

	int getNumerator();
	int getDenominator();
	void setNumerator(int newNum);
	void setDenominator(int newDen);
	int getIntegerPart();
	double toDouble();

	NaturalFraction operator+(const NaturalFraction& term);
	NaturalFraction operator+(int term);
	NaturalFraction operator-(int term);
	NaturalFraction operator/(int term);

	void operator+=(const NaturalFraction& term);
	void operator+=(int term);
	void operator-=(int term);
	void operator/=(int term);

	bool operator==(const NaturalFraction& term);
	bool operator!=(const NaturalFraction& term);

	friend istream& operator>>(istream& input, NaturalFraction& fr);
	friend ostream& operator<<(ostream& input, NaturalFraction& fr);
};

void tests();

bool test1(); // test 1: testing the ability to take the numerator of a fraction
bool test2(); // test 2: testing the ability to take the denominator of a fraction
bool test3(); // tests 3-5: testing the ability to take the integer part of a fraction
bool test4();
bool test5();
bool test6(); // tests 6-10: testing the ability to reduce a fraction
bool test7();
bool test8();
bool test9();
bool test10();
bool test11(); // tests 11-15: testing the ability to convert a fraction to double
bool test12();
bool test13();
bool test14();
bool test15();
bool test16(); // tests 16-20: testing the ability to copy a fraction
bool test17();
bool test18();
bool test19();
bool test20();
bool test21(); // tests 21-24: testing the ability to check if two fractions are equal
bool test22();
bool test23();
bool test24(); 
bool test25(); // tests 25-28: testing the ability to check if two fractions are not equal
bool test26();
bool test27();
bool test28();
bool test29(); // tests 29-33: testing the ability to add two fractions (+)
bool test30();
bool test31();
bool test32();
bool test33();
bool test34(); // tests 34-38: testing the ability to add two fractions (+=)
bool test35();
bool test36();
bool test37();
bool test38();
bool test39(); // tests 39-41: testing the ability to add a number to a fraction (+)
bool test40();
bool test41();
bool test42(); // tests 42-44: testing the ability to add a number to a fraction (+=)
bool test43();
bool test44();
bool test45(); // tests 45-49: testing the ability to subtract a fraction from a fraction (-)
bool test46();
bool test47();
bool test48();
bool test49();
bool test50(); // tests 50-54: testing the ability to subtract a fraction from a fraction (-=)
bool test51();
bool test52();
bool test53();
bool test54();
bool test55(); // tests 55-57: testing the ability to subtract a number from a fraction (-)
bool test56();
bool test57();
bool test58(); // tests 58-60: testing the ability to subtract a number from a fraction (-=)
bool test59();
bool test60();
bool test61(); // tests 61-63: testing the ability to multiply two fractions (*)
bool test62();
bool test63();
bool test64(); // tests 64-66: testing the ability to multiply two fractions (*=)
bool test65();
bool test66();
bool test67(); // tests 67-69 (nice): testing the ability to multiply a fraction by a number (*)
bool test68();
bool test69();
bool test70(); // tests 70-72: testing the ability to multiply a fraction by a number (*=)
bool test71();
bool test72();
bool test73(); // tests 73-75: testing the ability to divide a fraction by a fraction (/)
bool test74();
bool test75();
bool test76(); // tests 76-78: testing the ability to divide a fraction by a fraction (/=)
bool test77();
bool test78();
bool test79(); // tests 79-81: testing the ability to divide a fraction by a number (/)
bool test80();
bool test81();
bool test82(); // tests 82-84: testing the ability to divide a fraction by a number (/=)
bool test83();
bool test84();