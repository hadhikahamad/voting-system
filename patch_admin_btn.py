import re
import os

file_path = r"c:\Users\HADHIK SMARTY\Desktop\voting-system\resources\js\pages\AdminPanel.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Results button after Edit button
# Matches the Edit button block precisely - and we'll use a more flexible regex
# We anchor on the beginning of the Edit button and its text
edit_btn_pattern = r'(<button[^>]*vs-btn-edit[^>]*>[\s]*Edit[\s]*</button>)'
results_btn = r'\1\n                                                            <button className="vs-btn vs-btn-action vs-btn-results vs-btn-xs" style={{ background: "rgba(48, 213, 200, 0.1)", color: "#30d5c8", borderColor: "rgba(48, 213, 200, 0.2)" }} onClick={() => fetchResults(election.id)}>Results</button>'
content = re.sub(edit_btn_pattern, results_btn, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated AdminPanel.jsx with Results button")
