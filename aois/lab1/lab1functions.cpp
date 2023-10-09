#include <iostream>
#include "lab1.h"

BinaryNumber add(BinaryNumber num1, BinaryNumber num2, int code)
{
    Array result;
    Array num1arrConverted;
    Array num2arrConverted;
    switch (code)
    {
        case 0:
        {
            num1arrConverted = num1.convertToDirect().getNumber();
            num2arrConverted = num2.convertToDirect().getNumber();
            break;
        }
        case 1:
        {
            num1arrConverted = num1.convertToComplementary().getNumber();
            num2arrConverted = num2.convertToComplementary().getNumber();
            break;
        }
        case 2:
        {
            num1arrConverted = num1.convertToInverse().getNumber();
            num2arrConverted = num2.convertToInverse().getNumber();
            break;
        }
    }
    int carrying = 0;
    int temp;
    for (int i = 31; i >= (code == 0) ? 1 : 0; i--)
    {
        temp = num1arrConverted[i] + num2arrConverted[i] + carrying;
        result.unshift(temp % 2);
        if (temp >= 2) carrying = 1;
        else carrying = 0;
    }
    if (code == 0)
    {
        if (num1.getNumber()[0] == 1 || num2.getNumber()[0] == 1)
        {
            Array num1arr = num1.getNumber();
            Array num2arr = num2.getNumber();
            for (int i = 1; i <= 32; i++)
            {
                if (i == 32)
                {
                    result.unshift(0);
                    break;
                }
                if (num1arr[i] > num2arr[i])
                {
                    result.unshift(0);
                    break;
                }
                if (num1arr[i] < num2arr[i])
                {
                    result.unshift(1);
                    break;
                }
            }
        }
        else result.unshift(0);
    }
    BinaryNumber res;
    res.setNumber(result, code);
    if (code == 2) res = add(res, *(new BinaryNumber(1)), 0);
    return res;
}

BinaryNumber multiply(BinaryNumber num1, BinaryNumber num2)
{
    Array num1arr, num2arr, num1arrPos, num2arrPos;
    num1arr = num1.convertToDirect().getNumber();
    num2arr = num2.convertToDirect().getNumber();
    num1arrPos = num1arr;
    num1arrPos.shift();
    num1arrPos.unshift(0);
    num2arrPos = num2arr;
    num2arrPos.shift();
    num2arrPos.unshift(0);
    BinaryNumber res;
    res.setNumber(0);
    for (int i = 31; i >= 1; i--)
    {
        Array currterm;
        if (num2arrPos[i] == 1)
        {
            currterm = num1arrPos;
            for (int j = 0; j < 31 - i; j++)
            {
                currterm.shift();
                currterm.push(0);
            }
            BinaryNumber currtermBin;
            currtermBin.setNumber(currterm, 0);
            res = add(res, currtermBin, 0);
        }
    }
    Array result = res.getNumber();
    result.shift();
    if ((num1arr[0] == 1 && num2arr[0] == 1) || (num1arr[0] == 0 && num2arr[0] == 0)) result.unshift(0);
    else result.unshift(1);
    res.setNumber(result, 0);
    return res;
}

Array decimalToDirect32bitBin(int input)
{
    Array binary;
    int currentNumerator = input;
    if (input < 0) currentNumerator *= -1;
    do
    {
        binary.push(currentNumerator % 2);
        currentNumerator /= 2;
    }     while (currentNumerator != 0);
    while (binary.length < 31) binary.push(0);
    if (input < 0) binary.push(1);
    else binary.push(0);
    binary.reverse();
    return binary;
}

BinaryNumber::BinaryNumber()
{
    setNumber(0);
}
BinaryNumber::BinaryNumber(int num)
{
    setNumber(num);
}
BinaryNumber::BinaryNumber(BinaryNumber& copying)
{
    setNumber(copying.getNumber(), copying.code);
}
void BinaryNumber::setNumber(int input)
{
    number = decimalToDirect32bitBin(input);
    if (input < 0) sign = 1;
    else sign = 0;
    code = 0;
}
void BinaryNumber::setNumber(Array input, int givenCode)
{
    code = givenCode;
    if (number.length > 0) for (int i = 0; i < 32; i++) number.pop();
    for (int i = 0; i < 32; i++) number.push(input[i]);
    if (code == 0) sign = input[0];
    else
    {
        BinaryNumber copy = (*this);
        sign = copy.convertToDirect().getNumber()[0];
    }
}
Array BinaryNumber::getNumber() { return number; }
int BinaryNumber::getCode() { return code; }
BinaryNumber& BinaryNumber::convertToDirect()
{
    if (sign == 0 || code == 0) return (*this);
    if (code == 1)
    {
        BinaryNumber one;
        one.setNumber(-1);
        one.convertToComplementary();
        number = add((*this), one, 1).getNumber();
        Array newNumber;
        for (int i = 1; i < 32; i++)
        {
            if (number[i] == 0) newNumber.push(1);
            else newNumber.push(0);
        }
        number = newNumber.unshift(1);
    }
    if (code == 2)
    {
        Array newNumber;
        for (int i = 0; i < 16; i++)
        {
            if (number[i] == 0) newNumber.push(1);
            else newNumber.push(0);
        }
    }
    code = 0;
    return *this;
}
BinaryNumber& BinaryNumber::convertToComplementary()
{
    if (sign == 0 || code == 1) return (*this);
    if (code == 0)
    {
        Array newNumber;
        newNumber.push(1);
        for (int i = 1; i < 32; i++)
        {
            if (number[i] == 0) newNumber.push(1);
            else newNumber.push(0);
        }
        BinaryNumber one;
        one.setNumber(1);
        number = newNumber;
        number = add((*this), one, 0).getNumber();
        code = 1;
        return *this;
    }
    else return (*this).convertToDirect().convertToComplementary();
}
BinaryNumber& BinaryNumber::convertToInverse()
{
    if (sign == 0 || code == 2) return *this;
    if (code == 0)
    {
        Array newNumber;
        newNumber.push(1);
        for (int i = 1; i < 32; i++)
        {
            if (number[i] == 0) newNumber.push(1);
            else newNumber.push(0);
        }
        number = newNumber;
        code = 2;
        return *this;
    }
    else return  (*this).convertToDirect().convertToInverse();
}