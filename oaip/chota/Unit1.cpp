//---------------------------------------------------------------------------

#include <vcl.h>
#include <iostream>
#include <conio.h>
#pragma hdrstop

using std::cout;
using std::endl;

//---------------------------------------------------------------------------

const int n = 5;

#pragma argsused
int main(int argc, char* argv[])
{
        int a[n][n];
        a[0][0] = 1;
        bool right = true;
        bool left = false;
        bool up = false;
        bool down = false;
        int num = 2;
        int i = 0;
        int j = 0;
        while(num < n*n)
        {
                if(right)
                {
                        for(j++; j < n; j++)
                        {
                                if(a[i][j]) break;
                                a[i][j] = num++;
                        }
                        right = false;
                        down = true;
                        continue;
                }
                if(left)
                {
                        for(j--; j > 0; j--)
                        {
                                if(a[i][j]) break;
                                a[i][j] = num++;
                        }
                        left = false;
                        up = true;
                        continue;
                }
                if(up)
                {
                        for(i--; i > 0; i--)
                        {
                                if(a[i][j]) break;
                                a[i][j] = num++;
                        }
                        up = false;
                        right = true;
                        continue;
                }
                if(down)
                {
                        for(i++; i < n; i++)
                        {
                                if(a[i][j]) break;
                                a[i][j] = num++;
                        }
                        down = false;
                        left = true;
                        continue;
                }
        }
        for(int i = 0; i < n; i++)
        {
                for(int j = 0; j < n; j++)
                {
                        cout << a[i][j] << " ";
                }
                cout << endl;
        }
        return 0;
}
//---------------------------------------------------------------------------
 