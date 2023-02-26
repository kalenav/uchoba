#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <fstream>
#include <dirent.h>
#include <unistd.h>
#include <sys/wait.h>

int main(int argc, char* argv[]) {
    if(argc != 4) {
        printf("Please use the file this way: ./3.exe [first_directory_name] [second_directory_name] [max_concurrent_processes]");
        return EXIT_FAILURE;
    }

    const char* firstDirectory = argv[1];
    const char* secondDirectory = argv[2];

    DIR *dir1;
    struct dirent *dir1_file;
    if ((dir1 = opendir(firstDirectory)) == NULL) {
        printf("Error while opening the first directory; please make sure the name is correct\n");
        return EXIT_FAILURE;
    }
    DIR *dir2;
    struct dirent *dir2_file;
    if ((dir2 = opendir(secondDirectory)) == NULL) {
        printf("Error while opening the second directory; please make sure the name is correct\n");
        return EXIT_FAILURE;
    }

    bool child_process = false;
    int current_active_processes = 0;

    while (dir1_file = readdir(dir1)) {
        if(child_process) break;
        if (std::string(dir1_file->d_name).compare(".") == 0 || std::string(dir1_file->d_name).compare("..") == 0) {
            continue;
        }

        std::string path_to_file1 = std::string(firstDirectory) + "/" + std::string(dir1_file->d_name);

        std::ifstream f1(path_to_file1, std::ios::binary);
        f1.seekg(0, std::ios::end);
        const int bytes_in_first_file = f1.tellg();
        f1.seekg(0, std::ios::beg);
        if (bytes_in_first_file == -1) {
            std::cout << "Came across " << path_to_file1 << ", which is a directory, not a file; skipping\n";
            continue;
        }

        rewinddir((dir2));
        while (dir2_file = readdir(dir2)) {
            if (std::string(dir2_file->d_name).compare(".") == 0 ||
                std::string(dir2_file->d_name).compare("..") == 0) {
                continue;
            }

            std::string path_to_file2 = std::string(secondDirectory) + "/" + std::string(dir2_file->d_name);

            std::ifstream f2(path_to_file2, std::ios::binary);
            f2.seekg(0, std::ios::end);
            const int bytes_in_second_file = f2.tellg();
            f2.seekg(0, std::ios::beg);
            if (bytes_in_second_file == -1) {
                std::cout << "-------------------------------------\nCame across " << path_to_file2 << ", which is a directory, not a file; skipping\n";
                continue;
            }

            pid_t pid = fork();
            if (pid == 0) {
                child_process = true;
                bool different_file_sizes = false;
                bool discrepancy = false;
                int bytes_checked_before_discrepancy;

                if (bytes_in_first_file != bytes_in_second_file) {
                    different_file_sizes = true;
                } else {
                    char curr_f1_symbol;
                    char curr_f2_symbol;
                    int bytes_checked = 0;
                    while (!f1.eof()) {
                        curr_f1_symbol = f1.get();
                        curr_f2_symbol = f2.get();
                        if (curr_f1_symbol != curr_f2_symbol) {
                            discrepancy = true;
                            bytes_checked_before_discrepancy = bytes_checked;
                            break;
                        }
                        bytes_checked++;
                    }
                    f1.clear();
                    f1.seekg(0, std::ios::beg);
                }

                std::string to_print =
                        "-------------------------------------\nProcess PID: " + std::to_string(getpid()) +
                        "\nComparing " + path_to_file1 + " to " + path_to_file2 + "\n" +
                        "Bytes in first file: " + std::to_string(bytes_in_first_file) + "\n" +
                        "Bytes in second file: " + std::to_string(bytes_in_second_file) + "\n";
                if (different_file_sizes) {
                    to_print += "Different file sizes; skipping\n";
                } else if (discrepancy) {
                    to_print += "Detected discrepancy after checking " + std::to_string(bytes_checked_before_discrepancy) + " bytes; skipping\n";
                } else {
                    to_print += "File contents are identical\n";
                }
                std::cout << to_print;
                break;
            }
            else if (pid > 0) {
                current_active_processes++;
                if(current_active_processes > std::stoi(argv[3])) {
                    wait(0);
                }
            }
        }
    }

    closedir(dir1);
    closedir(dir2);
    exit(0);
}

