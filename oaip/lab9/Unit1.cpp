//---------------------------------------------------------------------------

#include <vcl.h>
#include <iostream.h>
#include <conio.h>
#pragma hdrstop

//---------------------------------------------------------------------------

#pragma argsused

int nonrec(int x, int n)
{
        int y = 1;
        while(n-- > 0) y *= x;
        return y;
}

int rec(int x, int n)
{
        if(n == 0) return 1;
        return(x * rec(x, n-1));
}

int main(int argc, char* argv[])
{
        int x, n;
        cout << "Input x, n: ";
        cin >> x >> n;
        printf("\nNon-recursive function returned %d", nonrec(x, n));
        printf("\nRecursive function returned %d", rec(x, n));
        getch();
        return 0;
}
//---------------------------------------------------------------------------
