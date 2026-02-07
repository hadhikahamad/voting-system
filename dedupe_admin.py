import os

file_path = r"c:\Users\HADHIK SMARTY\Desktop\voting-system\resources\js\pages\AdminPanel.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip_next = 0

for i, line in enumerate(lines):
    if skip_next > 0:
        skip_next -= 1
        continue
    
    # Check if this line is a Results button and the next line is also a Results button (or very close)
    if 'Results' in line and '<button' in line and i + 7 < len(lines):
        # Look ahead for another Results button
        found_second = False
        for j in range(i + 1, i + 10):
            if j < len(lines) and 'Results' in lines[j] and '<button' in lines[j]:
                found_second = True
                break
        if found_second:
             # Skip this first one, we'll keep the second one (or vice versa)
             # Actually, let's just skip until the end of the first button
             for j in range(i, i + 10):
                 if '</button>' in lines[j]:
                     skip_next = (j - i) + 1
                     break
             continue

    new_lines.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Successfully removed duplicated buttons in AdminPanel.jsx")
