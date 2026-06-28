import React, { useState, useEffect, useReducer } from 'react';
import './App.css';
import Chislo from "./components/chislo";

// Импорты изображений
import mita_sleep from './img/mita_sleep.png';
import mita_erl from './img/mita_erl.png';
import mita_glass from './img/mita_glass.png';
import mita_basic from './img/mita_basic.png';
import mita_platok from './img/mita_platok.png';
import mita_kepochka from './img/mita_kepochka.png';
import mita_vizual from './img/mita_vizual.png';
import mita_brain from './img/mita_brain.png';
import mita_melkaya from './img/mita_melkaya.png';
import mita_bad from './img/mita_bad.png';
import mita_shy from './img/mita_shy.png';
import mita_angry from './img/mita_angry.png';

// Reducer для управления событиями
const eventsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_EVENT':
      return { ...state, [action.payload.date]: action.payload.text };
    case 'DELETE_EVENT':
      const newState = { ...state };
      delete newState[action.payload.date];
      return newState;
    default:
      return state;
  }
};

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null); // Выбранный день
  const [events, dispatchEvents] = useReducer(eventsReducer, {}); // Состояние событий
  const [isPolosaVisible, setPolosaVisible] = useState(false); // Видимость блока polosa
  const [typingText, setTypingText] = useState(""); // Текст с эффектом печатания

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель',
    'Май', 'Июнь', 'Июль', 'Август',
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  // Массив с именами изображений для каждого месяца
  const mitaImages = [
    mita_sleep,    // Январь
    mita_erl,      // Февраль
    mita_glass,    // Март
    mita_basic,    // Апрель
    mita_platok,   // Май
    mita_kepochka, // Июнь
    mita_vizual,   // Июль
    mita_brain,    // Август
    mita_melkaya,  // Сентябрь
    mita_bad,      // Октябрь
    mita_shy,      // Ноябрь
    mita_angry     // Декабрь
  ];

  const currentMonth = currentDate.getMonth(); // Индекс текущего месяца (0-11)
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Сохранение событий в localStorage
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  // Загрузка событий из localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      dispatchEvents({ type: 'LOAD_EVENTS', payload: JSON.parse(savedEvents) });
    }
  }, []);

  // Эффект печатания текста
  useEffect(() => {
    if (selectedDay && events[selectedDay]) {
      let index = 0;
      const interval = setInterval(() => {
        setTypingText(events[selectedDay].substring(0, index));
        index++;
        if (index > events[selectedDay].length) {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      setTypingText("");
    }
  }, [selectedDay, events]);

  const handleMonthClick = () => {
    setShowMonthPicker(true);
  };

  const closeModal = () => {
    setShowMonthPicker(false);
  };

  const selectMonth = (monthIndex) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
    closeModal();
  };

  const changeYear = (amount) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + amount);
    setCurrentDate(newDate);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Обработчик выбора дня
  const handleDayClick = (day) => {
    const dateKey = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (selectedDay === dateKey) {
      setSelectedDay(null);
      setPolosaVisible(false);
    } else {
      setSelectedDay(dateKey);
      setPolosaVisible(true);
    }
  };

  // Обработчик добавления события
  const handleAddEvent = () => {
    const text = prompt("Введите текст события:");
    if (text) {
      dispatchEvents({ type: 'ADD_EVENT', payload: { date: selectedDay, text } });
    }
  };

  // Обработчик удаления события
  const handleDeleteEvent = () => {
    dispatchEvents({ type: 'DELETE_EVENT', payload: { date: selectedDay } });
  };

  return (
    <div className="obolochka">
      <div className="verh">
        <div className="god" onClick={handleMonthClick}>
          {monthNames[currentDate.getMonth()]} {currentYear}
        </div>
      </div>

      {showMonthPicker && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="month-picker-modal">
            <div className="modal-header">
              <h3 className='head_zag'>Выберите месяц</h3>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="year-controls">
              <button className="year-arrow" onClick={() => changeYear(-1)}>
                ‹
              </button>
              <span className="current-year">{currentYear}</span>
              <button className="year-arrow" onClick={() => changeYear(1)}>
                ›
              </button>
            </div>

            <div className="month-grid">
              {monthNames.map((month, index) => (
                <div
                  key={month}
                  className={`month-item ${index === currentDate.getMonth() ? 'selected' : ''}`}
                  onClick={() => selectMonth(index)}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Изображение mita */}
      <img 
        src={mitaImages[currentMonth]} 
        className="mita_img" 
        alt="mita" 
      />

      <div className={`polosa ${isPolosaVisible ? 'visible' : ''}`}>
        <div className="content">
          {typingText || (selectedDay && !events[selectedDay] && "Нет событий")}
        </div>
        <div className="controls">
          <button className="add" onClick={handleAddEvent}>+</button>
          <button className="delete" onClick={handleDeleteEvent}>-</button>
        </div>
      </div>
      <div className="kalendar_pole">
        <div className="pole_chisel">
          {dayNumbers.map((day) => {
            const dateKey = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedDay === dateKey;
            const hasEvent = !!events[dateKey];

            // Проверка на сегодняшний день
            const today = new Date();
            const isToday =
              today.getDate() === day &&
              today.getMonth() === currentDate.getMonth() &&
              today.getFullYear() === currentDate.getFullYear();

            return (
              <Chislo
                key={day}
                number={day}
                isSelected={isSelected}
                hasEvent={hasEvent}
                isToday={isToday}
                onClick={() => handleDayClick(day)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;