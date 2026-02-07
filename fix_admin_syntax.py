import os

file_path = r"c:\Users\HADHIK SMARTY\Desktop\voting-system\resources\js\pages\AdminPanel.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip_until = -1

for i, line in enumerate(lines):
    if i < skip_until:
        continue

    # Fix 1: Wrap adjacent buttons in ternary (around line 282-300 in original view)
    if 'editingElection ? (' in line and i + 15 < len(lines):
        # Look for the start of the next button
        found_adjacent = False
        for j in range(i + 1, i + 15):
             if '</button>' in lines[j] and j + 1 < len(lines) and '<button' in lines[j+1]:
                 found_adjacent = True
                 # We found the adjacent buttons.
                 # Let's rebuild this block
                 new_lines.append(line) # {editingElection ? (
                 new_lines.append('                                    <>\n')
                 # Add content up to the first button close
                 k = i + 1
                 while '</button>' not in lines[k]:
                     new_lines.append(lines[k])
                     k += 1
                 new_lines.append(lines[k]) # </button>
                 k += 1
                 # Add the adjacent button
                 while '</button>' not in lines[k]:
                     new_lines.append(lines[k])
                     k += 1
                 new_lines.append(lines[k]) # </button>
                 new_lines.append('                                    </>\n')
                 skip_until = k + 1
                 break
        if found_adjacent:
            continue

    # Fix 2: Remove duplicate results button and stray </button>
    if 'Results' in line and '<button' in line and i + 8 < len(lines):
        # Check if another Result button follows immediately
        is_duplicate = False
        for j in range(i + 1, i + 10):
             if j < len(lines) and 'Results' in lines[j] and '<button' in lines[j]:
                 is_duplicate = True
                 # Rebuild the list item block without duplication
                 # Find the start of the container or just the single button
                 # Actually, let's just find the second button's end and the stray tag
                 k = j
                 while '</button>' not in lines[k]:
                     k += 1
                 k += 1 # end of second results button
                 # Check for stray tag
                 if '</button>' in lines[k]:
                     k += 1 # skip stray tag
                 
                 # Append only one button
                 # We are at 'line' which is the start of the first button
                 curr = i
                 while '</button>' not in lines[curr]:
                     new_lines.append(lines[curr])
                     curr += 1
                 new_lines.append(lines[curr]) # </button>
                 skip_until = k
                 break
        if is_duplicate:
            continue

    new_lines.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Successfully fixed syntax errors in AdminPanel.jsx")
