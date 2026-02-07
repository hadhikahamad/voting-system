import re
import os

file_path = r"c:\Users\HADHIK SMARTY\Desktop\voting-system\resources\js\pages\AdminPanel.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Results button after Edit button
# Matches the Edit button block precisely
edit_btn_pattern = r'(<button\s+className="vs-btn vs-btn-action vs-btn-edit vs-btn-xs"[^>]*>[\s]*Edit[\s]*</button>)'
results_btn = r'\1\n                                                            <button className="vs-btn vs-btn-action vs-btn-xs" style={{ background: "rgba(48, 213, 200, 0.1)", color: "#30d5c8", borderColor: "rgba(48, 213, 200, 0.2)" }} onClick={() => fetchResults(election.id)}>Results</button>'
content = re.sub(edit_btn_pattern, results_btn, content)

# 2. Add Results section after the elections table div
# We anchor on the table closing tag and its parent div closing tag
table_pattern = r'(</table>[\s]*</div>)'
results_section = r'''\1

                            {/* RESULTS SUMMARY SECTION */}
                            {viewingResults && resultsData && (
                                <div className="vs-card mt-4 vs-slide-down" style={{ border: '1px solid rgba(48, 213, 200, 0.3)', background: 'rgba(13, 17, 23, 0.6)' }}>
                                    <div className="vs-flex-between mb-4">
                                        <div>
                                           <h3 className="m-0" style={{ color: '#30d5c8' }}>Real-time Analytics</h3>
                                           <p className="vs-text-muted small">Election Results Detail View</p>
                                        </div>
                                        <button className="vs-btn vs-btn-xs vs-btn-outline" onClick={() => setViewingResults(null)}>Close Results</button>
                                    </div>
                                    <div className="vs-grid-2" style={{ gap: '30px' }}>
                                        <div className="vs-flex-column" style={{ gap: '20px' }}>
                                            {resultsData.results.map(res => (
                                                <div key={res.candidate_id} className="vs-result-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <div className="vs-flex-between mb-2">
                                                        <div className="vs-flex-center gap-2">
                                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                {res.candidate?.photo ? <img src={`/storage/${res.candidate.photo}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                                                            </div>
                                                            <span style={{ fontWeight: 600 }}>{res.candidate?.name}</span>
                                                        </div>
                                                        <span style={{ fontWeight: 700, color: '#30d5c8' }}>{res.votes} votes ({res.percentage}%)</span>
                                                    </div>
                                                    <div className="vs-progress-bg" style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div className="vs-progress-bar" style={{ width: `${res.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #6d5cff, #30d5c8)', borderRadius: '4px' }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="vs-card vs-flex-center" style={{ background: 'rgba(109, 92, 255, 0.05)', border: '1px dashed rgba(109, 92, 255, 0.3)', minHeight: '200px' }}>
                                            <div className="vs-text-center">
                                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#6d5cff', textShadow: '0 0 20px rgba(109, 92, 255, 0.3)' }}>{resultsData.total_votes}</div>
                                                <div className="vs-text-muted" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Total Verified Votes</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}'''
content = re.sub(table_pattern, results_section, content)

# 3. Fix the hardcoded URL
content = content.replace("http://localhost:8000/api/admin/users/", "/api/admin/users/")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated AdminPanel.jsx")
