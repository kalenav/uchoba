//---------------------------------------------------------------------------
#include <stdio.h>
#include <conio.h>
#include <io.h>
#include <vcl.h>
#include <iostream.h>
#pragma hdrstop

struct Student
{
        char fio[50];
        int yofb;
        int group;
        int grades[4];
        double gradeav;
};

Student db[20];
int studcount = 0;
char ynchoice;
int choice;
FILE* fp;
char path[100];

//---------------------------------------------------------------------------

#pragma argsused

void addstud(Student stud)
{
        cout << "FIO: ";
        cin >> stud.fio;
        cout << "Year of birth: ";
        cin >> stud.yofb;
        cout << "Group: ";
        cin >> stud.group;
        fprintf(fp, "FIO: %s\n", stud.fio);
        fprintf(fp, "Year of birth: %d\n", stud.yofb);
        fprintf(fp, "Group: %d\n", stud.group);
        cout << "Grades (physics, maths, informatics, chemistry): ";
        char subjects[4][15] = {"Physics: ", "Maths: ", "Informatics: ", "Chemistry: "};
        int sum = 0;
        for(int i = 0; i < 4; i++)
        {
                cin >> stud.grades[i];
                sum += stud.grades[i];
                fprintf(fp, "%s%d\n", subjects[i], stud.grades[i]);
        }
        stud.gradeav = sum / 4.0;
        fprintf(fp, "Average: %lf", stud.gradeav);
        db[studcount++] = stud;
        printf("\n");
}

void scanfile()
{
        studcount = 0;
        while(!feof(fp))
        {
                Student temp;
                fscanf(fp, "FIO: %s", temp.fio);
                fscanf(fp, "\nYear of birth: %d", &(temp.yofb));
                fscanf(fp, "\nGroup: %d", &(temp.group));
                fscanf(fp, "\nPhysics: %d", &(temp.grades[0]));
                fscanf(fp, "\nMaths: %d", &(temp.grades[1]));
                fscanf(fp, "\nInformatics: %d", &(temp.grades[2]));
                fscanf(fp, "\nChemistry: %d", &(temp.grades[3]));
                fscanf(fp, "\nAverage: %lf", &(temp.gradeav));
                fscanf(fp, "\n");
                fscanf(fp, "_\n");
                db[studcount++] = temp;
        }
}

void rewritefile()
{
        for(int i = 0; i < studcount; i++)
        {
                fprintf(fp, "FIO: %s\n", db[i].fio);
                fprintf(fp, "Year of birth: %d\n", db[i].yofb);
                fprintf(fp, "Group: %d\n", db[i].group);
                fprintf(fp, "Physics: %d\n", db[i].grades[0]);
                fprintf(fp, "Maths: %d\n", db[i].grades[1]);
                fprintf(fp, "Informatics: %d\n", db[i].grades[2]);
                fprintf(fp, "Chemistry: %d\n", db[i].grades[3]);
                fprintf(fp, "Average: %lf", db[i].gradeav);
                if(i != studcount - 1) fprintf(fp, "\n_\n");
        }
        studcount = 0;
}

void createfile()
{
        cout << "Input file path: ";
        cin >> path;
        printf("\n");
        fp = fopen(path, "w");
        while(true)
        {
                Student newstud;
                addstud(newstud);
                cout << "Add another student? Y/N" << endl;
                cin >> ynchoice;
                printf("\n");
                if(ynchoice == 'N' || ynchoice == 'n') break;
                fprintf(fp, "\n_\n");
        }
        fclose(fp);
}

void viewfile()
{
        cout << "Input file path: ";
        cin >> path;
        printf("\n");
        fp = fopen(path, "r");
        if(filelength(fileno(fp)) == 0)
        {
                printf("%s\n\n", "File empty!");
                return;
        }
        printf("%s\n\n", "Student info:");
        char out;
        while(!feof(fp))
        {
                fread(&out, 1, 1, fp);
                if(out != '_') printf("%c", out);
        }
        printf("\n\n");
        fclose(fp);
}

void changestr(char* inp)
{
        cout << "Old: " << inp << endl;
        cout << "New: ";
        cin >> inp;
}

void changenum(int& inp)
{
        cout << "Old: " << inp << endl;
        cout << "New: ";
        cin >> inp;
}

