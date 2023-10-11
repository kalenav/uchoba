//---------------------------------------------------------------------------

#include <vcl.h>
#include <math.h>
#include <conio.h>
#pragma hdrstop

#include "Unit1.h"
//---------------------------------------------------------------------------
#pragma package(smart_init)
#pragma resource "*.dfm"
TForm1 *Form1;
//---------------------------------------------------------------------------
__fastcall TForm1::TForm1(TComponent* Owner)
        : TForm(Owner)
{
}
//---------------------------------------------------------------------------

void __fastcall TForm1::Button1Click(TObject *Sender)
{
        double a,b,h,n,k,y,x,mod;
        a = StrToFloat(Edit1->Text);
        b = StrToFloat(Edit2->Text);
        h = StrToFloat(Edit3->Text);
        n = StrToFloat(Edit4->Text);
        for(x = a; x <= b; x += h)
        {

                double S = 0;
                for(k = 1; k <= n; k++)
                {
                        double fact = 1;
                        for(double next = 2; next <= 2*k; next++)
                        {
                                fact *= next;
                        }
                        S += pow(-1,k) * pow(2*x,2*k) / fact;
                }
                y = 2*(cos(x)*cos(x) - 1);
                mod = fabs(y - S);
                Memo1->Lines->Add
                (
                        "For x = " + FloatToStr(x) + ", S(x) = " + FloatToStr(S) +
                        ", Y(X) = " + FloatToStr(y) +
                        ", |Y(X) - S(X)| = " + FloatToStr(mod)
                );
        }

}
//---------------------------------------------------------------------------
 