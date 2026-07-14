import time
import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# project defined imports
from constants.headers import HEADERS

TRANSIENT_STATUS_CODES = {429, 500, 502, 503, 504}
MAX_PAGE_REQUEST_ATTEMPTS = 8
BACKOFF_FACTOR_SECONDS = 2


def create_retry_session():
    session = requests.Session()
    retry = Retry(
        total=5,
        connect=5,
        read=5,
        status=5,
        backoff_factor=1,
        allowed_methods={"GET"},
        status_forcelist=list(TRANSIENT_STATUS_CODES),
        raise_on_status=False,
        respect_retry_after_header=True,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session

SESSION = create_retry_session()

def get_page_soup(url, element_class):
    for attempt in range(1, MAX_PAGE_REQUEST_ATTEMPTS + 1):
        try:
            webpage = SESSION.get(url, headers=HEADERS, timeout=(5, 60))

            if webpage.status_code in TRANSIENT_STATUS_CODES:
                raise requests.exceptions.HTTPError(
                    f"Transient HTTP status {webpage.status_code}", response=webpage
                )

            webpage.raise_for_status()
            soup = BeautifulSoup(webpage.content, "html.parser")
            return soup.find_all(class_=element_class)

        except (requests.exceptions.Timeout, requests.exceptions.ConnectionError,
                requests.exceptions.HTTPError) as error:
            if attempt == MAX_PAGE_REQUEST_ATTEMPTS:
                print(f"[get_page_soup] failed after {attempt} attempts for {url}: {error}")
                raise

            wait_seconds = BACKOFF_FACTOR_SECONDS * (2 ** (attempt - 1))
            print(f"[get_page_soup] attempt {attempt}/{MAX_PAGE_REQUEST_ATTEMPTS} failed for {url}: {error}. retrying in {wait_seconds}s")
            time.sleep(wait_seconds)

    raise RuntimeError(f"Failed to fetch page after {MAX_PAGE_REQUEST_ATTEMPTS} attempts: {url}")
