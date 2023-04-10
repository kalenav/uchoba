import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import math
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

def nanToZeroMapper(arg):
    return 0 if math.isnan(arg) else arg

PATH = "E:/Important/uchoba_rep/uchoba/statoiv/lab2/weatherHistory.csv"
DATASET_SIZE = 5000
dataset = pd.read_csv(PATH)
# dataset = dataset.head(DATASET_SIZE)
UNNECESSARY_COLUMNS = [
    'Formatted Date',
    'Summary',
    'Precip Type',
    'Temperature (C)',
    'Apparent Temperature (C)',
    'Wind Speed (km/h)',
    'Wind Bearing (degrees)',
    'Loud Cover',
    'Pressure (millibars)',
    'Daily Summary'
]
FIRST_REGRESSION_COLUMN = 'Humidity'
SECOND_REGRESSION_COLUMN = 'Visibility (km)'
dataset = dataset.drop(UNNECESSARY_COLUMNS, axis=1)
dataset[FIRST_REGRESSION_COLUMN] = dataset[FIRST_REGRESSION_COLUMN].map(lambda x: x * 100)

x = np.array(dataset[FIRST_REGRESSION_COLUMN]).reshape(-1, 1)
y = np.array(dataset[SECOND_REGRESSION_COLUMN]).reshape(-1, 1)
DEGREES = 6
regression = make_pipeline(PolynomialFeatures(DEGREES), LinearRegression())
regression.fit(x, y)
predictions = regression.predict(x)
mean_squared_error = np.mean((predictions - np.array(y)) ** 2)

coefs = list(np.append(
    regression['linearregression'].intercept_[0],
    regression['linearregression'].coef_[0][1:]
))

START_ROUNDING_COEFS_FROM = 2
equation = ''
for index, coef in enumerate(coefs):
    curr_decimal_places_in_coef = START_ROUNDING_COEFS_FROM
    rounded_coef = round(coef, curr_decimal_places_in_coef)
    while(round(coef, curr_decimal_places_in_coef) == 0):
        curr_decimal_places_in_coef += 1
        rounded_coef = round(coef, curr_decimal_places_in_coef)

    if index == 0:
        equation += f'{rounded_coef} '
        continue
    positive = rounded_coef >= 0
    rounded_coef = abs(rounded_coef)
    power = '' if index == 1 else f'^{index}'
    equation += f"{'+' if positive else '-'} {rounded_coef}x{power} " 

print(f'Уравнение регрессии: {equation}')
print(f'Среднеквадратическая ошибка: {mean_squared_error}')

sns.lineplot(
    x=dataset[FIRST_REGRESSION_COLUMN],
    y=dataset[SECOND_REGRESSION_COLUMN],
    linestyle="solid"
)
sns.lineplot(
    x=dataset[FIRST_REGRESSION_COLUMN],
    y=predictions.reshape(-1),
    linestyle="dotted"
)
plt.title(
    'График зависимости\n\n'
    'Сплошная линия - эталонные значения\n'
    'Точечная линия - предсказания регрессии'
)
plt.xlabel('Влажность, %')
plt.ylabel('Видимость, км')
plt.show()