#include "pch.h"
#include "CppUnitTest.h"
#include "../lab2header.h"

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

namespace lab2tests
{
	TEST_CLASS(lab2tests)
	{
	public:
		TEST_METHOD(elInArr)
		{
			int* a = new int[3];
			a[0] = 1;
			a[1] = 5;
			a[2] = 3;
			Assert::IsTrue(elementInArr(a, 5, 3));
		}
		TEST_METHOD(decToBin1)
		{
			int* expected = new int[4];
			expected[0] = 0;
			expected[1] = 1;
			expected[2] = 0;
			expected[3] = 1;
			int* actual = new int[4];
			actual = decimalToBinary(5, 4);
			for(int i = 0; i < 4; i++) Assert::AreEqual(expected[i], actual[i]);
 		}
		TEST_METHOD(decToBin2)
		{
			int* expected = new int[9];
			expected[0] = 0;
			expected[1] = 0;
			expected[2] = 1;
			expected[3] = 0;
			expected[4] = 1;
			expected[5] = 1;
			expected[6] = 1;
			expected[7] = 1;
			expected[8] = 1;
			int* actual = new int[9];
			actual = decimalToBinary(95, 9);
			for (int i = 0; i < 9; i++) Assert::AreEqual(expected[i], actual[i]);
		}
		TEST_METHOD(allocTruthTableMem1)
		{
			int expected[4][8] = 
			{
				{ 0, 0, 0, 0, 1, 1, 1, 1 },
				{ 0, 0, 1, 1, 0, 0, 1, 1 },
				{ 0, 1, 0, 1, 0, 1, 0, 1 },
				{}
			};
			int** actual;
			allocMemoryAndFillTruthTableArguments(&actual, 3, 8);
			for (int i = 0; i < 3; i++) for (int j = 0; j < 8; j++) Assert::AreEqual(expected[i][j], actual[i][j]);
		}
		TEST_METHOD(allocTruthTableMem2)
		{
			int expected[6][32] =
			{
				{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 },
				{ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1 },
				{ 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1 },
				{ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 },
				{ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 },
				{  }
			};
			int** actual;
			allocMemoryAndFillTruthTableArguments(&actual, 5, 32);
			for (int i = 0; i < 5; i++) for (int j = 0; j < 32; j++) Assert::AreEqual(expected[i][j], actual[i][j]);
		}
		TEST_METHOD(numericToTruthTable1)
		{
			int expected[4][8] =
			{
				{ 0, 0, 0, 0, 1, 1, 1, 1 },
				{ 0, 0, 1, 1, 0, 0, 1, 1 },
				{ 0, 1, 0, 1, 0, 1, 0, 1 },
				{ 0, 0, 1, 0, 1, 1, 0, 0 }
			};
			int** actual;
			int* inputs = new int [3];
			inputs[0] = 2;
			inputs[1] = 4;
			inputs[2] = 5;
			actual = numericFormToTruthTable(inputs, 3);
			for (int i = 0; i < 4; i++) for (int j = 0; j < 8; j++) Assert::AreEqual(expected[i][j], actual[i][j]);
		}
		TEST_METHOD(numericToTruthTable2)
		{
			int expected[6][32] =
			{
				{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 },
				{ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1 },
				{ 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1 },
				{ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 },
				{ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 },
				{ 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0 }
			};
			int** actual;
			int* inputs = new int[13];
			inputs[0] = 0;
			inputs[1] = 4;
			inputs[2] = 5;
			inputs[3] = 7;
			inputs[4] = 8;
			inputs[5] = 9;
			inputs[6] = 15;
			inputs[7] = 17;
			inputs[8] = 18;
			inputs[9] = 23;
			inputs[10] = 26;
			inputs[11] = 27;
			inputs[12] = 28;
			actual = numericFormToTruthTable(inputs, 13);
			for (int i = 0; i < 6; i++) for (int j = 0; j < 32; j++) Assert::AreEqual(expected[i][j], actual[i][j]);
		}
		TEST_METHOD(indexToTruthTable1)
		{
			int expected[3][4] =
			{
				{ 0, 0, 1, 1 },
				{ 0, 1, 0, 1 },
				{ 1, 0, 0, 1 }
			};
			int** actual = indexFormToTruthTable(9);
			for (int i = 0; i < 3; i++) for (int j = 0; j < 4; j++) Assert::AreEqual(expected[i][j], actual[i][j]);
		}
		TEST_METHOD(indexToTruthTable2)
		{
			int expected[4][8] =
			{
				{ 0, 0, 0, 0, 1, 1, 1, 1 },
				{ 0, 0, 1, 1, 0, 0, 1, 1 },
				{ 0, 1, 0, 1, 0, 1, 0, 1 },
				{ 0, 0, 1, 0, 0, 1, 1, 0 }
			};
			int** actual = indexFormToTruthTable(38);
			for (int i = 0; i < 4; i++) for (int j = 0; j < 8; j++) Assert::AreEqual(expected[i][j], actual[i][j]);
		}
		TEST_METHOD(indexToTruthTable3)
		{
			int expected[6][32] =
			{
				{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 },
				{ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1 },
				{ 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1 },
				{ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 },
				{ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 },
				{ 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1 }
			};
			int** actual = indexFormToTruthTable(164454681);
			for (int i = 0; i < 6; i++) for (int j = 0; j < 32; j++) Assert::AreEqual(expected[i][j], actual[i][j]);
		}
		TEST_METHOD(arbitraryToTruthTable1)
		{
			int expected[4][8] =
			{
				{ 0, 0, 0, 0, 1, 1, 1, 1 },
				{ 0, 0, 1, 1, 0, 0, 1, 1 },
				{ 0, 1, 0, 1, 0, 1, 0, 1 },
				{ 0, 1, 0, 1, 0, 0, 1, 1 }
			};
			string input = "!((!x1||!x2)&&!(!x1&&x3))";
			int** actual = arbitraryToTruthTable(input);
			for (int i = 0; i < 4; i++) for (int j = 0; j < 8; j++) Assert::AreEqual(expected[i][j], actual[i][j]);
		}
		TEST_METHOD(arbitraryToTruthTable2)
		{
			int expected[4][8] =
			{
				{ 0, 0, 0, 0, 1, 1, 1, 1 },
				{ 0, 0, 1, 1, 0, 0, 1, 1 },
				{ 0, 1, 0, 1, 0, 1, 0, 1 },
				{ 1, 0, 1, 0, 1, 1, 0, 0 }
			};
			string input = "!((!x1||x2)&&!(!x1&&!x3))";
			int** actual = arbitraryToTruthTable(input);
			for (int i = 0; i < 4; i++) for (int j = 0; j < 8; j++) Assert::AreEqual(expected[i][j], actual[i][j]);
		}
		TEST_METHOD(arbitraryToTruthTable3)
		{
			int expected[4][8] =
			{
				{ 0, 0, 0, 0, 1, 1, 1, 1 },
				{ 0, 0, 1, 1, 0, 0, 1, 1 },
				{ 0, 1, 0, 1, 0, 1, 0, 1 },
				{ 1, 1, 0, 0, 0, 1, 0, 1 }
			};
			string input = "!((x1||x2)&&!(x1&&x3))";
			int** actual = arbitraryToTruthTable(input);
			for (int i = 0; i < 4; i++) for (int j = 0; j < 8; j++) Assert::AreEqual(expected[i][j], actual[i][j]);
		}
		TEST_METHOD(truthTableToFNF1)
		{
			fullNormalForms expected;
			expected.disjunctive = "(x1 * !x2) + (x1 * x2)";
			expected.conjunctive = "(x1 + x2) * (x1 + !x2)";
			int truthTableConst[3][4] =
			{
				{ 0, 0, 1, 1 },
				{ 0, 1, 0, 1 },
				{ 0, 0, 1, 1 }
			};
			int** truthTable = new int* [3];
			for (int i = 0; i < 3; i++)
			{
				truthTable[i] = new int[4];
				for (int j = 0; j < 4; j++) truthTable[i][j] = truthTableConst[i][j];
			}
			fullNormalForms actual = truthTableToFullNormalForms(truthTable, 2, 4);
			Assert::AreEqual(expected.disjunctive, actual.disjunctive);
			Assert::AreEqual(expected.conjunctive, actual.conjunctive);
		}
		TEST_METHOD(truthTableToFNF2)
		{
			fullNormalForms expected;
			expected.disjunctive = "(!x1 * !x2) + (!x1 * x2) + (x1 * !x2)";
			expected.conjunctive = "(!x1 + !x2)";
			int truthTableConst[3][4] =
			{
				{ 0, 0, 1, 1 },
				{ 0, 1, 0, 1 },
				{ 1, 1, 1, 0 }
			};
			int** truthTable = new int* [3];
			for (int i = 0; i < 3; i++)
			{
				truthTable[i] = new int[4];
				for (int j = 0; j < 4; j++) truthTable[i][j] = truthTableConst[i][j];
			}
			fullNormalForms actual = truthTableToFullNormalForms(truthTable, 2, 4);
			Assert::AreEqual(expected.disjunctive, actual.disjunctive);
			Assert::AreEqual(expected.conjunctive, actual.conjunctive);
		}
		TEST_METHOD(truthTableToFNF3)
		{
			fullNormalForms expected;
			expected.disjunctive = "(!x1 * !x2 * !x3) + (!x1 * !x2 * x3) + (!x1 * x2 * !x3) + (x1 * !x2 * !x3) + (x1 * !x2 * x3)";
			expected.conjunctive = "(x1 + !x2 + !x3) * (!x1 + !x2 + x3) * (!x1 + !x2 + !x3)";
			int truthTableConst[4][8] =
			{
				{ 0, 0, 0, 0, 1, 1, 1, 1 },
				{ 0, 0, 1, 1, 0, 0, 1, 1 },
				{ 0, 1, 0, 1, 0, 1, 0, 1 },
				{ 1, 1, 1, 0, 1, 1, 0, 0 }
			};
			int** truthTable = new int* [4];
			for (int i = 0; i < 4; i++)
			{
				truthTable[i] = new int[8];
				for (int j = 0; j < 8; j++) truthTable[i][j] = truthTableConst[i][j];
			}
			fullNormalForms actual = truthTableToFullNormalForms(truthTable, 3, 8);
			Assert::AreEqual(expected.disjunctive, actual.disjunctive);
			Assert::AreEqual(expected.conjunctive, actual.conjunctive);
		}
		TEST_METHOD(truthTableToFNF4)
		{
			fullNormalForms expected;
			expected.disjunctive = "(!x1 * !x2 * !x3 * !x4 * x5) + (!x1 * !x2 * !x3 * x4 * !x5) + (!x1 * !x2 * x3 * !x4 * !x5) + (!x1 * !x2 * x3 * x4 * x5) + (!x1 * x2 * !x3 * !x4 * !x5) + (!x1 * x2 * !x3 * !x4 * x5) + (!x1 * x2 * x3 * !x4 * x5) + (!x1 * x2 * x3 * x4 * x5) + (x1 * !x2 * !x3 * !x4 * x5) + (x1 * !x2 * x3 * !x4 * !x5) + (x1 * !x2 * x3 * !x4 * x5) + (x1 * !x2 * x3 * x4 * x5) + (x1 * x2 * !x3 * x4 * !x5) + (x1 * x2 * !x3 * x4 * x5)";
			expected.conjunctive = "(x1 + x2 + x3 + x4 + x5) * (x1 + x2 + x3 + !x4 + !x5) * (x1 + x2 + !x3 + x4 + !x5) * (x1 + x2 + !x3 + !x4 + x5) * (x1 + !x2 + x3 + !x4 + x5) * (x1 + !x2 + x3 + !x4 + !x5) * (x1 + !x2 + !x3 + x4 + x5) * (x1 + !x2 + !x3 + !x4 + x5) * (!x1 + x2 + x3 + x4 + x5) * (!x1 + x2 + x3 + !x4 + x5) * (!x1 + x2 + x3 + !x4 + !x5) * (!x1 + x2 + !x3 + !x4 + x5) * (!x1 + !x2 + x3 + x4 + x5) * (!x1 + !x2 + x3 + x4 + !x5) * (!x1 + !x2 + !x3 + x4 + x5) * (!x1 + !x2 + !x3 + x4 + !x5) * (!x1 + !x2 + !x3 + !x4 + x5) * (!x1 + !x2 + !x3 + !x4 + !x5)";
			int truthTableConst[6][32] =
			{
				{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 },
				{ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1 },
				{ 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1 },
				{ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 },
				{ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 },
				{ 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0 }
			};
			int** truthTable = new int* [6];
			for (int i = 0; i < 6; i++)
			{
				truthTable[i] = new int[32];
				for (int j = 0; j < 32; j++) truthTable[i][j] = truthTableConst[i][j];
			}
			fullNormalForms actual = truthTableToFullNormalForms(truthTable, 5, 32);
			Assert::AreEqual(expected.disjunctive, actual.disjunctive);
			Assert::AreEqual(expected.conjunctive, actual.conjunctive);
		}
		TEST_METHOD(truthTableToFNF5)
		{
			fullNormalForms expected;
			expected.disjunctive = "0";
			expected.conjunctive = "0";
			int** truthTable = new int* [2];
			truthTable[0] = new int[2];
			truthTable[1] = new int[2];
			truthTable[0][0] = 0;
			truthTable[0][1] = 1;
			truthTable[1][0] = 0;
			truthTable[1][1] = 0;
			fullNormalForms actual = truthTableToFullNormalForms(truthTable, 1, 2);
			Assert::AreEqual(expected.disjunctive, actual.disjunctive);
			Assert::AreEqual(expected.conjunctive, actual.conjunctive);
		}
		TEST_METHOD(truthTableToFNF6)
		{
			fullNormalForms expected;
			expected.disjunctive = "1";
			expected.conjunctive = "1";
			int truthTableConst[8][128]
			{
				{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 },
				{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 },
				{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 },
				{ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1 },
				{ 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1 },
				{ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 },
				{ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 },
				{ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 }
			};
			int** truthTable = new int* [8];
			for (int i = 0; i < 8; i++)
			{
				truthTable[i] = new int[128];
				for (int j = 0; j < 128; j++) truthTable[i][j] = truthTableConst[i][j];
			}
			fullNormalForms actual = truthTableToFullNormalForms(truthTable, 7, 128);
			Assert::AreEqual(expected.disjunctive, actual.disjunctive);
			Assert::AreEqual(expected.conjunctive, actual.conjunctive);
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness1)
		{
			string input = "";
			Assert::IsFalse(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness2)
		{
			string input = "hello there";
			Assert::IsFalse(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness3)
		{
			string input = "123";
			Assert::IsFalse(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness4)
		{
			string input = "x1";
			Assert::IsFalse(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness5)
		{
			string input = "x1x2x3";
			Assert::IsFalse(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness6)
		{
			string input = "x1x2&&x3";
			Assert::IsFalse(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness7)
		{
			string input = "x1||!x2";
			Assert::IsFalse(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness8)
		{
			string input = "x1!||x2&&x3";
			Assert::IsFalse(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness9)
		{
			string input = "!(x1&&x2)&&!(!(x3||x2)))";
			Assert::IsFalse(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness10)
		{
			string input = "!x1&&!x3&&x2!x3";
			Assert::IsFalse(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness11)
		{
			string input = "x1&&(x2||x3)";
			Assert::IsTrue(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness12)
		{
			string input = "x2||x3&&x1";
			Assert::IsTrue(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness13)
		{
			string input = "!x1&&(!x2&&x3)";
			Assert::IsTrue(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness14)
		{
			string input = "!(x1||x2&&(x2||x3))";
			Assert::IsTrue(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness15)
		{
			string input = "!(x1&&!(x2&&!(x3&&x1)))";
			Assert::IsTrue(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness16)
		{
			string input = "x1&&(!x2||(!x1&&!x3))||x2";
			Assert::IsTrue(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness17)
		{
			string input = "x1&&x2||x3&&x2||x3||x3||!x2&&x2&&!x1||(!x1&&x2)";
			Assert::IsTrue(isCorrectArbitraryThreeArgumentFunction(input));
		}
		TEST_METHOD(checkingArbitraryFunctionInputCorrectness18)
		{
			string input = "!(x1||x2&&x3&&(!x1||x2&&(x2||x3)))&&!x2";
			Assert::IsTrue(isCorrectArbitraryThreeArgumentFunction(input));
		}
	};
}
