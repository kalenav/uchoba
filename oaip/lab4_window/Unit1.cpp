//---------------------------------------------------------------------------

#include <vcl.h>
#include <math.h>
#include <conio.h>
#include <iostream.h>
#pragma hdrstop

#include "Unit1.h"
//---------------------------------------------------------------------------
#pragma package(smart_init)
#pragma resource "*.dfm"
TForm1 *Form1;
double S(double x, double up)
{
        double sum = 0;
        for(int k = 1; k <= up; k++)
        {
                double fact = 1;
                for(double next = 2; next <= 2*k; next++)
                {
                        fact *= next;
                }
                sum += pow(-1,k) * pow(2*x,2*k) / fact;
        }
        return sum;
}
        
double Y(double x)
{
        return 2*(cos(x)*cos(x) - 1);
}


double mod(double f1, double f2)
{
        return fabs(f1 - f2);
}

AnsiString out(double x,double up,int chosen)
{
        AnsiString out;
        switch(chosen)
        {
                case 0:
                {
                        out = FloatToStr(S(x,up));
                        break;
                }
                case 1:
                {
                        out = FloatToStr(Y(x));
                        break;
                }
                case 2:
                {
                        out = FloatToStr(mod(Y(x),S(x,up)));
                        break;
                }
        }
        return out;
}

//---------------------------------------------------------------------------
__fastcall TForm1::TForm1(TComponent* Owner)
        : TForm(Owner)
{
}
//---------------------------------------------------------------------------



void __fastcall TForm1::Button1Click(TObject *Sender)
{
        double a,b,h,x;
        int n;
        a = StrToFloat(Edit1->Text);
        b = StrToFloat(Edit2->Text);
        h = StrToFloat(Edit3->Text);
        n = StrToInt(Edit4->Text);
        for(x = a; x <= b; x += h)
        {
                Memo1->Lines->Add
                (
                        "For x = " + FloatToStr(x) + ", " +
                        RadioGroup1->Items->Strings[RadioGroup1->ItemIndex] +
                        " = " + out(x,n,RadioGroup1->ItemIndex)
                );
        }
}
//---------------------------------------------------------------------------
 