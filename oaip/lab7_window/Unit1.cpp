//---------------------------------------------------------------------------

#include <vcl.h>
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
        Edit1->Text = "hello1 hello2 hello3 hello4 hello5";
        Edit2->Text = "20";
}
//---------------------------------------------------------------------------

void __fastcall TForm1::Edit1KeyPress(TObject *Sender, char &Key)
{
        if(Key == 13)
        {
                ListBox1->Items->Add(Edit1->Text);
        }
}
//---------------------------------------------------------------------------
void __fastcall TForm1::Button1Click(TObject *Sender)
{
        if(ListBox1->ItemIndex == -1)
        {
                Label2->Caption = "String not selected!";
                Label3->Caption = "";
                return;
        }
        int k = StrToInt(Edit2->Text);
        AnsiString toconv = ListBox1->Items->Strings[ListBox1->ItemIndex];
        char orstr[99];
        strcpy(orstr, toconv.c_str());
        if(k > strlen(orstr)-1 || k < 0)
        {
                Label2->Caption = "Index out of bounds!";
                Label3->Caption = "";
                return;
        }
        if(k == strlen(orstr)-1 && orstr[k] == ' ')
        {
                Label2->Caption = orstr;
                Label3->Caption = "str2 is empty";
                return;
        }
        while(k >= 0 && orstr[k] != ' ')
        {
                k--;
        }
        if(k == -1)
        {
                Label2->Caption = "str1 is empty";
                Label3->Caption = orstr;
                return;
        }
        AnsiString str1;
        for(int i = 0; i < k; i++)
        {
                str1 += orstr[i];
        }
        Label2->Caption = str1;
        AnsiString str2;
        for(int i = k+1; i < strlen(orstr); i++)
        {
                str2 += orstr[i];
        }
        Label3->Caption = str2;
        return;
}
//---------------------------------------------------------------------------

