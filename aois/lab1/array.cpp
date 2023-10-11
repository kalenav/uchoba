#include <iostream>
#include "array.h"

Array& Array::push(int arg)
{
    int* newArray = new int[++length];
    for (int i = 0; i < length - 1; i++) newArray[i] = arr[i];
    newArray[length - 1] = arg;
    int* dummy = arr;
    arr = newArray;
    delete dummy;
    return *this;
}
Array& Array::unshift(int arg)
{
    int* newArray = new int[++length];
    newArray[0] = arg;
    for (int i = 1; i < length; i++) newArray[i] = arr[i - 1];
    int* dummy = arr;
    arr = newArray;
    delete dummy;
    return *this;
}
Array::Array()
{
    length = 0;
}
Array::Array(const Array& copying)
{
    length = 0;
    for (int i = 0; i < copying.length; i++) (*this).push(copying.arr[i]);
}
void Array::operator=(const Array& copying)
{
    length = 0;
    for (int i = 0; i < copying.length; i++) (*this).push(copying.arr[i]);
}
int Array::pop()
{
    if (length == 0) return -1;
    int* newArray = new int[--length];
    for (int i = 0; i < length; i++) newArray[i] = arr[i];
    int toReturn = arr[length];
    int* dummy = arr;
    arr = newArray;
    delete dummy;
    return toReturn;
}
int Array::shift()
{
    if (length == 0) return -1;
    int* newArray = new int[--length];
    for (int i = 1; i <= length; i++) newArray[i-1] = arr[i];
    int toReturn = arr[0];
    int* dummy = arr;
    arr = newArray;
    delete dummy;
    return toReturn;
}
int Array::operator[](int index)
{
    if (index > length - 1 || index < 0) return -1;
    else return arr[index];
}
int Array::getNthElement(int index)
{
    if (index > length - 1 || index < 0) return -1;
    else return arr[index];
}
void Array::reverse()
{
    int* newArray = new int[length];
    for (int i = 0; i < length; i++) newArray[i] = arr[length - 1 - i];
    int* dummy = arr;
    arr = newArray;
    delete dummy;
}
void Array::print()
{
    for (int i = 0; i < length; i++) printf("%d ", arr[i]);
}