
import csv
import os
import pandas as pd
# project defined imports
from transfermarkt_scraper.constants.csv_names import CSV, READ

def get_df_from_csv(supported_field):

    # get the absolute path of the current script
    script_path = os.path.abspath(__file__)

    # get the directory containing the script
    script_dir = os.path.dirname(script_path)

    # construct relative path to supported csv files
    supported_path = os.path.join(script_dir, '..', supported_field, supported_field + CSV)

    # open supported csv file using csv.reader
    with open(supported_path, READ) as file:
        reader = csv.reader(file)

        # create a list from csv reader
        csv_list = list(reader)

        # save header information
        header = csv_list[0]

        # create data frame from list
        df = pd.DataFrame(csv_list[1:], columns=header)

    return df
