//---------------------------------------------------------------------------

#include <iostream.h>
#include <vcl.h>
#include <conio.h>
#pragma hdrstop

//---------------------------------------------------------------------------

#pragma argsused
int main(int argc, char* argv[])
{
        AnsiString str = "111001 100 1010 01 10 0 01 111111";
        AnsiString found;
        int num = 0;
        for(int i = 1; i <= str.Length()+1; i++)
        {
                if(i != str.Length()+1 && str[i] != ' ')
                {
                        found += str[i];
                        num++;
                }
                else
                {
                        if(num % 2 == 0)
                        {
                                cout << found.c_str() << endl;
                        }
                        num = 0;
                        found = "";
                }
        }
        getch();
        return 0;
}
//---------------------------------------------------------------------------
 