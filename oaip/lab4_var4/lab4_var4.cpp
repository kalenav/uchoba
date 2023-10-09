//---------------------------------------------------------------------------

#include <vcl.h>
#include <math.h>
#include <stdio.h>
#include <iostream.h>
#include <conio.h>
#pragma hdrstop

//---------------------------------------------------------------------------

#pragma argsused
double s(double x, int n)
{
        double sum = 0;
        for(int k = 0; k <= n; k++)
        {
                double fact = 1;
                for(int i = 1; i <= 2*k; i++) fact *= i;
                sum += pow(-1, k) * pow(x, 2*k) / fact;
        }
        return sum;
}

double y(double x)
{
        return cos(x);
}

double mod(double f1, double f2)
{
        return fabs(f1-f2);
}

void out(double x, int n, int choice)
{
        cout << "For x = " << x << ", ";
        switch(choice)
        {
                case 0:
                {
                        cout << "S(x) = " << s(x, n);
                        break;
                }
                case 1:
                {
                        cout << "Y(x) = " << y(x);
                        break;
                }
                case 2:
                {
                        cout << "|Y(x)-S(x)| = " << mod(s(x, n), y(x));
                        break;
                }
        }
        cout << endl;
}

int main(int argc, char* argv[])
{
        double a, b, h, n;
        cout << "Vvedite a,b,h,n" << endl;
        cin >> a;
        cin >> b;
        cin >> h;
        cin >> n;
        cout << "Viberite funciyu: 0 - S(x), 1 - Y(x), 2 - |Y(x)-S(x)|" << endl;
        int choice;
        cin >> choice;
        for(double x = a; x <= b; x += h)
        {
                out(x, n, choice);
        }
        getch();
        return 0;
}
//---------------------------------------------------------------------------
 