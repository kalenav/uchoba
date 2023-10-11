//---------------------------------------------------------------------------

#include <vcl.h>
#include <math.h>
#include <conio.h>
#include <iostream.h>
#pragma hdrstop

//---------------------------------------------------------------------------

#pragma argsused
int main(int argc, char* argv[])
{
        double a,b,x,y,z,f;
        int choice;
        AnsiString xzmsg,fmsg;
        cout << "Input a" << endl;
        cin >> a;
        cout << "Input b" << endl;
        cin >> b;
        cout << "Input z" << endl;
        cin >> z;
        if(z < 0)
        {
                x = z;
                xzmsg = "z";
        }
        else
        {
                x = sin(z);
                xzmsg = "sin(z)";
        }
        cout << "Choose f: 1 - 2x, 2 - x^2, 3 - x/3" << endl;
        cin >> choice;
        switch(choice)
        {
                case 1:
                        f = 2*x;
                        fmsg = "2x";
                        break;
                case 2:
                        f = pow(x,2);
                        fmsg = "x^2";
                        break;
                case 3:
                        f = x/3;
                        fmsg = "x/3";
                        break;
        }
        y = 2./3 * a * pow(sin(x),2) - 3 * b / 4 * pow(cos(f),2);
        cout << "result: " << y << ", x = " << xzmsg.c_str() << ", f(x) = " << fmsg.c_str();
        getch();
        return 0;
}
//---------------------------------------------------------------------------
