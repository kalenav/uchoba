//---------------------------------------------------------------------------

#include <vcl.h>
#include <stdio.h>
#include <conio.h>
#include <iostream.h>
#pragma hdrstop

//---------------------------------------------------------------------------

#pragma argsused
int main(int argc, char* argv[])
{
        char str[999];
        puts("Input string");
        gets(str);
        AnsiString orstr = str;
        if(orstr == "")
        {
                puts("String not defined!");
                getch();
                return 0;
        }
        int k;
        puts("Input symbol index");
        cin >> k;
        if(k < 1 || k > orstr.Length())
        {
                puts("Index out of bounds!");
                getch();
                return 0;
        }
        if(k == orstr.Length() && orstr[k] == ' ')
        {
                orstr.Delete(k,1);
                puts(("str1 = " + orstr).c_str());
                puts("str2 is empty");
                getch();
                return 0;
        }
        while(k > 0 && orstr[k] != ' ')
        {
                k--;
        }
        if(k == 0)
        {
                puts("str1 is empty");
                puts(("str2 = " + orstr).c_str());
                getch();
                return 0;
        }
        AnsiString str1 = "";
        AnsiString str2 = "";
        for(int i = 1; i <= k; i++)
        {
                str1 += orstr[i];
        }
        for(int i = k+1; i <= orstr.Length(); i++)
        {
                str2 += orstr[i];
        }
        cout << ("str1 = " + str1).c_str();
        cout << ("str2 = " + str2).c_str();
        getch();
        return 0;
}
//---------------------------------------------------------------------------
