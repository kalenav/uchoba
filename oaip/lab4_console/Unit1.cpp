//---------------------------------------------------------------------------

#include <vcl.h>
#include <math.h>
#include <conio.h>
#include <iostream.h>
#pragma hdrstop

//---------------------------------------------------------------------------
double S(double x, double up)
{
        double sum = 0;
        for(int k = 1; k <= up; k++)
        {
                double fact = 1;
                for(double next = 2; next <= 2*k; next++)
                {
                        fact *= next;
                }
                sum += pow(-1,k) * pow(2*x,2*k) / fact;
        }
        return sum;
}

double Y(double x)
{
        return 2*(cos(x)*cos(x) - 1);
}

double moddif(double f1, double f2)
{
        return fabs(f1 - f2);
}

AnsiString out(double x,double up,int chosen)
{
        switch(chosen)
        {
                case 0:
                {
                        return "S(x) = " + FloatToStr(S(x,up));
                }
                case 1:
                {
                        return "Y(x) = " + FloatToStr(Y(x));
                }
                case 2:
                {
                        return "|Y(x) - S(x)| = " + FloatToStr(moddif(Y(x),S(x,up)));
                }
        }
}
#pragma argsused
int main(int argc, char* argv[])
{
        double a,b,h,n;
        cout << "a = ";
        cin >> a;
        cout << "b = ";
        cin >> b;
        cout << "h = ";
        cin >> h;
        cout << "n = ";
        cin >> n;
        double choice;
        cout << "Choose function: 0 - S(x); 1 - Y(x); 2 - |Y(x) - S(x)|" << endl;
        cin >> choice;
        for(double x = a; x <= b; x += h)
        {
                cout << "For x = " << x << ", " << out(x,n,choice).c_str() << endl;
        }
        getch();
        return 0;
}

//---------------------------------------------------------------------------
