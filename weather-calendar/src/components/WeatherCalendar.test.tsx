import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherCalendar } from './WeatherCalendar';

describe('WeatherCalendar 컴포넌트', () => {
  test('컴포넌트가 렌더링된다', () => {
    render(<WeatherCalendar />);
    expect(screen.getByTestId('weather-calendar')).toBeInTheDocument();
  });

  test('현재 월이 표시된다', () => {
    render(<WeatherCalendar />);
    const currentMonth = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
    });
    expect(screen.getByText(currentMonth)).toBeInTheDocument();
  });

  test('캘린더 그리드가 표시된다', () => {
    render(<WeatherCalendar />);
    expect(screen.getByTestId('calendar-grid')).toBeInTheDocument();
  });
}); 