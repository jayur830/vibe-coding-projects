import { useState, useEffect } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday
} from 'date-fns';
import { useWeatherData } from '../hooks/useWeatherData';
import type { Location } from '../types/weather';

export const WeatherCalendar = () => {
  const [currentDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { weatherData, isLoading, error, fetchWeatherData } = useWeatherData();

  // 현재 월의 첫째 날과 마지막 날
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // 캘린더에 표시할 첫째 날과 마지막 날 (주 단위로)
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  // 캘린더에 표시할 모든 날짜들
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // 기본 위치 설정 (서울)
  useEffect(() => {
    const defaultLocation: Location = {
      name: '서울',
      latitude: 37.5665,
      longitude: 126.9780,
      country: 'KR',
    };
    setSelectedLocation(defaultLocation);
    fetchWeatherData(defaultLocation);
  }, [fetchWeatherData]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'snow':
        return '❄️';
      case 'thunderstorm':
        return '⛈️';
      case 'mist':
      case 'fog':
        return '🌫️';
      case 'drizzle':
        return '🌦️';
      default:
        return '☁️';
    }
  };

  return (
    <div data-testid="weather-calendar" className="weather-calendar">
      <header className="calendar-header">
        <h1>
          {currentDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
          })}
        </h1>
        {selectedLocation && (
          <p className="location">📍 {selectedLocation.name}</p>
        )}
        {isLoading && <p className="loading">날씨 정보를 불러오는 중...</p>}
        {error && <p className="error">{error}</p>}
      </header>

      <div data-testid="calendar-grid" className="calendar-grid">
        {/* 요일 헤더 */}
        <div className="weekdays">
          {weekdays.map(day => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        {/* 날짜들 */}
        <div className="days">
          {calendarDays.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const weather = weatherData[dateKey];
            
            return (
              <div
                key={day.toISOString()}
                data-testid={`date-${dateKey}`}
                className={`day ${
                  isSameMonth(day, currentDate) ? 'current-month' : 'other-month'
                } ${isToday(day) ? 'today' : ''}`}
              >
                <span className="date-number">{format(day, 'd')}</span>
                {weather && (
                  <div className="weather-info">
                    <span className="weather-icon">
                      {getWeatherIcon(weather.condition)}
                    </span>
                    <span className="temperature">
                      {Math.round(weather.temperature.current)}°
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 