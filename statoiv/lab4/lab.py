import sklearn
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn import tree
from sklearn.model_selection import train_test_split

PATH = "recalls.csv"
CLASS_COLUMN = "Component"
ENTRIES_QTY = 100
dataset = pd.read_csv(PATH).head(ENTRIES_QTY)
dataset.drop(
    [
        "NHTSA ID",
        "Recall Link",
        "Recall Description",
        "Consequence Summary",
        "Corrective Action",
        "Report Received Date",
        "Subject",
        "Potentially Affected",
        "Mfr Campaign Number"
    ],
    axis=1,
    inplace=True,
)

dataset = dataset.dropna()

for column in dataset:
    dataset[column] = pd.factorize(dataset[column])[0]

train_input, test_input, train_output, test_output = train_test_split(
    dataset.drop(CLASS_COLUMN, axis=1),
    dataset[CLASS_COLUMN],
    test_size=0.2
)

model = tree.DecisionTreeClassifier()
model.fit(train_input, train_output)
predictions = model.predict(test_input)
plt.figure(figsize=(100, 100))
tree.plot_tree(model, fontsize=4)
plt.title("Дерево решений")
plt.show()