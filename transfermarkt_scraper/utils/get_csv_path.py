import os
# user defined imports
from constants.csv_names import CSV

def get_csv_path(dir, file):
    # get path to current script
    script_path = os.path.abspath(__file__)

    # get directory for utils/
    script_dir = os.path.dirname(script_path)

    # construct absolute path to desired file
    file_path = os.path.join(script_dir, '..')

    # join as many directories needed to get from transfermarket_scraper/ to file dir
    for d in dir:
        file_path = os.path.join(file_path, d)

    # add file name and ending .csv
    file_path = os.path.join(file_path, file + CSV)

    return file_path
