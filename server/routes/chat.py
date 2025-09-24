from flask import Blueprint, request, jsonify
import os
import wikipedia
import requests
import webbrowser
from urllib.parse import quote
import re

chat_bp = Blueprint('chat', __name__)
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def handle_command(text):
    text = text.lower()
    if text.startswith('open app '):
        app_name = text.replace('open app ', '').strip()
        if app_name == 'calculator':
            os.system('calc')
            return f"Opened {app_name}"
        elif app_name == 'notepad':
            os.system('notepad')
            return f"Opened {app_name}"
        else:
            return f"App '{app_name}' not recognized."
    elif text.startswith('open file '):
        file_path = text.replace('open file ', '').strip()
        try:
            os.startfile(file_path)
            return f"Opened file: {file_path}"
        except Exception as e:
            return f"Error opening file: {str(e)}"
    elif text.startswith('search wikipedia for '):
        query = text.replace('search wikipedia for ', '').strip()
        try:
            summary = wikipedia.summary(query, sentences=2)
            return f"Wikipedia summary for '{query}': {summary}"
        except Exception as e:
            return f"Wikipedia search error: {str(e)}"
    elif text.startswith('open song '):
        song_name = text.replace('open song ', '').strip()
        search_url = f"https://www.youtube.com/results?search_query={quote(song_name)}"
        try:
            r = requests.get(search_url)
            if r.status_code == 200 and 'watch?v=' in r.text:
                match = re.search(r"watch\?v=([\w-]{11})", r.text)
                if match:
                    video_id = match.group(1)
                    video_url = f"https://www.youtube.com/watch?v={video_id}"
                    webbrowser.open_new_tab(video_url)
                    return f"Opened song: {song_name} on YouTube"
            return "Song not found, try again."
        except Exception as e:
            return f"Error searching for song: {str(e)}"
    return None

@chat_bp.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_text = data.get('text', '')
    command_response = handle_command(user_text)
    if command_response:
        return jsonify({'response': command_response})
    if not GEMINI_API_KEY:
        return jsonify({'response': 'Gemini API key not set.'}), 500
    try:
        headers = {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY
        }
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": user_text}
                    ]
                }
            ]
        }
        r = requests.post(GEMINI_API_URL, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()
        ai_response = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'No response from Gemini.')
    except Exception as e:
        ai_response = f"Error from Gemini: {str(e)}"
    return jsonify({'response': ai_response})
