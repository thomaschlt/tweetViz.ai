TweetViz.ai
=======================

<p align="center">
     <img width="80%" src="http://gist.github.com/vasturiano/02affe306ce445e423f992faeea13521/raw/preview.png">
</p>

A Flask application which includes a data visualization tool that allows for live Twitter data analysis with sentiment analysis. The tool features a dynamic web component that employs a [force-graph](https://en.wikipedia.org/wiki/Force-directed_graph_drawing) iterative layout to represent graph data structures in a 3-dimensional space, creating an intuitive and engaging user experience.

## Quick start
To get started with this project, follow these steps:

```
$ git clone https://github.com/thomaschlt/tweetViz.ai.git
$ cd flaskapp 
```

Then once you are in the 'flaskapp' folder, you will need to install a virtual environment on your computer, follow these steps : 

1. Install python3 on your computer if needed : (https://www.python.org/downloads/)
2. 
```python3 
$ python3 -m venv env
$ pip3 install -r requirements.txt
$ source env/bin/activate (on MacOS or Linux) 
$ .\env\Scripts\activate (on Windows)
```
Then, run the project and enjoy! 
```
$ flask run
```
To launch the web application, simply click on the development server link provided in your terminal.
