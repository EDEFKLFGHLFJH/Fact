import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 🔥 Création de la base de données
def init_db():
    conn = sqlite3.connect("factures.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS factures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client TEXT,
            produit TEXT,
            prix REAL,
            quantite INTEGER,
            total REAL
        )
    """)

    conn.commit()
    conn.close()

init_db()

# 🚀 Route pour créer une facture + sauvegarder
@app.route("/facture", methods=["POST"])
def facture():
    data = request.get_json()

    client = data["client"]
    produit = data["produit"]
    prix = float(data["prix"])
    quantite = int(data["quantite"])
    total = prix * quantite

    conn = sqlite3.connect("factures.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO factures (client, produit, prix, quantite, total)
        VALUES (?, ?, ?, ?, ?)
    """, (client, produit, prix, quantite, total))

    conn.commit()
    conn.close()

    return jsonify({
        "client": client,
        "produit": produit,
        "prix": prix,
        "quantite": quantite,
        "total": total
    })

# 🔥 HISTORIQUE
@app.route("/factures", methods=["GET"])
def get_factures():
    conn = sqlite3.connect("factures.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM factures")
    rows = cursor.fetchall()

    conn.close()

    factures = []
    for row in rows:
        factures.append({
            "id": row[0],
            "client": row[1],
            "produit": row[2],
            "prix": row[3],
            "quantite": row[4],
            "total": row[5]
        })

    return jsonify(factures)

# 🗑 SUPPRESSION
@app.route("/facture/<int:id>", methods=["DELETE"])
def supprimer_facture(id):
    conn = sqlite3.connect("factures.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM factures WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Facture supprimée"})

app.run(debug=True)