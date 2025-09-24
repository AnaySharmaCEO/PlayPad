from flask import Blueprint

voice_bp = Blueprint('voice', __name__)

from flask import request, jsonify
import speech_recognition as sr

import wikipedia
import os
import webbrowser
import requests
from urllib.parse import quote
import re

@voice_bp.route('/api/voicechat', methods=['POST'])
def voicechat():
	# Accept audio file or text
	if 'audio' in request.files:
		recognizer = sr.Recognizer()
		audio_file = request.files['audio']
		with sr.AudioFile(audio_file) as source:
			audio = recognizer.record(source)
		try:
			user_text = recognizer.recognize_google(audio)
		except Exception as e:
			return jsonify({'response': f'Speech recognition error: {str(e)}'}), 400
	else:
		user_text = request.json.get('text', '')

	# Command logic (similar to chat)
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

	command_response = handle_command(user_text)
	response_text = command_response if command_response else f"You said: {user_text}"

	# Text-to-speech response
	

	# Return both text and audio file path
	return jsonify({'response': response_text})
