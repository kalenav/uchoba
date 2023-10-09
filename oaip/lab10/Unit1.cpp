//---------------------------------------------------------------------------
#include <stdio.h>
#include <conio.h>
#include <io.h>
#include <vcl.h>
#include <iostream.h>
#pragma hdrstop

struct Trip
{
        int dateday;
        int datemonth;
        int dateyear;
        int destination;
        int timeminutes;
        int timehours;
        int freeseats;
};

Trip* db = new Trip[20];
int tripcount = 0;
char ynchoice;
int choice;
FILE* fp;
char path[100];

//---------------------------------------------------------------------------

#pragma argsused

void addtrip(Trip trip)
{
        cout << "Date of departure (DD/MM/YYYY): ";
        scanf("%d/%d/%d", &(trip.dateday), &(trip.datemonth), &(trip.dateyear));
        cout << "Time of departure: ";
        scanf("%d:%d", &(trip.timehours), &(trip.timeminutes));
        cout << "Destination city: ";
        cin >> trip.destination;
        cout << "Free seats: ";
        cin >> trip.freeseats;
        db[tripcount++] = trip;
        fprintf(fp, "Date of departure (DD/MM/YYYY): %d/%d/%d\n", trip.dateday, trip.datemonth, trip.dateyear);
        if(trip.timeminutes % 10 > 0) fprintf(fp, "Time of departure: %d:%d\n", trip.timehours, trip.timeminutes);
        else fprintf(fp, "Time of departure: %d:0%d\n", trip.timehours, trip.timeminutes % 10);
        fprintf(fp, "Destination city: %d\n", trip.destination);
        fprintf(fp, "Free seats: %d", trip.freeseats);
        printf("\n");
}

void printtripinfo(Trip trip)
{
        printf("Date of departure (DD/MM/YYYY): %d/%d/%d", trip.dateday, trip.datemonth, trip.dateyear);
        if(trip.timeminutes / 10 == 0) printf("\nTime of departure: %d:0%d", trip.timehours, trip.timeminutes % 10);
        else printf("\nTime of departure: %d:%d", trip.timehours, trip.timeminutes);
        printf("\nDestinaton: %d", trip.destination);
        printf("\nFree seats: %d", trip.freeseats);
}

void scanfile()
{
        tripcount = 0;
        while(!feof(fp))
        {
                Trip temp;
                fscanf(fp, "Date of departure (DD/MM/YYYY): %d/%d/%d\n", &(temp.dateday), &(temp.datemonth), &(temp.dateyear));
                fscanf(fp, "Time of departure: %d:%d\n", &(temp.timehours), &(temp.timeminutes));
                fscanf(fp, "Destination city: %d\n", &(temp.destination));
                fscanf(fp, "Free seats: %d", &(temp.freeseats));
                fscanf(fp, "\n_\n");
                db[tripcount++] = temp;
        }
}

void rewritefile()
{
        for(int i = 0; i < tripcount; i++)
        {
                fprintf(fp, "Date of departure (DD/MM/YYYY): %d/%d/%d\n", db[i].dateday, db[i].datemonth, db[i].dateyear);
                if(db[i].timeminutes / 10 != 0) fprintf(fp, "Time of departure: %d:%d\n", db[i].timehours, db[i].timeminutes);
                else fprintf(fp, "Time of departure: %d:0%d\n", db[i].timehours, db[i].timeminutes);
                fprintf(fp, "Destination city: %d\n", db[i].destination);
                fprintf(fp, "Free seats: %d", db[i].freeseats);
                if(i != tripcount - 1) fprintf(fp, "\n_\n");
        }
        tripcount = 0;
}

