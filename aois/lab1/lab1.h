#include "array.h"

class BinaryNumber
{
private:
    Array number;
    int code;
    int sign;
public:
    BinaryNumber();
    BinaryNumber(int num);
    BinaryNumber(BinaryNumber& copying);
    void setNumber(int input);
    void setNumber(Array input, int givenCode);
    int getCode();
    Array getNumber();
    BinaryNumber& convertToDirect();
    BinaryNumber& convertToComplementary();
    BinaryNumber& convertToInverse();
};

class FloatingPointBinaryNumber
{
private:
    Array mantissaBin;
    Array orderBin;
    int sign;
    int mantissaDec;
public:
    void setMantissa(int input);
    void setSign(int input);
    void setOrder(Array order);
    void convertMantissaToBin();
    int getSign();
    Array getOrder();
    Array getMantissa();
};

Array decimalToDirect32bitBin(int input);

BinaryNumber add(BinaryNumber num1, BinaryNumber num2, int code);
BinaryNumber multiply(BinaryNumber num1, BinaryNumber num2);

