#include "pch.h"
#include "CppUnitTest.h"
#include "../lab4header.h"

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

namespace lab4tests
{
	TEST_CLASS(lab4tests)
	{
	public:
		TEST_METHOD(singleInputNegatorsQuantity1)
		{
			Assert::AreEqual(requiredSingleInputNegators("(!x1 + x2) * (!x2 + x4)"), 2);
		}
		TEST_METHOD(singleInputNegatorsQuantity2)
		{
			Assert::AreEqual(requiredSingleInputNegators("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)"), 5);
		}
		TEST_METHOD(singleInputNegatorsQuantity3)
		{
			Assert::AreEqual(requiredSingleInputNegators("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)"), 4);
		}
		TEST_METHOD(singleInputNegatorsQuantity4)
		{
			Assert::AreEqual(requiredSingleInputNegators("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)"), 4);
		}
		TEST_METHOD(NInputDisjunctorsQuantity1)
		{
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 2), 2);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 3), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 4), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 5), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 6), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 7), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 8), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 9), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 10), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 11), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 12), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 13), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 14), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 15), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x2) * (!x2 + x4)", 16), 0);
		}
		TEST_METHOD(NInputDisjunctorsQuantity2)
		{
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 2), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 3), 1);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 4), 1);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 5), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 6), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 7), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 8), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 9), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 10), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 11), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 12), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 13), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 14), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 15), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 16), 0);
		}
		TEST_METHOD(NInputDisjunctorsQuantity3)
		{
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 2), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 3), 1);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 4), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 5), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 6), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 7), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 8), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 9), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 10), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 11), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 12), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 13), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 14), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 15), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 16), 0);
		}
		TEST_METHOD(NInputDisjunctorsQuantity4)
		{
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 2), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 3), 1);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 4), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 5), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 6), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 7), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 8), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 9), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 10), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 11), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 12), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 13), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 14), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 15), 0);
			Assert::AreEqual(requiredNInputDisjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 16), 0);
		}
		TEST_METHOD(NInputConjunctorsQuantity1)
		{
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 2), 1);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 3), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 4), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 5), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 6), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 7), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 8), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 9), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 10), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 11), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 12), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 13), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 14), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 15), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x2) * (!x2 + x4)", 16), 0);
		}
		TEST_METHOD(NInputConjunctorsQuantity2)
		{
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 2), 1);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 3), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 4), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 5), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 6), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 7), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 8), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 9), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 10), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 11), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 12), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 13), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 14), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 15), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 + x3 + x5) * (!x2 + !x3 + !x4 + !x5)", 16), 0);
		}
		TEST_METHOD(NInputConjunctorsQuantity3)
		{
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 2), 2);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 3), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 4), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 5), 1);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 6), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 7), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 8), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 9), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 10), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 11), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 12), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 13), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 14), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 15), 0);
			Assert::AreEqual(requiredNInputConjunctors("(!x1 * x2) + (!x2 * x4) + (x3 * x4 * !x5 * !x6 * x9)", 16), 0);
		}
		TEST_METHOD(NInputConjunctorsQuantity4)
		{
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 2), 1);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 3), 1);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 4), 0);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 5), 0);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 6), 0);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 7), 1);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 8), 0);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 9), 0);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 10), 0);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 11), 0);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 12), 0);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 13), 0);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 14), 0);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 15), 0);
			Assert::AreEqual(requiredNInputConjunctors("(x1 * x2 * x3 * x4 * x5 * x6 * x7) + (!x1 * !x2) + (!x3 * !x5 * x6)", 16), 0);
		}
	};
}
