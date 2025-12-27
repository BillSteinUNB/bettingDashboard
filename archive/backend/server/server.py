from flask import Flask, request, jsonify
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and all origins

# 1) Authenticate with Google Sheets
scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('credentials.json', scope)
client = gspread.authorize(creds)

# 2) Open your sheet
sheet = client.open('Betting ').sheet1  # "Betting " is the name of your Google Sheet

# 3) Define the POST route to submit bets
@app.route('/api/submit-bets', methods=['POST'])
def submit_bets():
    bets = request.json  # Expecting an array of objects like [{ game, bet, sport, odds, units }, ...]
    for bet in bets:
        game = bet.get('game', '')
        bet_desc = bet.get('bet', '')
        sport = bet.get('sport', '')
        odds = bet.get('odds', '')
        units = bet.get('units', '')
        date_str = datetime.datetime.now().strftime('%Y-%m-%d')
        row = [date_str, game, bet_desc, sport, odds, units]
        sheet.append_row(row)
    return jsonify({"status": "ok", "rows_added": len(bets)})

# 4) Run the Flask server
if __name__ == '__main__':
    app.run(debug=True, port=5000)