void editfile()
{
        cout << "Input file path: ";
        cin >> path;
        printf("\n");
        beg:
        cout << "1 - Add new student(s), 2 - Change existing info, 3 - Go back" << endl;
        cin >> choice;
        printf("\n");
        switch(choice)
        {
                case 1:
                {
                        fp = fopen(path, "a");
                        fprintf(fp, "\n_\n");
                        while(true)
                        {
                                Student newstud;
                                addstud(newstud);
                                cout << "Add another student? Y/N" << endl;
                                cin >> ynchoice;
                                printf("\n");
                                if(ynchoice == 'N' || ynchoice == 'n') break;
                                fprintf(fp, "\n_\n");
                        }
                        fclose(fp);
                        goto beg;
                }
                case 2:
                {
                        studcount = 0;
                        fp = fopen(path, "r");
                        scanfile();
                        more:
                        cout << "Input student number to change the info" << endl << endl;
                        for(int i = 0; i < studcount; i++)
                        {
                                cout << i+1 << ". " << db[i].fio << endl;
                        }
                        printf("\n");
                        int studch;
                        cin >> studch;
                        cout << "What do you wish to change?" << endl << endl;
                        cout
                        << "1. FIO" << endl
                        << "2. Year of birth" << endl
                        << "3. Group" << endl
                        << "4. Physics grade" << endl
                        << "5. Maths grade" << endl
                        << "6. Informatics grade" << endl
                        << "7. Chemistry grade" << endl;
                        cin >> choice;
                        printf("\n");
                        switch(choice)
                        {
                                case 1:
                                {
                                        changestr(db[studch-1].fio);
                                        break;
                                }
                                case 2:
                                {
                                        changenum(db[studch-1].yofb);
                                        break;
                                }
                                case 3:
                                {
                                        changenum(db[studch-1].group);
                                        break;
                                }
                                case 4:
                                {
                                        changenum(db[studch-1].grades[0]);
                                        break;
                                }
                                case 5:
                                {
                                        changenum(db[studch-1].grades[1]);
                                        break;
                                }
                                case 6:
                                {
                                        changenum(db[studch-1].grades[2]);
                                        break;
                                }
                                case 7:
                                {
                                        changenum(db[studch-1].grades[3]);
                                        break;
                                }
                        }
                        int sum = 0;
                        for(int i = 0; i < 4; i++)
                        {
                                sum += db[studch-1].grades[i];
                        }
                        db[studch-1].gradeav = sum / 4.0;
                        cout << endl << "Do you want to change anything else? Y/N" << endl;
                        cin >> ynchoice;
                        if(ynchoice == 'Y' || ynchoice == 'y') goto more;
                        fp = fopen(path, "w");
                        rewritefile();
                        fclose(fp);
                        break;
                }
                case 3: break;
        }
}

void printstudinfo(Student stud)
{
        printf("FIO: %s\n", stud.fio);
        printf("Year of birth: %d\n", stud.yofb);
        printf("Group: %d\n", stud.group);
        printf("Physics: %d\n", stud.grades[0]);
        printf("Maths: %d\n", stud.grades[1]);
        printf("Informatics: %d\n", stud.grades[2]);
        printf("Chemistry: %d\n", stud.grades[3]);
        printf("Average: %lf\n\n", stud.gradeav);
}

void individual()
{
        cout << "Input file path: ";
        cin >> path;
        cout << endl;
        fp = fopen(path, "r");
        scanfile();
        int group;
        cout << "Input group number" << endl;
        cin >> group;
        printf("\n");
        double sum = 0;
        double studnum = 0;
        for(int i = 0; i < studcount; i++)
        {
                if(db[i].group == group)
                {
                        sum += db[i].gradeav;
                        studnum++;
                }
        }
        double ovav = sum / studnum;
        printf("%s%lf\n\n", "Overall average grade: ", ovav);
        for(int i = 0; i < studcount; i++)
        {
                if(db[i].gradeav > ovav && db[i].group == group) printstudinfo(db[i]);
        }
}

int main(int argc, char* argv[])
{
        while(true)
        {
                cout << "Choose action:" << endl;
                cout << "1. Create file" << endl;
                cout << "2. View file" << endl;
                cout << "3. Edit file" << endl;
                cout << "4. Individual task" << endl;
                cout << "5. End program" << endl;
                cin >> choice;
                printf("\n");
                switch(choice)
                {
                        case 1:
                        {
                                createfile();
                                break;
                        }
                        case 2:
                        {
                                viewfile();
                                break;
                        }
                        case 3:
                        {
                                editfile();
                                break;
                        }
                        case 4:
                        {
                                individual();
                                break;
                        }
                        case 5: return 0;
                }
        }
}
//---------------------------------------------------------------------------
