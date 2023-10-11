//---------------------------------------------------------------------------

#include <vcl.h>
#include <conio.h>
#include <iostream.h>
#pragma hdrstop

//---------------------------------------------------------------------------

#pragma argsused
int main(int argc, char* argv[])
{
        int n;
        cout << "n = ";
        cin >> n;
        while(n < 1)
        {
                cout << "Please enter a correct number!" << endl;
                cin >> n;
                cout << endl;
        }
        if(n == 1)
        {
                int elem;
                cout << "Input element: ";
                cin >> elem;
                cout << endl << "The maximum element is " << elem;
                getch();
                return 0;
        }
        int** a;
        a = new int* [n];
        cout << "Input massives (separate items with spaces, press enter in the end of each massive)" << endl;
        for(int i = 0; i < n; i++)
        {
                a[i] = new int [n];
                for(int j = 0; j < n; j++)
                {
                        cin >> a[i][j];
                        cout << " ";
                }
        }
        bool set = false;
        int max;
        for(int i = 0; i < n; i++)
        {
                for(int j = 0; j < n; j++)
                {
                        if(i + j + 2 > n + 1)
                        {
                                if(!set)
                                {
                                        max = a[i][j];
                                        set = true;
                                        continue;
                                }
                                if(a[i][j] > max) max = a[i][j];
                        }
                }
        }
        cout << "The maximum element is " << max;
        for(int i = 0; i < n; i++)
        {
                delete a[i];
        }
        delete a;
        getch();
        return 0;
}
//---------------------------------------------------------------------------
 