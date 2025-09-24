from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Create static/audio directory if it doesn't exist
os.makedirs(os.path.join(app.static_folder, 'audio'), exist_ok=True)

# Import blueprints
from routes.chat import chat_bp
from routes.scheduler import scheduler_bp
from routes.voice import voice_bp
from routes.chess import chess_bp

# Register blueprints
app.register_blueprint(chat_bp)
app.register_blueprint(scheduler_bp)
app.register_blueprint(voice_bp)
app.register_blueprint(chess_bp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
