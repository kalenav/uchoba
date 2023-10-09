//---------------------------------------------------------------------------

#include <vcl.h>
#include <conio.h>
#include <iostream.h>
#pragma hdrstop

//---------------------------------------------------------------------------

#pragma argsused
int main(int argc, char* argv[])
{
        cout << "Razmeri matrici (n, m): ";
        int n, m;
        cin >> n;
        cin >> m;
        int** a = new int* [n];
        for(int i = 0; i < n; i++) a[i] = new int [m];
        cout << "Zapolnite massiv strokami" << endl;
        for(int i = 0; i < n; i++)
                for(int j = 0; j < m; j++) cin >> a[i][j];
        int qt;
        for(int j = 0; j < m; j++)
                for(int i = 0; i < n; i++)
                {
                        int s = 0;
                        int el = a[i][j];
                        for(int ind = 0; ind < n; ind++)
                        {
                                if(ind != i) s += a[ind][j];
                        }
                        if(el > s) qt++;
                }
        cout << "Kolvo osobih = " << qt;
        getch();
        return 0;
}
//---------------------------------------------------------------------------
 