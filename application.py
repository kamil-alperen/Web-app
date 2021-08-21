from flask import Flask, render_template, redirect, request, url_for

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("chess_index.html")
@app.route("/new_game")
def new_game():
    return render_template("chess_new_game.html")
@app.route("/saved_games")
def saved_games():
    return ""
@app.route("/settings")
def settings():
    return ""
@app.route("/exit")
def exit():
    return ""


if __name__ == "__main__":
    app.run(debug=True)