from flask import Blueprint, request, jsonify
from ics import Calendar, Event
from fpdf import FPDF
import csv
import json
import os
from io import StringIO
from datetime import datetime, timedelta
import uuid

scheduler_bp = Blueprint('scheduler', __name__)

# File-based storage (replace with database in production)
TASKS_FILE = 'tasks.json'

def load_tasks():
    """Load tasks from JSON file"""
    if os.path.exists(TASKS_FILE):
        try:
            with open(TASKS_FILE, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []

def save_tasks(tasks_list):
    """Save tasks to JSON file"""
    try:
        with open(TASKS_FILE, 'w') as f:
            json.dump(tasks_list, f, indent=2)
        return True
    except IOError:
        return False

def get_tasks():
    """Get all tasks"""
    return load_tasks()

@scheduler_bp.route('/api/tasks', methods=['GET'])
def get_tasks_endpoint():
    """Get all tasks"""
    tasks = load_tasks()
    return jsonify(tasks)

@scheduler_bp.route('/api/tasks/export/csv', methods=['GET'])
def export_tasks_csv():
    """Export tasks as CSV"""
    try:
        tasks = load_tasks()
        si = StringIO()
        writer = csv.writer(si)
        writer.writerow(['id', 'title', 'startTime', 'endTime', 'category', 'date', 'color', 'completed'])
        for task in tasks:
            writer.writerow([
                task.get('id', ''),
                task.get('title', ''),
                task.get('startTime', ''),
                task.get('endTime', ''),
                task.get('category', ''),
                task.get('date', ''),
                task.get('color', ''),
                task.get('completed', False)
            ])
        output = si.getvalue()
        return output, 200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=tasks.csv'
        }
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@scheduler_bp.route('/api/tasks/export/ics', methods=['GET'])
def export_tasks_ics():
    """Export tasks as ICS calendar file"""
    try:
        tasks = load_tasks()
        cal = Calendar()
        
        for task in tasks:
            if task.get('date') and task.get('startTime'):
                try:
                    # Parse date and time properly
                    task_date = datetime.strptime(task['date'], '%Y-%m-%d').date()
                    start_time = datetime.strptime(task['startTime'], '%H:%M').time()
                    
                    # Create datetime objects
                    start_datetime = datetime.combine(task_date, start_time)
                    
                    e = Event()
                    e.name = task.get('title', 'Task')
                    e.begin = start_datetime.strftime('%Y-%m-%d %H:%M:%S')
                    
                    if task.get('endTime'):
                        end_time = datetime.strptime(task['endTime'], '%H:%M').time()
                        end_datetime = datetime.combine(task_date, end_time)
                        e.end = end_datetime.strftime('%Y-%m-%d %H:%M:%S')
                    else:
                        # Default 1 hour duration if no end time
                        e.end = (start_datetime + timedelta(hours=1)).strftime('%Y-%m-%d %H:%M:%S')
                    
                    # Add description with category
                    e.description = f"Category: {task.get('category', 'General')}"
                    
                    cal.events.add(e)
                except ValueError as ve:
                    print(f"Error parsing task {task.get('id', 'unknown')}: {ve}")
                    continue
        
        return str(cal), 200, {
            'Content-Type': 'text/calendar',
            'Content-Disposition': 'attachment; filename=tasks.ics'
        }
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@scheduler_bp.route('/api/tasks/export/pdf', methods=['GET'])
def export_tasks_pdf():
    """Export tasks as PDF"""
    try:
        tasks = load_tasks()
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=16, style='B')
        pdf.cell(200, 10, txt="Scheduled Tasks", ln=True, align='C')
        pdf.ln(10)
        
        pdf.set_font("Arial", size=12)
        
        if not tasks:
            pdf.cell(200, 10, txt="No tasks found", ln=True, align='C')
        else:
            for task in tasks:
                title = task.get('title', 'Untitled Task')
                date = task.get('date', 'No date')
                start_time = task.get('startTime', 'No time')
                end_time = task.get('endTime', '')
                category = task.get('category', 'General')
                completed = "✓" if task.get('completed', False) else "○"
                
                # Task line
                line = f"{completed} {title} | {date} {start_time}"
                if end_time:
                    line += f"-{end_time}"
                line += f" | {category}"
                
                pdf.cell(200, 8, txt=line, ln=True)
                pdf.ln(2)
        
        return pdf.output(dest='S').encode('latin-1'), 200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=tasks.pdf'
        }
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@scheduler_bp.route('/api/tasks', methods=['POST'])
def add_task():
    """Add a new task"""
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['title', 'date', 'startTime', 'endTime', 'category']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate unique ID
        data['id'] = str(uuid.uuid4())
        data['completed'] = data.get('completed', False)
        
        # Load existing tasks, add new one, and save
        tasks = load_tasks()
        tasks.append(data)
        
        if save_tasks(tasks):
            return jsonify(data), 201
        else:
            return jsonify({'error': 'Failed to save task'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@scheduler_bp.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    """Update an existing task"""
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        tasks = load_tasks()
        task_found = False
        
        for task in tasks:
            if task['id'] == task_id:
                # Preserve ID and update other fields
                data['id'] = task_id
                task.update(data)
                task_found = True
                break
        
        if not task_found:
            return jsonify({'error': 'Task not found'}), 404
        
        if save_tasks(tasks):
            updated_task = next((task for task in tasks if task['id'] == task_id), None)
            return jsonify(updated_task), 200
        else:
            return jsonify({'error': 'Failed to save task'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@scheduler_bp.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    try:
        tasks = load_tasks()
        original_count = len(tasks)
        tasks = [task for task in tasks if task['id'] != task_id]
        
        if len(tasks) == original_count:
            return jsonify({'error': 'Task not found'}), 404
        
        if save_tasks(tasks):
            return '', 204
        else:
            return jsonify({'error': 'Failed to save tasks'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@scheduler_bp.route('/api/ai/generate-tasks', methods=['POST'])
def generate_tasks():
    """Generate tasks from natural language prompt"""
    try:
        data = request.json
        if not data or 'prompt' not in data:
            return jsonify({'error': 'No prompt provided'}), 400
        
        prompt = data.get('prompt', '')
        if not prompt.strip():
            return jsonify({'error': 'Empty prompt provided'}), 400
        
        import re
        
        today = datetime.now().strftime('%Y-%m-%d')
        days_of_week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        
        def categorize_task(task_name):
            """Simple task categorization based on keywords"""
            task_lower = task_name.lower()
            if any(word in task_lower for word in ['work', 'meeting', 'project', 'office', 'client']):
                return 'work'
            elif any(word in task_lower for word in ['workout', 'gym', 'exercise', 'run', 'health']):
                return 'health'
            elif any(word in task_lower for word in ['study', 'learn', 'read', 'course', 'homework']):
                return 'education'
            elif any(word in task_lower for word in ['family', 'friends', 'social', 'party', 'dinner']):
                return 'social'
            else:
                return 'personal'
        
        def get_task_color(category):
            """Get color for task category"""
            color_map = {
                'work': 'bg-blue-500',
                'health': 'bg-red-500',
                'education': 'bg-purple-500',
                'personal': 'bg-green-500',
                'social': 'bg-yellow-500',
            }
            return color_map.get(category, 'bg-gray-500')
        
        def parse_time(time_str):
            """Parse time string to 24-hour format"""
            if not time_str:
                return None
            
            # Remove extra spaces and convert to lowercase
            time_str = time_str.strip().lower()
            
            # Match patterns like "5pm", "5:30pm", "17:30", "5:30"
            time_pattern = r'(\d{1,2})(?::(\d{2}))?\s*(am|pm)?'
            match = re.match(time_pattern, time_str)
            
            if not match:
                return None
            
            hour = int(match.group(1))
            minute = int(match.group(2)) if match.group(2) else 0
            ampm = match.group(3)
            
            if ampm:
                if ampm == 'pm' and hour != 12:
                    hour += 12
                elif ampm == 'am' and hour == 12:
                    hour = 0
            
            return f"{hour:02d}:{minute:02d}"
        
        # Check for repeating schedule
        repeating = 'repeating' in prompt.lower() or 'weekly' in prompt.lower()
        repeat_days = []
        
        if repeating:
            for day in days_of_week:
                if day in prompt.lower():
                    repeat_days.append(day)
            if not repeat_days:
                repeat_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']  # Weekdays by default
        
        generated_tasks = []
        
        # Split prompt into sentences and process each
        sentences = re.split(r'[.,\n]', prompt)
        
        for index, sentence in enumerate(sentences):
            sentence = sentence.strip()
            if len(sentence) < 3:
                continue
            
            # Simple task extraction patterns
            patterns = [
                # "task at 5pm"
                r'(.+?)\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)',
                # "task from 5pm to 6pm"
                r'(.+?)\s+from\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s+to\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)',
                # "task by 5pm"
                r'(.+?)\s+by\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)',
                # Just task name
                r'(.+?)(?:\s+(?:at|from|by|until)\s+.+)?$'
            ]
            
            task_name = None
            start_time = None
            end_time = None
            
            for pattern in patterns:
                match = re.search(pattern, sentence, re.IGNORECASE)
                if match:
                    task_name = match.group(1).strip()
                    if len(match.groups()) >= 2:
                        start_time = parse_time(match.group(2))
                    if len(match.groups()) >= 3:
                        end_time = parse_time(match.group(3))
                    break
            
            if not task_name:
                continue
            
            # Clean up task name
            task_name = re.sub(r'\s+(at|from|to|by|until)\s+.+$', '', task_name, flags=re.IGNORECASE)
            task_name = task_name.strip()
            
            if not task_name:
                continue
            
            # Set default times if not provided
            if not start_time:
                start_time = '09:00'  # Default morning time
            
            if not end_time:
                # Calculate end time based on task type
                start_hour = int(start_time.split(':')[0])
                duration = 60  # Default 1 hour
                
                # Adjust duration based on task type
                task_lower = task_name.lower()
                if any(word in task_lower for word in ['meeting', 'call']):
                    duration = 30
                elif any(word in task_lower for word in ['workout', 'exercise']):
                    duration = 90
                elif any(word in task_lower for word in ['study', 'learn']):
                    duration = 120
                
                end_minutes = start_hour * 60 + int(start_time.split(':')[1]) + duration
                end_hour = (end_minutes // 60) % 24
                end_min = end_minutes % 60
                end_time = f"{end_hour:02d}:{end_min:02d}"
            
            # Categorize task
            category = categorize_task(task_name)
            color = get_task_color(category)
            
            # Generate tasks
            if repeating:
                for day_index, day in enumerate(repeat_days):
                    day_num = days_of_week.index(day)
                    today_num = datetime.now().weekday()
                    delta_days = (day_num - today_num) % 7
                    if delta_days == 0 and datetime.now().time() > datetime.strptime(start_time, '%H:%M').time():
                        delta_days = 7  # Move to next week if time has passed today
                    
                    task_date = (datetime.now() + timedelta(days=delta_days)).strftime('%Y-%m-%d')
                    
                    task_id = str(uuid.uuid4())
                    generated_tasks.append({
                        'id': task_id,
                        'title': task_name.title(),
                        'startTime': start_time,
                        'endTime': end_time,
                        'category': category,
                        'date': task_date,
                        'color': color,
                        'completed': False,
                        'aiGenerated': True,
                        'repeating': True,
                        'repeatDays': repeat_days
                    })
            else:
                task_id = str(uuid.uuid4())
                generated_tasks.append({
                    'id': task_id,
                    'title': task_name.title(),
                    'startTime': start_time,
                    'endTime': end_time,
                    'category': category,
                    'date': today,
                    'color': color,
                    'completed': False,
                    'aiGenerated': True
                })
        
        # Save generated tasks
        if generated_tasks:
            existing_tasks = load_tasks()
            existing_tasks.extend(generated_tasks)
            save_tasks(existing_tasks)
        
        return jsonify(generated_tasks), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
