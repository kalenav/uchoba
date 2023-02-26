#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>


int main()
{
    pid_t pid0_1 = fork();
    if (pid0_1 == 0)    //child process (1st) of 0th process works
    {
        printf("0th parent (%d) CREATES 1st child (%d)\n", getppid(), getpid());
        pid_t pid1_2 = fork();
        if (pid1_2 == 0)             //child process (2nd) of 1st process works
        {
            printf("1st parent (%d) CREATES 2nd child (%d)\n", getppid(), getpid());

            pid_t pid2_3 = fork();
            if (pid2_3 == 0)        //child process (3rd) of 2nd process works
            {
                printf("2nd parent (%d) CREATES 3rd process (%d)\n", getppid(), getpid());

                pid_t pid3_5 = fork();
                if (pid3_5 == 0)    //child process (5th) of 3rd process works
                {
                    printf("3rd parent (%d) CREATES 5th process (%d)\n", getppid(), getpid());
                    printf("3rd parent (%d) and 5th process (%d) ENDS\n", getppid(), getpid());
                }
                else if (pid3_5 > 0)    //parent process (3rd) works
                {
                    wait(NULL);
                    printf("2nd parent (%d) and 3rd process (%d) ENDS\n", getppid(), getpid());
                }

            }
            else if (pid2_3 > 0)    //parent process (2nd) works
            {
                wait(NULL);

                pid_t pid2_4 = fork();
                if(pid2_4 == 0)     //child process (4th) of 2nd process works
                {
                    printf("2nd parent (%d) CREATES 4th process (%d)\n", getppid(), getpid());
                    id_t pid4_6 = fork();
                    if (pid4_6 == 0)    //child process (6th) of 4th process works
                    {
                        printf("4th parent (%d) CREATES 6th process (%d)\n", getppid(), getpid());
                        pid_t pid6_7 = fork();
                        if (pid6_7 == 0)
                        {
                            printf("6th parent (%d) CREATES 7th process (%d)\n", getppid(), getpid());
                            printf("6th parent (%d) and 7th process (%d) ENDS\n", getppid(), getpid());
                        }
                        else
                        {
                            wait(NULL);
                            printf("4th parent (%d) and 6th process (%d) ENDS\n", getppid(), getpid());
                        }
                    }
                    else if (pid4_6 > 0)
                    {
                        wait(NULL);
                        printf("2nd parent (%d) and 4th process (%d) ENDS\n", getppid(), getpid());
                    }
                }
                else if (pid2_4 > 0)    //parent process (2nd) works
                {
                    wait(NULL);

                    execlp("ps", "ps", "-x", (char *) NULL);
                }
            }
        }
        else if (pid1_2 > 0)
        {
            wait(NULL);
            printf("0th parent (%d) and 1st child (%d) ENDS\n", getppid(), getpid());
        }
    }
    else if (pid0_1 > 0)    // 0th process works
    {
        wait(NULL);
    }
}
