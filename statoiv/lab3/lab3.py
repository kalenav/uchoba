import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans

PATH = "E:/Important/uchoba_rep/uchoba/statoiv/lab3/wine-clustering.csv"
DATASET_SIZE = 5000
dataset = pd.read_csv(PATH)
UNNECESSARY_COLUMNS = []
dataset = dataset.drop(UNNECESSARY_COLUMNS, axis=1)

# inertia = []
# for i in range(1, 11):
#     k_means = KMeans(n_clusters=i, init= 'k-means++')
#     k_means.fit(dataset)
#     inertia.append(k_means.inertia_)

# sns.set_style('darkgrid')
# sns.scatterplot(
#     x=[x for x in range(1, 11)],
#     y=inertia,
# )
# plt.title('График зависимости')
# plt.xlabel('Количество кластеров')
# plt.ylabel('Внутрикластерная сумма расстояний')
# plt.show()

CLUSTERS = 4
model = KMeans(n_clusters=CLUSTERS)
model.fit(dataset)
clusters = pd.DataFrame(
    columns=dataset.columns,
    data=model.cluster_centers_
)
clusters["Amount"] = np.unique(
    model.labels_,
    return_counts=True
)[1]
print(clusters)