import React, { useState, useEffect, useRef } from 'react';

const ModernDatePicker = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust for Mon-Sun week
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        const newDate = value ? new Date(value) : new Date();
        newDate.setFullYear(viewDate.getFullYear());
        newDate.setMonth(viewDate.getMonth());
        newDate.setDate(day);

        // Use local ISO format for consistency with datetime-local
        const offset = newDate.getTimezoneOffset();
        const localDate = new Date(newDate.getTime() - (offset * 60 * 1000));
        onChange(localDate.toISOString().slice(0, 16));
        setIsOpen(false);
    };

    const handleTimeChange = (type, val) => {
        const newDate = value ? new Date(value) : new Date();
        if (type === 'hour') newDate.setHours(parseInt(val));
        if (type === 'minute') newDate.setMinutes(parseInt(val));

        const offset = newDate.getTimezoneOffset();
        const localDate = new Date(newDate.getTime() - (offset * 60 * 1000));
        onChange(localDate.toISOString().slice(0, 16));
    };

    const renderDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Padding for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        const selected = value ? new Date(value) : null;

        for (let d = 1; d <= daysInMonth; d++) {
            const isSelected = selected &&
                selected.getDate() === d &&
                selected.getMonth() === month &&
                selected.getFullYear() === year;
            days.push(
                <div
                    key={d}
                    className={`calendar-day ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDateClick(d)}
                >
                    {d}
                </div>
            );
        }
        return days;
    };

    const displayValue = value ? new Date(value).toLocaleString([], {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : 'Select Date & Time';

    return (
        <div className="vs-input-group" ref={containerRef} style={{ zIndex: isOpen ? 1005 : 1 }}>
            {label && <label className="vs-label">{label}</label>}
            <div className={`vs-custom-picker ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <span className="picker-value">{displayValue}</span>
                <span className="picker-icon"><i className="fa-solid fa-calendar-days"></i></span>
            </div>

            {isOpen && (
                <div className="modern-calendar-popup">
                    <div className="calendar-header">
                        <button type="button" onClick={(e) => { e.stopPropagation(); handlePrevMonth(); }} className="nav-btn">‹</button>
                        <div className="month-year">
                            {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleNextMonth(); }} className="nav-btn">›</button>
                    </div>

                    <div className="weekdays-row">
                        {weekdays.map(w => <div key={w}>{w}</div>)}
                    </div>

                    <div className="days-grid">
                        {renderDays()}
                    </div>

                    <div className="time-picker-row">
                        <div className="time-select">
                            <label>H</label>
                            <input
                                type="number" min="0" max="23"
                                value={value ? new Date(value).getHours() : 0}
                                onChange={(e) => handleTimeChange('hour', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="time-separator">:</div>
                        <div className="time-select">
                            <label>M</label>
                            <input
                                type="number" min="0" max="59"
                                value={value ? new Date(value).getMinutes() : 0}
                                onChange={(e) => handleTimeChange('minute', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .vs-input-group {
                    position: relative;
                    z-index: 1;
                }
                /* Ensure active input group is on top of others */
                .vs-input-group:focus-within {
                    z-index: 1001;
                }

                .vs-custom-picker {
                    width: 100%;
                    padding: 12px 16px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s;
                }
                .vs-custom-picker:hover {
                    border-color: rgba(109, 92, 255, 0.4);
                    background: rgba(255,255,255,0.08);
                }
                .vs-custom-picker.active {
                    border-color: #6d5cff;
                    box-shadow: 0 0 15px rgba(109, 92, 255, 0.2);
                }

                .modern-calendar-popup {
                    position: absolute;
                    top: calc(100% + 12px);
                    left: 0;
                    width: 320px;
                    background: #121212 !important; /* Premium Black Theme */
                    color: #ffffff !important;
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05);
                    z-index: 2000 !important;
                    animation: slideDownFade 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    backdrop-filter: blur(20px) !important;
                    -webkit-backdrop-filter: blur(20px) !important;
                }
                @keyframes slideDownFade {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                }
                .nav-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #6d5cff;
                    cursor: pointer;
                    padding: 0 10px;
                    transition: transform 0.2s;
                }
                .nav-btn:hover {
                    color: #8b5cf6;
                    transform: scale(1.2);
                }
                .month-year {
                    color: #6d5cff;
                    font-weight: 900;
                    font-size: 1.5rem;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    text-shadow: 0 0 10px rgba(109, 92, 255, 0.3);
                }

                .weekdays-row {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    text-align: center;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .weekdays-row div {
                    color: #30d5c8;
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                }

                .days-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 4px;
                }
                .calendar-day {
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 0.95rem;
                    font-weight: 500;
                    border-radius: 12px;
                    transition: all 0.2s;
                    color: rgba(255,255,255,0.7);
                }
                .calendar-day:hover:not(.empty):not(.selected) {
                    background: rgba(109, 92, 255, 0.1);
                    color: #6d5cff;
                    transform: scale(1.05);
                }
                .calendar-day.selected {
                    background: #30d5c8;
                    color: #000;
                    font-weight: 700;
                    box-shadow: 0 0 20px rgba(48, 213, 200, 0.4);
                }
                .calendar-day.empty {
                    cursor: default;
                }

                .time-picker-row {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 15px;
                }
                .time-select {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .time-select label {
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.3);
                    font-weight: 800;
                }
                .time-select input {
                    width: 55px;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    padding: 8px 5px;
                    text-align: center;
                    font-weight: 700;
                    color: #fff;
                    font-size: 1rem;
                    background: rgba(255,255,255,0.03);
                }
                .time-select input:focus {
                    outline: none;
                    border-color: #6d5cff;
                    background: rgba(109, 92, 255, 0.1);
                }
                .time-separator {
                    font-weight: 900;
                    color: rgba(255,255,255,0.1);
                    font-size: 1.2rem;
                }
            `}</style>
        </div>
    );
};

export default ModernDatePicker;
