import requests
import pandas as pd
from bs4 import BeautifulSoup
from constants import USER_AGENT

# inform website that requests coming from browser #
headers = { 'User-Agent': USER_AGENT }

print(USER_AGENT)
