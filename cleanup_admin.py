import re
import os

file_path = r"c:\Users\HADHIK SMARTY\Desktop\voting-system\resources\js\pages\AdminPanel.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Results button after Edit button
# We'll use a very specific anchor: the Edit button's trailing </button> followed by a closing </div> for vs-flex-gap
# Wait, let's just find the first instance of 'Edit' and its following </button>
edit_pattern = r'(<button[^>]*>[\s]*Edit[\s]*</button>[\s]*</div>)'
results_btn = r'''\1
                                                            <button
                                                                className="vs-btn vs-btn-action vs-btn-xs"
                                                                style={{ background: 'rgba(48, 213, 200, 0.1)', color: '#30d5c8', borderColor: 'rgba(48, 213, 200, 0.2)' }}
                                                                onClick={() => fetchResults(election.id)}
                                                            >
                                                                Results
                                                            </button>'''

# Apply only to the first occurrence (the elections table)
parts = re.split(edit_pattern, content, 1)
if len(parts) == 3:
    content = parts[0] + re.sub(edit_pattern, results_btn, parts[1] + parts[2])

# 2. Remove the DUPLICATE results section in the USERS view
# The duplicate starts after the users table div
duplicate_pattern = re.compile(r'</table>[\s]*</div>[\s]*{/\* RESULTS SUMMARY SECTION \*/}.*?{/\* RESULTS SUMMARY SECTION \*/}.*?{viewingResults && resultsData && \(.*?\)[\s]*</div>[\s]*\)}', re.DOTALL)
# Actually, let's just find the SECOND occurrence of viewingResults && resultsData
matches = list(re.finditer(r'{viewingResults && resultsData && \(', content))
if len(matches) > 1:
    second_match = matches[1]
    # Find the closing brace of the conditional block
    # This is tricky with regex, so we'll just look for the end of that specific component
    # We know it ends with '</div>\n                            )}'
    end_pattern = r'\)}[\s]*</div>[\s]*)}'
    end_match = re.search(end_pattern, content[second_match.start():])
    if end_match:
        end_pos = second_match.start() + end_match.end()
        # Find the start of the block (the comment)
        comment_start = content.rfind('{/* RESULTS SUMMARY SECTION */}', 0, second_match.start())
        if comment_start != -1:
            content = content[:comment_start] + content[end_pos:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully cleaned up AdminPanel.jsx")
