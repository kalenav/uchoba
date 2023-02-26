#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>
#include <sys/wait.h>
#include <sys/time.h>

int main ()
{
    timeval tp;
    gettimeofday(&tp, 0);

    pid_t pid1 = fork();
    if (pid1 > 0)       // main process works
    {
        wait(NULL);
        time_t curtime = tp.tv_sec;
        tm *t = localtime(&curtime);
        printf("%02d:%02d:%02d:%03d\n", t->tm_hour, t->tm_min, t->tm_sec, tp.tv_usec/1000);
        printf("main parent %d\n", getpid());

        pid_t pid2 = fork();
        if (pid2 > 0)   // main process works
        {
            wait(NULL);
            system("ps -x");
        }
        else if (pid2 == 0)     // second child works
        {
            time_t curtime = tp.tv_sec;
            tm *t = localtime(&curtime);
            printf("%02d:%02d:%02d:%03d\n", t->tm_hour, t->tm_min, t->tm_sec, tp.tv_usec/1000);
            printf("2nd child %d and its parent %d\n", getpid(), getppid());
        }

    }
    else if (pid1 == 0)         // first child works
    {
        time_t curtime = tp.tv_sec;
        tm *t = localtime(&curtime);
        printf("%02d:%02d:%02d:%03d\n", t->tm_hour, t->tm_min, t->tm_sec, tp.tv_usec/1000);
        printf("1st child %d and its parent %d\n", getpid(), getppid());
    }

    exit(0);
}


