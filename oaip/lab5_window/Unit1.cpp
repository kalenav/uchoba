//---------------------------------------------------------------------------

#include <vcl.h>
#include <math.h>
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
        Edit1->Text = "4";
}
//---------------------------------------------------------------------------

void __fastcall TForm1::Button1Click(TObject *Sender)
{
        for(int i = 0; i <= 49; i++)
        {
                StringGrid1->Cells[i][0] = "";
                StringGrid2->Cells[i][0] = "";
        }
        int n = StrToInt(Edit1->Text);
        StringGrid1->DefaultColWidth = StringGrid1->Width / n;
        StringGrid1->ColCount = n;
        int a[50];
        int fneg = -1;
        bool found = false;
        for(int i = 0; i <= n-1; i++)
        {
                a[i] = random(18)-9;
                if(!found && a[i]<0)
                {
                        fneg = i;
                        found = true;
                }
                StringGrid1->Cells[i][0] = IntToStr(a[i]);
        }
        if(fneg == -1)
        {
                Label2->Caption = "No negative elements found!";
                return;
        }
        if(fneg == n-1)
        {
                Label2->Caption = "No elements after the first negative one!";
                return;
        }
        int sum = 0;
        for(int i = fneg+1; i <= n-1; i++)
        {
                sum += fabs(a[i]);
        }
        Label2->Caption = "The sum is " + (IntToStr(sum));
        StringGrid2->DefaultColWidth = StringGrid2->Width / (n-fneg-1);
        StringGrid2->ColCount = n-fneg-1;
        int b[100];
        for(int i = 0; i <= n-fneg-1; i++)
        {
                b[i] = a[i+fneg+1];
                StringGrid2->Cells[i][0] = IntToStr(b[i]);
        }
        return;

}
//---------------------------------------------------------------------------
 