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

PATH = "E:/Important/uchoba_rep/uchoba/statoiv/lab2/car details v4.csv"
DATASET_SIZE = 5000
dataset = pd.read_csv(PATH)
# dataset = dataset.head(DATASET_SIZE)
UNNECESSARY_COLUMNS = [
    'Make',
    'Model',
    'Year',
    'Fuel Type',
    'Transmission',
    'Location',
    'Color',
    'Owner',
    'Seller Type',
    'Engine',
    'Max Torque',
    'Drivetrain',
    'Length',
    'Width',
    'Height',
    'Seating Capacity',
    'Fuel Tank Capacity',
    'Kilometer'
]
FIRST_REGRESSION_COLUMN = 'Price'
SECOND_REGRESSION_COLUMN = 'Max Power'
dataset = dataset.drop(UNNECESSARY_COLUMNS, axis=1)
dataset[SECOND_REGRESSION_COLUMN] = dataset[SECOND_REGRESSION_COLUMN].map(lambda hp: float(str(hp).split('@')[0].split(' ')[0])).map(nanToZeroMapper)

# sns.set_style('darkgrid')
# sns.set_palette('Set2')
# sns.lineplot(
#     x=dataset[FIRST_REGRESSION_COLUMN],
#     y=dataset[SECOND_REGRESSION_COLUMN],
# )
# plt.title('График зависимости')
# plt.xlabel('Цена')
# plt.ylabel('Максимальная мощность (л.с.)')
# plt.show()

x = np.array(dataset[FIRST_REGRESSION_COLUMN]).reshape(-1, 1)
y = np.array(dataset[SECOND_REGRESSION_COLUMN]).reshape(-1, 1)
DEGREES = 3
regression = make_pipeline(PolynomialFeatures(DEGREES), LinearRegression())
regression.fit(x, y)
predictions = regression.predict(x)
mean_squared_error = np.mean((predictions - np.array(y)) ** 2)
print(f'Среднеквадратическая ошибка = {mean_squared_error}')