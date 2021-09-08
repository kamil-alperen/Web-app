from flask import Flask, render_template, redirect, request, url_for, jsonify
from flask_restful import Api, Resource, reqparse, abort
from flask_sqlalchemy import SQLAlchemy 
import json



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chess_database.db'
api = Api(app)
db = SQLAlchemy(app)

request_pieces_list = None
request_squares = None
request_turn = None
request_fields_list = None
game_id = None

@app.route("/")
def home():
    return render_template("chess_index.html")
@app.route("/new_game")
def new_game():
    return render_template("chess_new_game.html")
@app.route("/saved_games")
def saved_games():
    return render_template("chess_saved_games.html")
@app.route("/exit")
def exit():
    pass


class Table(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    pieces_list = db.Column(db.String(1000))
    fields_list = db.Column(db.String(400))
    squares = db.Column(db.Text)
    turn = db.Column(db.String(10))
    def __repr__(self):
        return f"{self.id} => {self.fields_list}"


class SaveTable(Resource):
    def get(self):
        global request_pieces_list
        global request_squares
        global request_turn
        global request_fields_list
        global game_id 
        if request_pieces_list != None:
            send_data = {
                'table': request_pieces_list,
                'squares' : request_squares,
                'turn' : request_turn,
                'fields_list' : request_fields_list,
                'id' : game_id
            }
            request_pieces_list = None
            return jsonify(send_data)
        else :
            return jsonify('')

    def post(self):
        table = request.json.get('table')
        squares = request.json.get('squares')
        turn = request.json.get('turn')
        if not table:
            abort(404)
        new_game = Table(pieces_list = json.dumps(table), fields_list = '', squares = json.dumps(squares), turn = json.dumps(turn))
        db.session.add(new_game)
        db.session.commit()
        if len(Table.query.all()) >= 25:
            Table.query.order_by(Table.id.asc())[0].delete()
        info = {
            'id' : new_game.id
        }
        return jsonify(info)
    
    def delete(self):
        id_ = request.json.get('id')
        Table.query.filter_by(id = id_).delete()
        db.session.commit()
        return 'OK', 200

    def put(self):
        id = request.json.get('id')
        table = request.json.get('table')
        squares = request.json.get('squares')
        turn = request.json.get('turn')
        the_table = Table.query.filter_by(id = id).first()
        last_entry_id = Table.query.order_by(Table.id.desc())[0].id
        if the_table.id != last_entry_id:
            the_table.id = last_entry_id + 1
        the_table.pieces_list = json.dumps(table)
        the_table.squares = json.dumps(squares)
        the_table.turn = json.dumps(turn)
        db.session.commit()
        info = {
            'id' : the_table.id
        }
        return jsonify(info)


api.add_resource(SaveTable, '/api/chessgame/saveTable')



saveInfo_args = reqparse.RequestParser()
saveInfo_args.add_argument('field1',type=str, required = True)
saveInfo_args.add_argument('field2',type=str, required = True)
saveInfo_args.add_argument('field3',type=str, required = True)
saveInfo_args.add_argument('field4',type=str, required = True)

class SaveInformation(Resource):
    def get(self, page, id):
        global request_pieces_list
        global request_squares
        global request_turn
        global request_fields_list
        global game_id
        if id != 0:
            game_table = Table.query.filter_by(id = id).first()
            request_pieces_list = json.loads(game_table.pieces_list)
            request_squares = json.loads(game_table.squares)
            request_turn = json.loads(game_table.turn)
            request_fields_list = json.loads(game_table.fields_list)
            game_id = game_table.id
            send_data = {
                'url' : '/new_game'
            }
            return jsonify(send_data)
        else : 
            totalLength = len(Table.query.all())
            start = (page - 1) * 5
            end = start + 5 if start + 5 <= totalLength else totalLength
            lastEntries = Table.query.order_by(Table.id.desc())
            data = []
            for i in range(start, end):
                obj = {
                    'fields_list' : json.loads(lastEntries[i].fields_list),
                    'id' : lastEntries[i].id
                }
                data.append(obj)
            data.append({'saveLength' : totalLength})
            return jsonify(data)

    def post(self, page, id):
        fields = saveInfo_args.parse_args()
        current_game = Table.query.filter_by(id = id).first()
        current_game.fields_list = json.dumps(fields)
        db.session.commit()
        info = {
            'id' : current_game.id,
            'fields_list' : json.loads(current_game.fields_list)
        }
        return jsonify(info)


api.add_resource(SaveInformation, '/api/chessgame/saveInfo/<int:page>/<int:id>')



if __name__ == "__main__":
    app.run(debug=True)