import pandas as pd
import random
import numpy
import math

def get_random_selection(inputs_dataset, outputs_dataset_column_name, fraction=0.5, only_belonging_to_class=False, belonging_factor_value=1):
    if fraction > 1: fraction = 1
    if fraction <= 0: return [[], []]

    inputs_dataset_copy = inputs_dataset.copy()
    result_inputs = pd.DataFrame()

    REQUIRED_ENTRIES = round(len(inputs_dataset[outputs_dataset_column_name]) * fraction)
    found_entries = 0
    while found_entries < REQUIRED_ENTRIES:
        index = random.randint(0, len(inputs_dataset_copy[outputs_dataset_column_name]) - 1)
        if only_belonging_to_class and (inputs_dataset[outputs_dataset_column_name][index] != belonging_factor_value):
            continue
        result_inputs = pd.concat([result_inputs, inputs_dataset_copy.iloc[index]], axis=1, ignore_index=True)
        found_entries += 1

    result_inputs = result_inputs.transpose()

    return test_selection_to_lists(result_inputs, outputs_dataset_column_name)

def test_selection_to_lists(inputs, outputs_dataset_column_name):
    input_matrix = []
    outputs = inputs[outputs_dataset_column_name].tolist()
    for index, row in inputs.drop(outputs_dataset_column_name, axis=1).iterrows():
        input_matrix.append(row.tolist())
    return {
        'inputs': input_matrix,
        'outputs': outputs
    }

def get_mu(inputs):
    sum = numpy.array([0] * len(inputs[0]))
    for x in inputs:
        sum = sum + numpy.array(x)
    return sum / len(inputs)

def get_sigma(inputs, mu):
    RESULT_MATRIX_DIMENSION = len(inputs[0])
    result_matrix = numpy.array([[0] * RESULT_MATRIX_DIMENSION] * RESULT_MATRIX_DIMENSION)
    for x in inputs:
        expression = numpy.subtract(x, mu)
        expression_transposed = numpy.atleast_2d(expression).transpose()
        product = numpy.outer(expression_transposed, expression)
        result_matrix = numpy.add(result_matrix, product)
    return (result_matrix / len(inputs)).round(3)


def get_probability(input, params):
    D = 1

    expression = input - params['mu']
    exp_arg_multiplier1 = numpy.matmul(expression, params['sigma_inverse'])
    exp_arg_multiplier2 = numpy.matmul(exp_arg_multiplier1, numpy.atleast_2d(expression).transpose())
    exp_arg = exp_arg_multiplier2 * (-1/2)
    probability_numerator = math.exp(exp_arg)

    probability_denominator = math.sqrt(pow(math.pi, D) * abs(params['sigma_determinant']))

    return probability_numerator / probability_denominator

def model_accuracy(params, training_selection, belonging_factor_value=1):
    CORRECT_PREDICTION_THRESHOLD = 0.5
    correctly_predicted = 0
    for index, input in enumerate(training_selection['inputs']):
        probability = get_probability(input, params)
        curr_output = training_selection['outputs'][index]
        correct_prediction_condition1 = probability > CORRECT_PREDICTION_THRESHOLD and curr_output == belonging_factor_value
        correct_prediction_condition2 = probability < CORRECT_PREDICTION_THRESHOLD and curr_output != belonging_factor_value
        if correct_prediction_condition1 or correct_prediction_condition2:
            correctly_predicted += 1
    return round(correctly_predicted / len(training_selection['outputs']), 3)


PATH = "E:/Important/uchoba/statoiv/lab1/recalls.csv"
dataset = pd.read_csv(PATH)
UNNECESSARY_COLUMNS = ['Recall Link', 'Recall Description']
dataset = dataset.drop(UNNECESSARY_COLUMNS, axis=1)

for column in dataset:
    if type(dataset[column][0]) is str:
        dataset[column] = pd.factorize(dataset[column])[0]

TESTED_TRAIT = 'Component'
TESTED_TRAIT_DESIRED_VALUE = 1

training_selection = get_random_selection(
    dataset,
    TESTED_TRAIT,
    fraction=0.2,
    only_belonging_to_class=True,
    belonging_factor_value=TESTED_TRAIT_DESIRED_VALUE
)
MU = get_mu(training_selection['inputs'])
SIGMA = get_sigma(training_selection['inputs'], MU)
try:
    MODEL_PARAMS = {
        'mu': MU,
        'sigma': SIGMA,
        'sigma_inverse': numpy.linalg.inv(SIGMA),
        'sigma_determinant': numpy.linalg.det(SIGMA)
    }
except:
    raise Exception('Sigma matrix determinant was 0, could not get inverse; consider increasing training selection size')


testing_selection = get_random_selection(
    dataset,
    TESTED_TRAIT,
    fraction=0.05,
    belonging_factor_value=TESTED_TRAIT_DESIRED_VALUE
)
print(model_accuracy(MODEL_PARAMS, testing_selection))
