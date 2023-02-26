#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <iostream>
#include <fstream>
#include <sstream>
#include <sys/wait.h>
#include <sys/mman.h>
#include <cstring>
using namespace std;

void* shared_memory(size_t size) {
    int protection = PROT_READ | PROT_WRITE;
    int visibility = MAP_SHARED | MAP_ANONYMOUS;
    return mmap(NULL, size, protection, visibility, -1, 0);
}

int get_file_size(char* filename) {
    int size = 0;
    FILE* file = fopen(filename, "r");
    if (file == NULL) {
        exit(EXIT_FAILURE);
    }
    fseek(file, 0L, SEEK_END);
    return ftell(file);
}

bool child_processes_working(pid_t pid1, pid_t pid2) {
    int status1, status2;
    waitpid(pid1, &status1, WNOHANG);
    waitpid(pid2, &status2, WNOHANG);
    if (!WIFEXITED(status1) || !WIFEXITED(status2)) return true; // one or both children working
    if ((WIFEXITED(status1) && WEXITSTATUS(status1) != 0) || (WIFEXITED(status2) && WEXITSTATUS(status2) != 0)) {
        cout << "One of the children failed. Killing all children.\n";
        kill(pid1, SIGKILL);
        kill(pid2, SIGKILL);
        return false;
    }
    if ((WIFEXITED(status1) && WEXITSTATUS(status1) == 0) || (WIFEXITED(status2) && WEXITSTATUS(status2) == 0)) {
        cout << "Both children finished successfully!\n";
        return false;
    }
    return false; // чтобы компилятор не плакал
}

void read_txt(string filename, string& txt_data) {
    ifstream read_file(filename, ios::in);

    if (!read_file.is_open()) {
        exit(EXIT_FAILURE);
    }
    stringstream buffer;
    buffer << read_file.rdbuf();
    txt_data = buffer.str();
    read_file.close();
}

void write_txt(string filename, string& txt_data) {
    ofstream write_file = ofstream(filename);
    if (!write_file) {
        exit(EXIT_FAILURE);
    }
    write_file << txt_data;
    write_file.close();
}

int main(int argc, char* argv[]) {
    if (argc != 3) {
        cout << "not enough parameters\nmust be [file to read] [file to write]\n";
        return EXIT_FAILURE;
    }

    const int file_size = get_file_size(argv[1]) + 1;
    void* shared_mem_string_data = shared_memory(file_size);
    void* shared_mem_critical_section_taken = shared_memory(1);
    const char critical_section_taken[2] = "1";
    const char critical_section_free[2] = "0";

    pid_t pid1 = fork();
    if (pid1 == 0) { // inside read process
        memcpy(shared_mem_critical_section_taken, critical_section_taken, 1);
        cout << "Read process created! Reading file..." << endl;
        string to_copy;
        read_txt(argv[1], to_copy);
        memcpy(shared_mem_string_data, to_copy.c_str(), file_size);

        sleep(1);
        memcpy(shared_mem_critical_section_taken, critical_section_free, 1);
        cout << "Read process finished!" << endl;
        exit(0);
    }
    else if (pid1 > 0) { // inside parent process
        pid_t pid2 = fork();
        if(pid2 == 0) { // inside write process
            cout << "Write process created! Waiting for read process to finish..." << endl;
            bool readProcessActive = true;
            while (readProcessActive) {
                char criticalSectionTakenChar[1];
                memcpy(criticalSectionTakenChar, shared_mem_critical_section_taken, 1);
                readProcessActive = (criticalSectionTakenChar[0] == '0') ? false : true;
            }
            cout << "Read process finished, commencing write process..." << endl;
            char to_write[file_size];
            memcpy(to_write, shared_mem_string_data, file_size);
            string to_write_str(to_write);
            write_txt(argv[2], to_write_str);
            cout << "Write process finished!" << endl;
            exit(0);
        }
        else if (pid2 > 0) { // inside parent process
            while (child_processes_working(pid1, pid2));
            exit(0);
        }
    }
}

