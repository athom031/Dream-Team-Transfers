
import csv
import pandas as pd
# project defined imports
from constants.csv_names import CSV, READ

def get_df_from_csv(csv_path):
    # open supported csv file using csv.reader
    with open(csv_path, READ) as file:
        reader = csv.reader(file)

        # create a list from csv reader
        csv_list = list(reader)

        # save header information
        header = csv_list[0]

        # create data frame from list
        df = pd.DataFrame(csv_list[1:], columns=header)

    return df
