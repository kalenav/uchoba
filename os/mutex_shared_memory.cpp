#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>

#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <mutex>
#include <sys/mman.h>
using namespace std;

mutex main_mutex;

void read_txt(string file, string& txt_data)
{
    ifstream read_file(file, ios::in);

    if (!read_file.is_open())
    {
        exit(EXIT_FAILURE);
    }
    else
    {
        stringstream buffer;
        buffer << read_file.rdbuf();

        txt_data = buffer.str();
        cout << "\nfile was read\n";
    }

    read_file.close();
}

void write_txt(string file, string& txt_data)
{
    ofstream write_file = ofstream(file);
    if (!write_file)
    {
        exit(EXIT_FAILURE);
    }
    write_file << txt_data;
    write_file.close();
    cout << "\nfile was written\n";
}


void read_file_mutex(string file, string& txt_data)
{
    main_mutex.lock();
    read_txt(file, txt_data);
    main_mutex.unlock();
}

void write_file_mutex(string file, string& txt_data)
{
    main_mutex.lock();
    write_txt(file, txt_data);
    main_mutex.unlock();
}

void* shared_memory(size_t size)
{
    int protection = PROT_READ | PROT_WRITE;
    int visibility = MAP_SHARED | MAP_ANONYMOUS;
    return mmap(NULL, size, protection, visibility, -1, 0);
}

int count_size(string file)
{
    int size = 0;
    char c;
    FILE *f = fopen(file.c_str(), "r");
    if (f == NULL)
    {
        size = 100;

    }
    else
    {
        fseek(f, 0L, SEEK_END);
        size = ftell(f);
    }
    return size;
}

void check(pid_t pid, int& status)
{
    if(wait(&status) < 0)
    {
        exit(EXIT_FAILURE);

    }
    if (!(WIFEXITED(status) && (WEXITSTATUS(status) == 0)))
    {
        fprintf( stderr,"\nChild failed. Killing all running children.\n");
        kill(pid, SIGKILL);
        exit(1);
    }
}



int main(int argc, char* argv[]) {
    if (argc != 3)
    {
        cout << "not enough parameters\nmust be [file] [file to read] [file to write]";
        return EXIT_FAILURE;
    }

//    string read_file = "/home/ad/021702/degtereva/3/v1/t1.txt";
//    string write_file = "/home/ad/021702/degtereva/3/v1/t1_1.txt";

    int status;

    char* read_file = argv[1];
    char* write_file = argv[2];

    string data;
    int size = count_size(read_file);
    size += 1;

    void* shared_mem = shared_memory(size);

    pid_t pid1 = fork();
    if (pid1 == 0)
    {
        char* write_data_c = new char[size];
        read_file_mutex(read_file, data);
        strcpy(write_data_c, data.c_str());
        memcpy(shared_mem, data.c_str(), size);
        exit(0);
    }
    else if (pid1 > 0)
    {
        check(pid1, status);
        pid_t pid2 = fork();
        if (pid2 == 0)
        {
            char write_data[size];
            memcpy(write_data, shared_mem, size);
            string write_data_str(write_data);
            write_file_mutex(write_file, write_data_str);
        }
        else if (pid2 > 0)
        {
            check(pid2, status);;
        }
    }


}
