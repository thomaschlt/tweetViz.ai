from bs4 import BeautifulSoup
import requests

url = 'https://trendlistz.com/united-states'
response = requests.get(url)
content = response.content

soup = BeautifulSoup(content, 'html.parser')

trends_container = soup.find('ol', class_='trend-list card')

trends = []
for trend in trends_container.find_all('span', class_="term"):
    trends.append(trend.text.strip())
print(trends)

# save the trends to a file
with open('trends.csv', 'w') as f:
    f.write("Trends"+'\n')
    for s in trends:
        f.write(str(s)+'\n')