void createfile()
{
        cout << "Input file path: ";
        cin >> path;
        printf("\n");
        fp = fopen(path, "w");
        while(true)
        {
                Trip newtrip;
                addtrip(newtrip);
                cout << "Add another trip? Y/N" << endl;
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
        printf("%s\n\n", "Trip info:");
        char out;
        fread(&out, 1, 1, fp);
        while(!feof(fp))
        {
                if(out != '_') printf("%c", out);
                fread(&out, 1, 1, fp);
        }
        printf("\n\n");
        fclose(fp);
}

void editfile()
{
        cout << "Input file path: ";
        cin >> path;
        printf("\n");
        beg:
        cout << "1 - Add new trip(s), 2 - Change existing info, 3 - Go back" << endl;
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
                                Trip newtrip;
                                addtrip(newtrip);
                                cout << "Add another trip? Y/N" << endl;
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
                        tripcount = 0;
                        fp = fopen(path, "r");
                        scanfile();
                        more:
                        cout << "Input trip number to change the info" << endl << endl;
                        for(int i = 0; i < tripcount; i++)
                        {
                                printf("%d. ", i+1);
                                printtripinfo(db[i]);
                                printf("\n\n");
                        }
                        int tripch;
                        cin >> tripch;
                        printf("\nWhat do you wish to change?\n\n");
                        cout
                        << "1. Date of departure" << endl
                        << "2. Time of departure" << endl
                        << "3. Destination" << endl
                        << "4. Free seats" << endl;
                        cin >> choice;
                        printf("\n");
                        switch(choice)
                        {
                                case 1:
                                {
                                        printf("Old: %d/%d/%d\nNew (DD/MM/YYYY): ", db[tripch-1].dateday, db[tripch-1].datemonth, db[tripch-1].dateyear);
                                        scanf("%d/%d/%d", &(db[tripch-1].dateday), &(db[tripch-1].datemonth), &(db[tripch-1].dateyear));
                                        break;
                                }
                                case 2:
                                {
                                        if(db[tripch-1].timeminutes / 10 == 0) printf("Old: %d:0%d\nNew: ", db[tripch-1].timehours, db[tripch-1].timeminutes);
                                        else printf("Old: %d:%d\nNew: ", db[tripch-1].timehours, db[tripch-1].timeminutes);
                                        scanf("%d:%d", &(db[tripch-1].timehours), &(db[tripch-1].timeminutes));
                                        break;
                                }
                                case 3:
                                {
                                        printf("Old: %d\nNew: ", db[tripch-1].destination);
                                        scanf("%d", &(db[tripch-1].destination));
                                        break;
                                }
                                case 4:
                                {
                                        printf("Old: %d\nNew: ", db[tripch-1].freeseats);
                                        scanf("%d", &(db[tripch-1].freeseats));
                                        break;
                                }
                        }
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

void quicksort(Trip* dbase, int tripnum)
{
        if(tripnum <= 1) return;
        int i = 0;
        int j = tripnum - 1;
        int mid = dbase[(tripnum - 1) / 2].freeseats;
        while(i < j)
        {
                while(dbase[i].freeseats < mid) i++;
                while(dbase[j].freeseats > mid) j--;
                if(i < j)
                {
                        Trip temp = dbase[i];
                        dbase[i] = dbase[j];
                        dbase[j] = temp;
                        i++;
                        j--;
                }
        }
        j = tripnum - 1;
        while(dbase[j].freeseats >= mid && j > 0) j--;
        j++;
        quicksort(dbase, j);
        quicksort(dbase + j, tripnum - j);
        return;
}

void sortfile()
{
        cout << "Input file path: ";
        cin >> path;
        cout << endl;
        fp = fopen(path, "r");
        scanfile();
        cout << "1 - use direct choice algorithm, 2 - use QuickSort" << endl;
        cin >> choice;
        switch(choice)
        {
                case 1:
                {
                        int k;
                        Trip temp;
                        for(int i = 0; i < tripcount - 1; i++)
                        {
                                k = i;
                                for(int j = i + 1; j < tripcount; j++)
                                {
                                        if(db[j].freeseats < db[k].freeseats) k = j;
                                }
                                temp = db[k];
                                db[k] = db[i];
                                db[i] = temp;
                        }
                        break;
                }
                case 2:
                {
                        quicksort(db, tripcount);
                        break;
                }
        }
        fp = fopen(path, "w");
        rewritefile();
        fclose(fp);
        printf("File sorted.\n\n");
}

void filesearchlinear()
{
        printf("Input file path: ");
        cin >> path;
        fp = fopen(path, "r");
        scanfile();
        int lookfor;
        printf("How many free seats to look for? ");
        scanf("%d", &lookfor);
        int matchcount = 0;
        for(int i = 0; i < tripcount; i++)
        {
                if(db[i].freeseats == lookfor)
                {
                        printf("\n");
                        printtripinfo(db[i]);
                        printf("\n");
                        matchcount++;
                }
        }
        printf("\n\nFound %d ", matchcount);
        if(matchcount == 0) printf("matches. Sorry about that.");
        if(matchcount == 1) printf("match.");
        if(matchcount > 1) printf("matches.");
        printf("\n\n");
        return;
}

void filesearchbinary()
{
        cout << "Input file path: ";
        cin >> path;
        fp = fopen(path, "r");
        scanfile();
        int lookfor;
        printf("How many seats to look for? ");
        scanf("%d", &lookfor);
        printf("\n");
        int matchcount = 0;
        int lowerbound = 0;
        int upperbound = tripcount - 1;
        int mid;
        while(lowerbound <= upperbound)
        {
                mid = (lowerbound + upperbound) / 2;
                if(db[mid].freeseats == lookfor)
                {
                        printtripinfo(db[mid]);
                        matchcount = 1;
                        break;
                }
                if(db[mid].freeseats < lookfor) lowerbound = mid + 1;
                else upperbound = mid;
        }
        if(matchcount == 0) printf("Found 0 matches. Sorry about that.");
        printf("\n\n");
        return;
}

void individual()
{
        printf("Input file path: ");
        cin >> path;
        cout << endl;
        fp = fopen(path, "r");
        scanfile();
        int tickets;
        int dest;
        int dayoweek;
        int hoursupperbound;
        printf("Number of tickets to book: ");
        cin >> tickets;
        printf("Destination city: ");
        cin >> dest;
        printf("Desired day of the month: ");
        cin >> dayoweek;
        printf("Departure not later than (hours): ");
        cin >> hoursupperbound;
        for(int i = 0; i < tripcount; i++)
        {
                if(db[i].freeseats >= tickets && db[i].destination == dest && db[i].dateday == dayoweek && (db[i].timehours < hoursupperbound || (db[i].timehours == hoursupperbound && db[i].timeminutes == 0)))
                {
                        printf("\nGot a match. Departure at %d:", db[i].timehours);
                        if(db[i].timeminutes / 10 == 0) printf("0%d\n\n", db[i].timeminutes);
                        else printf("%d\n\n", db[i].timeminutes);
                        return;
                }
        }
        printf("\nNo such trips found.\n\n");
        return;
}

int main(int argc, char* argv[])
{
        while(true)
        {
                cout << "Choose action:" << endl;
                cout << "1. Create file" << endl;
                cout << "2. View file" << endl;
                cout << "3. Edit file" << endl;
                cout << "4. Sort file" << endl;
                cout << "5. Linear search" << endl;
                cout << "6. Binary search" << endl;
                cout << "7. Individual task" << endl;
                cout << "8. End program" << endl;
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
                                sortfile();
                                break;
                        }
                        case 5:
                        {
                                filesearchlinear();
                                break;
                        }
                        case 6:
                        {
                                filesearchbinary();
                                break;
                        }
                        case 7:
                        {
                                individual();
                                break;
                        }
                        case 8: return 0;
                }
        }
}
//---------------------------------------------------------------------------
