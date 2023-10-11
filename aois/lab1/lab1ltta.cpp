#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include "lab1ltta.h"

int main()
{
	BinaryNumber num1, num2;
	int choice;
	while (true)
	{
		printf("Choose action:\n\n1. Set numbers (0 by default)\n2. View numbers\n3. Convert numbers to direct code\n4. Convert numbers to complementary code\n5. Convert numbers to inverse code\n6. Add numbers\n7. Multiply numbers (the numbers will be converted to direct code)\n8. Divide numbers (the numbers will be converted to direct code)\n9. Run individual task\n10. Exit\n\n");
		scanf("%d", &choice);
		switch (choice)
		{
			case 1:
			{
				printf("\nInput numbers: ");
				int n1, n2;
				scanf("%d %d", &n1, &n2);
				num1.setNumber(n1, 0);
				num2.setNumber(n2, 0);
				printf("\n");
				break;
			}
			case 2:
			{
				printf("\n");
				num1.print();
				num2.print();
				break;
			}
			case 3:
			{
				num1.convertToDirect();
				num2.convertToDirect();
				printf("\nNumbers converted to direct code\n\n");
				break;
			}
			case 4:
			{
				num1.convertToComplementary();
				num2.convertToComplementary();
				printf("\nNumbers converted to complementary code\n\n");
				break;
			}
			case 5:
			{
				num1.convertToInverse();
				num2.convertToInverse();
				printf("\nNumbers converted to inverse code\n\n");
				break;
			}
			case 6:
			{
				printf("\n");
				BinaryNumber sum;
				sum.setNumber(add(num1.getNumber(), num2.getNumber()), 0);
				sum.print();
				break;
			}
			case 7:
			{
				printf("\n");
				BinaryNumber product;
				product.setNumber(multiply(num1.convertToDirect().getNumber(), num2.convertToDirect().getNumber()), 0);
				product.print();
				break;
			}
			case 8:
			{
				printf("\n");
				int** quotient = new int* [2];
				quotient = divide(num1.convertToDirect().getNumber(), num2.convertToDirect().getNumber());
				for (int i = 0; i < 32; i++) printf(" %d", quotient[0][i]);
				printf(" . ");
				for (int i = 0; i < 5; i++) printf("%d ", quotient[1][i]);
				printf("\n\n");
				break;
			}
			case 9:
			{
				num1.setNumber(13, 0);
				num2.setNumber(23, 0);
				BinaryNumber result;

				printf("________13 + 23 in direct binary code________\n\n");
				result.setNumber(add(num1.getNumber(), num2.getNumber()), 0);
				num1.print();
				num2.print();
				result.print();

				printf("\n\n________13 + 23 in complementary binary code________\n\n");
				num1.convertToComplementary();
				num2.convertToComplementary();
				result.setNumber(add(num1.getNumber(), num2.getNumber()), 0);
				num1.print();
				num2.print();
				result.print();

				printf("________-13 + 23 in complementary binary code________\n\n");
				num1.setNumber(-13, 1);
				result.setNumber(add(num1.getNumber(), num2.getNumber()), 0);
				num1.print();
				num2.print();
				result.print();

				printf("________13 - 23 in complementary binary code________\n\n");
				num1.setNumber(13, 0);
				num2.setNumber(-23, 1);
				result.setNumber(add(num1.getNumber(), num2.getNumber()), 1);
				result.convertToDirect();
				num1.print();
				num2.print();
				result.print();

				printf("________-13 - 23 in complementary binary code________\n\n");
				num1.setNumber(-13, 1);
				result.setNumber(add(num1.getNumber(), num2.getNumber()), 1);
				result.convertToDirect();
				num1.print();
				num2.print();
				result.print();

				BinaryNumber one(1);
				printf("\n\n________13 + 23 in inverse binary code________\n\n");
				num1.setNumber(13, 0);
				num2.setNumber(23, 0);
				result.setNumber(add(num1.getNumber(), num2.getNumber()), 0);
				num1.print();
				num2.print();
				result.print();

				printf("________-13 + 23 in inverse binary code________\n\n");
				num1.setNumber(-13, 2);
				result.setNumber(add(num1.getNumber(), num2.getNumber()), 0);
				result.setNumber(add(result.getNumber(), one.getNumber()), 0);
				num1.print();
				num2.print();
				result.print();

				printf("________13 - 23 in inverse binary code________\n\n");
				num1.setNumber(13, 0);
				num2.setNumber(-23, 2);
				result.setNumber(add(num1.getNumber(), num2.getNumber()), 2);
				result.convertToDirect();
				num1.print();
				num2.print();
				result.print();

				printf("________-13 - 23 in inverse binary code________\n\n");
				num1.setNumber(-13, 2);
				result.setNumber(add(num1.getNumber(), num2.getNumber()), 2);
				result.setNumber(add(result.getNumber(), one.getNumber()), 2);
				result.convertToDirect();
				num1.print();
				num2.print();
				result.print();

				printf("\n\n________13 * 23 in direct binary code________\n\n");
				num1.setNumber(13, 0);
				num2.setNumber(23, 0);
				result.setNumber(multiply(num1.getNumber(), num2.getNumber()), 0);
				num1.print();
				num2.print();
				result.print();

				printf("________-13 * 23 in direct binary code________\n\n");
				num1.setNumber(-13, 0);
				result.setNumber(multiply(num1.getNumber(), num2.getNumber()), 0);
				num1.print();
				num2.print();
				result.print();

				printf("________13 * -23 in direct binary code________\n\n");
				num1.setNumber(13, 0);
				num2.setNumber(-23, 0);
				result.setNumber(multiply(num1.getNumber(), num2.getNumber()), 0);
				num1.print();
				num2.print();
				result.print();

				printf("________-13 * -23 in direct binary code________\n\n");
				num1.setNumber(-13, 0);
				result.setNumber(multiply(num1.getNumber(), num2.getNumber()), 0);
				num1.print();
				num2.print();
				result.print();

				int** quotient = new int* [2];
				printf("\n\n________13 / 23 in direct binary code________\n\n");
				num1.setNumber(13, 0);
				num2.setNumber(23, 0);
				num1.print();
				num2.print();
				quotient = divide(num1.getNumber(), num2.getNumber());
				for (int i = 0; i < 32; i++) printf(" %d", quotient[0][i]);
				printf(" . ");
				for (int i = 0; i < 5; i++) printf("%d ", quotient[1][i]);
				printf("\n\n");

				printf("________-13 / 23 in direct binary code________\n\n");
				num1.setNumber(-13, 0);
				num1.print();
				num2.print();
				quotient = divide(num1.getNumber(), num2.getNumber());
				for (int i = 0; i < 32; i++) printf(" %d", quotient[0][i]);
				printf(" . ");
				for (int i = 0; i < 5; i++) printf("%d ", quotient[1][i]);
				printf("\n\n");

				printf("________13 / -23 in direct binary code________\n\n");
				num1.setNumber(13, 0);
				num2.setNumber(-23, 0);
				num1.print();
				num2.print();
				quotient = divide(num1.getNumber(), num2.getNumber());
				for (int i = 0; i < 32; i++) printf(" %d", quotient[0][i]);
				printf(" . ");
				for (int i = 0; i < 5; i++) printf("%d ", quotient[1][i]);
				printf("\n\n");

				printf("________-13 / -23 in direct binary code________\n\n");
				num1.setNumber(-13, 0);
				num1.print();
				num2.print();
				quotient = divide(num1.getNumber(), num2.getNumber());
				for (int i = 0; i < 32; i++) printf(" %d", quotient[0][i]);
				printf(" . ");
				for (int i = 0; i < 5; i++) printf("%d ", quotient[1][i]);
				printf("\n\n");

				printf("\n\n________13 + 23 in floating point binary form________\n\n");
				int* thirteen = new int[32];
				thirteen[0] = 0;

				thirteen[1] = 0;
				thirteen[2] = 0;
				thirteen[3] = 0;
				thirteen[4] = 0;
				thirteen[5] = 0;
				thirteen[6] = 1;
				thirteen[7] = 0;
				thirteen[8] = 0;

				for (int i = 9; i < 28; i++) thirteen[i] = 0;
				thirteen[28] = 1;
				thirteen[29] = 1;
				thirteen[30] = 0;
				thirteen[31] = 1;

				int* twentythree = new int[32];
				twentythree[0] = 0;

				twentythree[1] = 0;
				twentythree[2] = 0;
				twentythree[3] = 0;
				twentythree[4] = 0;
				twentythree[5] = 0;
				twentythree[6] = 1;
				twentythree[7] = 0;
				twentythree[8] = 1;

				for (int i = 9; i < 27; i++) twentythree[i] = 0;
				twentythree[27] = 1;
				twentythree[28] = 0;
				twentythree[29] = 1;
				twentythree[30] = 1;
				twentythree[31] = 1;

				printFloatingPoint(thirteen);
				printFloatingPoint(twentythree);
				printFloatingPoint(addFloatingPoint(thirteen, twentythree));
				break;
			}
			case 10:
			{
				return 0;
				break;
			}
		}
	}
}