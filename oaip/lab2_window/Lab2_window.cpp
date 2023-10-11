//---------------------------------------------------------------------------

#include <vcl.h>
#include <math.h>
#include <conio.h>
#pragma hdrstop

#include "Lab2_window.h"
//---------------------------------------------------------------------------
#pragma package(smart_init)
#pragma resource "*.dfm"
TForm1 *Form1;

bool iffabs = false;
//---------------------------------------------------------------------------
__fastcall TForm1::TForm1(TComponent* Owner)
        : TForm(Owner)
{
}
//---------------------------------------------------------------------------
void __fastcall TForm1::CheckBox1Click(TObject *Sender)
{
        iffabs = true;
}
//---------------------------------------------------------------------------
void __fastcall TForm1::Button1Click(TObject *Sender)
{
        Memo1->Clear();

        if(Edit1->Text == "")
        {
                Memo1->Lines->Add("Please enter all the variables!");
                return;
        }
        double n,m,k,x,y,z,f,max;
        z = StrToFloat(Edit1->Text);
        n = StrToFloat(Edit2->Text);
        m = StrToFloat(Edit3->Text);
        k = StrToFloat(Edit4->Text);
        AnsiString fstr, xzstr;
        if(z>1)
        {
                x = z;
                xzstr = "z";
        }
        else
        {
                x = pow(z,2) + 1;
                xzstr = "z^2 + 1";
        }
        switch(RadioGroup1->ItemIndex) {
                case 0:
                {
                        f = 2*x;
                        fstr = "2x";
                        break;
                }
                case 1:
                {
                        f = pow(x,2);
                        fstr = "x^2";
                        break;
                }
                case 2:
                {
                        f = x/3.;
                        fstr = "x/3";
                        break;
                }
                default:
                {
                        Memo1->Lines->Add("Please select a function!");
                        return;
                }
        }
        y = sin(n*f)+cos(k*x)+log(m*x);
        Memo1->Lines->Add("f(x) = " + fstr);
        Memo1->Lines->Add("x = " + xzstr + " = " + FloatToStr(x));
        Memo1->Lines->Add("y = " + FloatToStr(y));
        if(iffabs)
        {
                x = fabs(x);
                y = fabs(y);
                z = fabs(z);
        }
        if(x > y) max = x;
        else max = y;
        if(z > max) max = z;
        Memo1->Lines->Add("Max = " + FloatToStr(max));

}
//---------------------------------------------------------------------------
