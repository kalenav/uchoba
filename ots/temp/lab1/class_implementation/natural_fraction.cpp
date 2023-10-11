#include "natural_fraction.h"
#include <iostream>

using namespace std;

NaturalFraction::NaturalFraction()
{
	setNumerator(1);
	setDenominator(1);
}
NaturalFraction::NaturalFraction(NaturalFraction& currFraction)
{
	numerator = currFraction.numerator;
	denominator = currFraction.denominator;
}

int NaturalFraction::getNumerator() { return numerator; }
int NaturalFraction::getDenominator() { return denominator; }
void NaturalFraction::setNumerator(int newNum) 
{ 
	numerator = newNum; 
	numeratorSet = true;
	reduce();
}
void NaturalFraction::setDenominator(int newDen) 
{ 
	denominator = newDen; 
	denominatorSet = true;
	reduce();
}
int NaturalFraction::getIntegerPart() { return numerator / denominator; }
void NaturalFraction::reduce() 
{ 
	if (!numeratorSet || !denominatorSet) return;
	int less = (numerator < denominator) ? numerator : denominator;
	for (int currdivisor = 2; currdivisor <= less; currdivisor++)
	{
		if (numerator % currdivisor == 0 && denominator % currdivisor == 0)
		{
			numerator /= currdivisor;
			denominator /= currdivisor;
			currdivisor--;
		}
	}
}
double NaturalFraction::toDouble()
{
	double numeratorDouble = numerator * 1.0;
	return numeratorDouble / denominator;
}

NaturalFraction NaturalFraction::operator+(const NaturalFraction& term)
{
	NaturalFraction result;
	result.setDenominator(term.denominator * denominator);
	result.setNumerator(numerator * term.denominator + term.numerator * denominator);
	return result;
}
NaturalFraction NaturalFraction::operator+(int term)
{
	NaturalFraction result;
	result.setDenominator(denominator);
	result.setNumerator(numerator + term * denominator);
	return result;
}
NaturalFraction NaturalFraction::operator-(int term)
{
	NaturalFraction result;
	result.setDenominator(denominator);
	result.setNumerator(numerator - term * denominator);
	return result;
}
NaturalFraction NaturalFraction::operator/(int term)
{
	NaturalFraction result;
	result.setNumerator(numerator);
	result.setDenominator(denominator * term);
	return result;
}

void NaturalFraction::operator+=(const NaturalFraction& term)
{
	int tempdenominator = denominator;
	denominator = term.denominator * denominator;
	numerator = numerator * term.denominator + term.numerator * tempdenominator;
	reduce();
}
void NaturalFraction::operator+=(int term)
{
	setNumerator(numerator + term * denominator);
}
void NaturalFraction::operator-=(int term)
{
	setNumerator(numerator - term * denominator);
}
void NaturalFraction::operator/=(int term)
{
	denominator *= term;
}

bool NaturalFraction::operator==(const NaturalFraction& term)
{
	if (numerator == term.numerator && denominator == term.denominator) return true;
	else return false;
}
bool NaturalFraction::operator!=(const NaturalFraction& term)
{
	if (numerator != term.numerator || denominator != term.denominator) return true;
	else return false;
}

istream& operator>>(istream& input, NaturalFraction& fr)
{
	input >> fr.numerator >> fr.denominator;
	fr.reduce();
	return input;
}
ostream& operator<<(ostream& output, NaturalFraction& fr)
{
	output << fr.numerator << "/" << fr.denominator;
	return output;
}