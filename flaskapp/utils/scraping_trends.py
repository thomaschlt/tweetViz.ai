# But: Scrape les tendances actuelles Twitter et les sauvegarde dans un fichier csv
# Auteur:  Thomas Chimbault
# Creation: 2023-01-24
# Dernière mise à jour : 2023 - 04 - 15

# Path : flaskapp/utils/scraping_trends.py

from bs4 import BeautifulSoup
import requests


def scrape_trends(url='https://trendlistz.com/united-states'):
    response = requests.get(url)
    content = response.content
    soup = BeautifulSoup(content, 'html.parser')
    trends_container = soup.find('ol', class_='trend-list card')
    trends = []
    for i, trend in enumerate(trends_container.find_all('span', class_="term")):
        if i >= 3:
            break
        trends.append(trend.text.strip())
    print(trends)

    # Save the trends to a file
    with open('utils/trends.csv', 'w') as f:
        f.write("Trends"+'\n')
        for s in trends:
            if '#' in s:
                s = s.replace('#', '')
            f.write(str(s)+'\n')
