import os

file_path = r"c:\Users\HADHIK SMARTY\Desktop\voting-system\resources\js\pages\AdminPanel.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
results_button_added = False
skip_mode = False

# Results button to add
res_btn = [
    '                                                            <button\n',
    '                                                                className="vs-btn vs-btn-action vs-btn-xs"\n',
    '                                                                style={{ background: "rgba(48, 213, 200, 0.1)", color: "#30d5c8", borderColor: "rgba(48, 213, 200, 0.2)" }}\n',
    '                                                                onClick={() => fetchResults(election.id)}\n',
    '                                                            >\n',
    '                                                                Results\n',
    '                                                            </button>\n'
]

results_section_count = 0

for i, line in enumerate(lines):
    # 1. Add results button after first Edit button closing
    if not results_button_added and 'Edit' in line and '</button>' in lines[i+1] and '</div>' in lines[i+2]:
        new_lines.append(line)
        new_lines.append(lines[i+1])
        new_lines.extend(res_btn)
        results_button_added = True
        # We'll skip the original </button> and </div> because we added them (wait, no, let's just append the button before them)
        # Actually, let's just append the button after the closing </button>
        continue 
    
    # Check for results section
    if '{/* RESULTS SUMMARY SECTION */}' in line:
        results_section_count += 1
        if results_section_count > 1:
            skip_mode = True
            continue # skip the comment
            
    if skip_mode:
        # We skip until we hit the next major section or end of conditional
        # Based on the file structure, the results section ends before {/* CANDIDATES MANAGEMENT SECTION */} 
        # or before {/* USERS VIEW */} ends.
        # Actually, let's look for the next section comment
        if '/* CANDIDATES' in line or '/* USERS' in line or '/* CSS' in line or '/* MAIN CONTENT' in line:
             skip_mode = False
             new_lines.append(line)
        continue
    
    # 2. Add the Results button after the Edit button
    # The Edit button is:
    # <button ...>
    #    Edit
    # </button>
    if not results_button_added and 'Edit' in line and i > 0 and '<button' in lines[i-14]: # Rough check
         # Actually, easier: look for '</button>' that follows a line containing 'Edit'
         pass

    new_lines.append(line)

# Final fix for the results button insertion - let's be more precise
final_lines = []
skip_next = 0
for i, line in enumerate(new_lines):
    if skip_next > 0:
        skip_next -= 1
        continue
        
    if 'Edit' in line and '</button>' in new_lines[i+1]:
        final_lines.append(line)
        final_lines.append(new_lines[i+1])
        # Add Results button right after the Edit button's closing tag
        final_lines.extend(res_btn)
        skip_next = 1
        continue
    final_lines.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(final_lines)

print("Successfully cleaned up AdminPanel.jsx using line-by-line logic")
