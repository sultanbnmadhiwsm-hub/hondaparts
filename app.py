from flask import Flask, send_from_directory, request, jsonify
import sqlite3
import json
app = Flask(__name__)
print("✅ هذا هو app.py الصحيح")

# إنشاء قاعدة البيانات
def init_db():
    conn = sqlite3.connect("cars.db")
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS parts (
        id TEXT PRIMARY KEY,
        name TEXT,
        number TEXT,
        price TEXT,
        stock TEXT,
        image TEXT,
        description TEXT,
              url TEXT,
        related TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()

def add_url_column():

    conn = sqlite3.connect("cars.db")
    cur = conn.cursor()

    try:
        cur.execute("ALTER TABLE parts ADD COLUMN url TEXT")
    except:
        pass

    conn.commit()
    conn.close()


add_url_column()

@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/admin")
def admin():
    return send_from_directory(".", "admin.html")

@app.route("/<path:path>")
def files(path):
    return send_from_directory(".", path)
@app.route("/save-part", methods=["POST"])
def save_part():

    data = request.json

    conn = sqlite3.connect("cars.db")
    cur = conn.cursor()

    cur.execute("""
    INSERT OR REPLACE INTO parts
    (id,name,number,price,stock,image,description,url,related)
    VALUES (?,?,?,?,?,?,?,?,?)
    """, (
        data["id"],
        data["name"],
        data["number"],
        data["price"],
        data["stock"],
        data["image"],
        data["description"],
         data["url"],
        data["related"]
    ))

    conn.commit()
    conn.close()

    return jsonify({"success": True})
@app.route("/get-parts/<year>")
def get_parts(year):

    conn = sqlite3.connect("cars.db")
    cur = conn.cursor()

    cur.execute("""
    SELECT id,name,number,price,stock,image,description,url,related
    FROM parts
    """)

    rows = cur.fetchall()

    conn.close()

    result = {}

    for row in rows:

        try:
            related = json.loads(row[8]) if row[8] else []
        except:
            related = []

        result[row[0]] = {
            "name": row[1],
            "number": row[2],
            "price": row[3],
            "stock": row[4],
            "image": row[5],
            "description": row[6],
            "url": row[7],
            "related": related
        }

    return jsonify(result)
@app.route("/delete-part", methods=["POST"])
def delete_part():

    data = request.json

    conn = sqlite3.connect("cars.db")
    cur = conn.cursor()

    cur.execute(
        "DELETE FROM parts WHERE id=?",
        (data["id"],)
    )

    conn.commit()
    conn.close()

    return jsonify({"success": True})
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)