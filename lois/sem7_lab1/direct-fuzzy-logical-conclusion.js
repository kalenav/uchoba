/////////////////////////////////////////////////////////
// Лабораторная работа №1 по дисциплине "Логические основы интеллектуальных систем"
// Выполнена студентами группы 021702 БГУИР Локтевым Константином Алексеевичем, Мохаммади Арианой, Макаревич Кариной Сергеевной
// Файл с описанием функции, выполняющей прямой нечеткий логический вывод на основании посылки и предиката
// 01.11.2023

function directFuzzyLogicalConclusion(premise, predicate) {
    const conclusion = new FuzzySet();

    // conclusionElement - это сущность
    for (const conclusionElement of predicate.image) {
        let maxFuzzyValueForCurrConclusionElement = 0;

        // premiseElement - это пара "сущность-значение"
        for (const premiseElement of premise) {
            // predicateElement - это пара "пара сущностей-значение"
            for (const predicateElement of predicate) {
                if (predicateElement[0][0] === premiseElement[0] && predicateElement[0][1] === conclusionElement) {
                    maxFuzzyValueForCurrConclusionElement = Math.max(
                        maxFuzzyValueForCurrConclusionElement,
                        FuzzyOperations.tNorm(premiseElement[1], predicateElement[1]).value
                    );
                }
            }
        }

        conclusion.add(conclusionElement, maxFuzzyValueForCurrConclusionElement);
    }

    return conclusion;
}