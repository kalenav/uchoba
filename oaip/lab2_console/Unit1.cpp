//---------------------------------------------------------------------------

#include <vcl.h>
#include <conio.h>
#include <math.h>
#include <iostream.h>
#include <stdio.h>
#pragma hdrstop

//---------------------------------------------------------------------------

#pragma argsused
int main(int argc, char* argv[])
{       double x,y,z,n,m,k,f,max;
        int choice,ifabs;
        AnsiString fstr,xzstr;
        bool iffabs;
        cout << "z = ";
        cin >> z;
        cout << "n = ";
        cin >> n;
        cout << "m = ";
        cin >> m;
        cout << "k = ";
        cin >> k;
        if(z>1)
        {
                x = z;
                xzstr = "z";
        }
        else
        {
                x = pow(z,2) + 1;
                xzstr = "z^2 + 1";
        }
        cout << "Choose function: 0 - 2x; 1 - x^2; 2 - x/3" << endl;
        cin >> choice;
        switch(choice)
        {
                case 0:
                {
                        f = 2*x;
                        fstr = "2x";
                        break;
                }
                case 1:
                {
                        f = pow(x,2);
                        fstr = "x^2";
                        break;
                }
                case 2:
                {
                        f = x/3.;
                        fstr = "x/3";
                        break;
                }
        }
        y = sin(n*f) + cos(k*x) + log(m*x);
        cout << "Show maximum of: 0 - values, 1 - absolute values" << endl;
        cin >> ifabs;
        if(z > max) max = z;
        cout << "f(x) = " << fstr.c_str() << endl;
        cout << "x = " << xzstr.c_str() << " = " << x << endl;;
        cout << "y = " << y << endl;
        cout << "z = " << z << endl;
        if(ifabs)
        {
                x = fabs(x);
                y = fabs(y);
                z = fabs(z);
        }
        if(x > y) max = x;
        else max = y;
        if(z > max) max = z;
        cout << "Chosen maximum = " << max;
        getch();
        return 0;
}
//---------------------------------------------------------------------------
 