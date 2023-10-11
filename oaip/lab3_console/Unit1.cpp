//---------------------------------------------------------------------------

#include <vcl.h>
#include <math.h>
#include <iostream.h>
#include <conio.h>
#pragma hdrstop

//---------------------------------------------------------------------------

#pragma argsused
int main(int argc, char* argv[])
{
        double a,b,n,h,k,x,z;
        cout << "a = ";
        cin >> a;
        cout << "b = ";
        cin >> b;
        cout << "n = ";
        cin >> n;
        cout << "h = ";
        cin >> h;
        for(x = a; x <= b; x += h)
        {
                double S = 0;
                for(k = 1; k <= n; k++)
                {
                        double fact = 1;
                        for(double next = 1; next <= 2*k; next++)
                        {
                                fact *= next;
                        }
                        S += (pow(-1,k) * pow(2*x,2*k) / fact);
                }
                double y = 2 * (cos(x) * cos(x) - 1);
                double mod = fabs(y - S);
                cout << "For x = " << x <<
                        ", S(x) = " << S <<
                        ", Y(x) = " << y <<
                        ", |Y(x) - S(x)| = " << mod << endl;
        }
        getch();
        return 0;
}
//---------------------------------------------------------------------------
 