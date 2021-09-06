from flask import Flask, render_template, redirect, request, url_for, jsonify
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
""" from flask_sqlalchemy import SQLAlchemy """


app = Flask(__name__)
""" app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chess_database.db'
database = SQLAlchemy(app) """
api = Api(app)


@app.route("/")
def home():
    return render_template("chess_index.html")
@app.route("/new_game")
def new_game():
    return render_template("chess_new_game.html")
@app.route("/saved_games")
def saved_games():
    return render_template("chess_saved_games.html")
@app.route("/settings")
def settings():
    return render_template("chess_settings.html")
@app.route("/exit")
def exit():
    pass


""" class Table(database.Model):
    id = database.Column(database.Integer, primary_key = True)
    piece_name = database.Column(database.String(20), nullable = False)
    def __repr__(self):
        return f"{self.id} => {self.piece_name}" """



class TableExchange(Resource):
    def get(self):
        pass

    def post(self):
        table = request.json
        if not table:
            abort(404)
        """ for list in table:
            for piece_name_ in list:
                table_instance = Table(piece_name = piece_name_)
                database.session.add(table_instance)
        database.session.commit() """
        return "OK", 200 

    def delete(self):
        pass

    def put(self):
        pass


api.add_resource(TableExchange, '/api/chessgame/table')




if __name__ == "__main__":
    app.run(debug=True)