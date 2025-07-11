from flask import Flask, request, jsonify
import json
import spacy

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

with open("schemes.json") as f:
    SCHEMES = json.load(f)

def match_schemes(user):
    matches = []
    for scheme in SCHEMES:
        elig = scheme["eligibility"]
        if elig.get("min_age") and user["age"] < elig["min_age"]:
            continue
        if elig.get("max_age") and user["age"] > elig["max_age"]:
            continue
        if "education" in elig and user["education"] not in elig["education"]:
            continue
        if "occupation" in elig and user["occupation"] not in elig["occupation"]:
            continue
        if "state" in elig and elig["state"] != ["all"] and user["state"] not in elig["state"]:
            continue
        matches.append(scheme)
    return matches

@app.route("/schemes/match", methods=["POST"])
def schemes_match():
    user = request.json
    matches = match_schemes(user)
    return jsonify(matches)

@app.route("/schemes/query", methods=["POST"])
def schemes_query():
    query = request.json.get("query")
    doc = nlp(query)
    user = {"age": None, "education": None, "occupation": None, "state": None}
    for ent in doc.ents:
        if ent.label_ == "AGE":
            user["age"] = int(ent.text)
        if ent.label_ == "GPE":
            user["state"] = ent.text
    if "unemployed" in query:
        user["occupation"] = "unemployed"
    if "graduate" in query:
        user["education"] = "graduate"
    # Set defaults for demo
    user = {k: v or 23 for k, v in user.items()}
    matches = match_schemes(user)
    return jsonify(matches)

if __name__ == "__main__":
    app.run(debug=True)
