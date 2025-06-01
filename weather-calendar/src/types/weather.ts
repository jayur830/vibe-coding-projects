// 날씨 상태 타입
export type WeatherCondition = 
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'mist'
  | 'fog'
  | 'drizzle';

// 날씨 정보 타입
export interface WeatherData {
  id: string;
  date: Date;
  temperature: {
    current: number;
    min: number;
    max: number;
  };
  condition: WeatherCondition;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

// 위치 정보 타입
export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

// 캘린더 날짜 타입
export interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  weather?: WeatherData;
}

// 캘린더 상태 타입
export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  location: Location | null;
  isLoading: boolean;
  error: string | null;
}

// 캘린더 액션 타입
export type CalendarAction =
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SET_SELECTED_DATE'; payload: Date | null }
  | { type: 'SET_LOCATION'; payload: Location | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }; 