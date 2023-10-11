//---------------------------------------------------------------------------

#include <vcl.h>
#include <conio.h>
#include <math.h>
#pragma hdrstop

#include "Lab_1_window.h"
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
        double x,y,z,num,den;
        x = StrToFloat(Edit1->Text);
        y = StrToFloat(Edit2->Text);
        z = StrToFloat(Edit3->Text);
        num = pow((y + pow((x-1),1/3.)), 1/4.);
        den = fabs(x-y)*(sin(z)*sin(z) + tan(z));
        Memo1->Lines->Add(FloatToStr(num/den));
}
//---------------------------------------------------------------------------
 