import os
import re

file_path = r"c:\Users\HADHIK SMARTY\Desktop\voting-system\resources\js\pages\AdminPanel.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Ternary Header (wrap in fragment or div)
# We search for the problematic block using regex
header_pattern = re.compile(r'\{editingElection \? \(.*?\) : \(', re.DOTALL)
# But wait, there's multiple ternary patterns. Let's be more specific.
header_anchor = '<h3>{editingElection ? \'Update Election\' : \'Manage Elections\'}</h3>'

# Let's rebuild the header block
new_header_block = r'''                                {editingElection ? (
                                    <div className="vs-flex-gap">
                                        <button
                                            className="vs-btn vs-btn-xs vs-btn-ghost"
                                            onClick={() => {
                                                setEditingElection(null);
                                                setNewElection({ title: '', description: '', start_date: '', end_date: '', is_public: true });
                                                setShowCreateWrapper(false);
                                            }}
                                        >
                                            Cancel Edit
                                        </button>
                                        <button
                                            className="vs-btn vs-btn-action vs-btn-xs"
                                            style={{ background: "rgba(48, 213, 200, 0.1)", color: "#30d5c8", borderColor: "rgba(48, 213, 200, 0.2)" }}
                                            onClick={() => fetchResults(editingElection.id)}
                                        >
                                            Results
                                        </button>
                                    </div>
                                ) : (
                                    <button className={`vs-btn ${showCreateWrapper ? 'vs-btn-outline' : 'vs-btn-new-election'}`} onClick={() => setShowCreateWrapper(!showCreateWrapper)}>
                                        {showCreateWrapper ? 'Cancel' : '+ New Election'}
                                    </button>
                                )}'''

# We need to find where it starts and ends
# Start is right after header_anchor
start_pos = content.find(header_anchor)
if start_pos != -1:
    after_header = content[start_pos + len(header_anchor):]
    # Find the start of the ternary
    ternary_start = after_header.find('{editingElection ? (')
    if ternary_start != -1:
        # Find the end of the ternary
        # This is hard, so we'll search for the next closing </div> that closes the header block
        # Actually, let's look for '/* CREATE FORM */' which follows it
        next_section = '/* CREATE FORM */'
        end_pos = after_header.find(next_section)
        if end_pos != -1:
            # We found the block to replace
            # Need to back up a bit from end_pos to skip the closing </div> of the parent vs-flex-between
            block_end = after_header.rfind('</div>', 0, end_pos)
            if block_end != -1:
                old_block = after_header[ternary_start:block_end]
                content = content.replace(old_block, new_header_block)

# Fix 2: Elections Table Actions
actions_anchor = '<div className="vs-flex-gap">'
# We want to replace the content of vs-flex-gap in the elections table
# The elections table actions block ends with </div>\n                                                        </td>

new_actions_block = r'''<div className="vs-flex-gap">
                                                             <button
                                                                 className={`vs-btn vs-btn-action vs-btn-xs ${election.status === 'active' ? 'vs-btn-deactivate' : 'vs-btn-activate'}`}
                                                                 onClick={async () => {
                                                                     const token = localStorage.getItem('token');
                                                                     try {
                                                                         const res = await fetch(`/api/admin/elections/${election.id}/toggle`, {
                                                                             method: 'POST',
                                                                             headers: {
                                                                                 'Authorization': `Bearer ${token}`,
                                                                                 'Accept': 'application/json'
                                                                             }
                                                                         });
                                                                         if (res.ok) {
                                                                             const data = await res.json();
                                                                             showToast(`Election is now ${data.status}`, 'success');
                                                                             fetchData();
                                                                         }
                                                                     } catch (err) {
                                                                         showToast('Failed to change status', 'error');
                                                                     }
                                                                 }}
                                                             >
                                                                 {election.status === 'active' ? 'Deactivate' : 'Activate'}
                                                             </button>
                                                             <button
                                                                 className="vs-btn vs-btn-action vs-btn-candidates vs-btn-xs"
                                                                 onClick={() => {
                                                                     setSelectedElectionForCandidates(election);
                                                                     setNewCandidate({ name: '', party: '', bio: '' });
                                                                     // Scroll to candidates section
                                                                     setTimeout(() => {
                                                                         document.querySelector('.vs-card.mt-4.vs-slide-down')?.scrollIntoView({ behavior: 'smooth' });
                                                                     }, 100);
                                                                 }}
                                                             >
                                                                 Candidates
                                                             </button>
                                                             <button
                                                                 className="vs-btn vs-btn-action vs-btn-edit vs-btn-xs"
                                                                 onClick={() => {
                                                                     setEditingElection(election);
                                                                     setNewElection({
                                                                         title: election.title,
                                                                         description: election.description || '',
                                                                         start_date: election.start_date,
                                                                         end_date: election.end_date,
                                                                         is_public: !!election.is_public
                                                                     });
                                                                     setShowCreateWrapper(true);
                                                                     window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                 }}
                                                             >
                                                                 Edit
                                                             </button>
                                                             <button
                                                                 className="vs-btn vs-btn-action vs-btn-xs"
                                                                 style={{ background: "rgba(48, 213, 200, 0.1)", color: "#30d5c8", borderColor: "rgba(48, 213, 200, 0.2)" }}
                                                                 onClick={() => fetchResults(election.id)}
                                                             >
                                                                 Results
                                                             </button>
                                                         </div>'''

# Find the elections list actions block
# It's inside the map function
elections_list_start = content.find('{/* ELECTIONS LIST */}')
if elections_list_start != -1:
    list_content = content[elections_list_start:]
    # Find the actions div
    div_start = list_content.find('<div className="vs-flex-gap">')
    if div_start != -1:
        # Find the end of this div in the map
        div_end = list_content.find('</td>', div_start)
        if div_end != -1:
            # We need to find the specific closing </div> before </td>
            actual_div_end = list_content.rfind('</div>', div_start, div_end)
            if actual_div_end != -1:
                # We found the whole block!
                old_actions_block = list_content[div_start:actual_div_end+6]
                content = content.replace(old_actions_block, new_actions_block)

# Fix 3: Standardize the fetchResults URL (just in case)
# Already done but let's be sure
content = content.replace('http://localhost:8000/api/admin/users/', '/api/admin/users/')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully applied precise fixes to AdminPanel.jsx")
