import requests

response = requests.get("https://www.example.com")
user_agent = response.request.headers['User-Agent']
print(user_agent)
