from app import mongo
from . import api
from flask_login import login_required
from flask import request
from ..backend.search import get_edge_detail
import json
from flask import jsonify

# INNER_LAW_NETWORK = mongo.db.network # This network collection contains the relationship between named entities and sections
# LAW_NETWORK = "" # Outer law network, which cites which one
# LAWS = mongo.db.laws # Containes the law texts
# USERS = mongo.db.users


# Returns the connection [Main Connection]
@api.route('/api/connection', methods=['GET'])
# @login_required
def get_law_connection():
    law_id = request.args.get('id')
    return "Connnection %s" % str(mongo.db.users.find_one({'username' : 'manash'}))


# Amendment data
@api.route('/api/amendments', methods=['GET'])
def get_amendment_detail():
    pass



# Inner law details, connection between entities and sections 
@api.route('/api/law_detail', methods=['GET'])
def get_law_detial():
    pass


# Returns law text in a formatted manner 
@api.route('/api/law_text', methods=['GET'])
def get_law_text():
    pass

@api.route('/api/edge_detail', methods=['GET'])
def get_connection_detail():
    source_id = int(request.args.get('s'))
    destination_id = int(request.args.get('d'))
    detail = mongo.db.edge_detail.find_one({'source' : source_id, 'destination' : destination_id})

    if detail != None:
        return jsonify({
            'detail' : detail['details']
        })

    return jsonify({
        'error' : 'No Details Found'
    })



