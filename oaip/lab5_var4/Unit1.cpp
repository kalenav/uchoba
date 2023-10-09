//---------------------------------------------------------------------------

#include <vcl.h>
#include <iostream.h>
#include <conio.h>
#pragma hdrstop

//---------------------------------------------------------------------------

#pragma argsused
int main(int argc, char* argv[])
{
        int a[100];
        cout << "Vvedite razmer massiva" << endl;
        int n;
        cin >> n;
        cout << "Zapolnite massiv: 0 - ot ruki, 1 - sluchaino" << endl;
        int choice;
        cin >> choice;
        if(choice)
        {
                for(int i = 0; i < n; i++)
                {
                        a[i] = random(19) - 9;
                        cout << "a[" << i << "] = " << a[i] << endl;
                }
        }
        else
        {
                for(int i = 0; i < n; i++)
                {
                        cout << "a[" << i << "] = ";
                        cin >> a[i];
                }
        }
        int posnum = 0;
        for(int i = 0; i < n; i++)
                if(a[i] > 0) posnum++;
        if(posnum < 2)
        {
                cout << "V massive menshe 2 polozhitelnyh elementov!" << endl;
                getch();
                return 0;
        }
        int posfirst;
        for(int i = 0; i < n; i++)
                if(a[i] > 0)
                {
                        posfirst = i;
                        break;
                }
        int poslast;
        for(int i = n-1; i >= 0; i--)
                if(a[i] > 0)
                {
                        poslast = i;
                        break;
                }
        if(posfirst + 1 == poslast)
        {
                cout << "Elementi stoyat ryadom!";
                getch();
                return 0;
        }
        int s = 0;
        for(int i = posfirst + 1; i <= poslast - 1; i++) s += a[i];
        cout << "Summa = " << s;
        getch();
        return 0;
}
//---------------------------------------------------------------------------
 