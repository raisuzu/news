import requests
import json

headers = {'X-Api-Key': '0f432f32bcda4f35badf3787294f9fa3'}

url = 'https://newsapi.org/v2/everything'
params = {
    'q': 'amazon AND apple',
    'sortBy': 'publishedAt',
    'pageSize': 1
}

response = requests.get(url, headers=headers, params=params)
print(response)

print(response.json())