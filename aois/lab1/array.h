class Array
{
private:
    int* arr = new int;
public:
    int length = 0;
    Array& push(int arg);
    Array& unshift(int arg);
    Array();
    Array(const Array& copying);
    void operator=(const Array& copying);
    int pop();
    int shift();
    int operator[](int index);
    int getNthElement(int index);
    void reverse();
    void print();
};