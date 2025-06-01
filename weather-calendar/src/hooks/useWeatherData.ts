import { useState, useCallback } from 'react';
import type { WeatherData, Location, WeatherCondition } from '../types/weather';
import { format, addDays } from 'date-fns';

interface UseWeatherDataReturn {
  weatherData: Record<string, WeatherData>;
  isLoading: boolean;
  error: string | null;
  fetchWeatherData: (location: Location) => Promise<void>;
}

interface OpenWeatherDailyData {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  humidity: number;
  wind_speed: number;
  pressure: number;
}

interface OpenWeatherResponse {
  daily?: OpenWeatherDailyData[];
}

// OpenWeatherMap 날씨 상태를 우리 타입으로 매핑
const mapWeatherCondition = (weatherMain: string): WeatherCondition => {
  const main = weatherMain.toLowerCase();
  switch (main) {
    case 'clear':
      return 'clear';
    case 'clouds':
      return 'clouds';
    case 'rain':
      return 'rain';
    case 'snow':
      return 'snow';
    case 'thunderstorm':
      return 'thunderstorm';
    case 'mist':
      return 'mist';
    case 'fog':
      return 'fog';
    case 'drizzle':
      return 'drizzle';
    default:
      return 'clouds'; // 기본값
  }
};

// Mock 데이터 생성 함수
const generateMockWeatherData = (location: Location): Record<string, WeatherData> => {
  const weatherMap: Record<string, WeatherData> = {};
  const today = new Date();
  
  // 현재 달의 날씨 데이터 생성 (30일간)
  for (let i = 0; i < 30; i++) {
    const date = addDays(today, i - 15); // 과거 15일 ~ 미래 15일
    const dateKey = format(date, 'yyyy-MM-dd');
    
    // 랜덤하지만 계절에 맞는 날씨 생성
    const month = date.getMonth();
    let condition: WeatherCondition;
    let temperature: number;
    
    // 계절별 날씨 패턴
    if (month >= 11 || month <= 2) { // 겨울
      const conditions: WeatherCondition[] = ['clear', 'clouds', 'snow'];
      condition = conditions[Math.floor(Math.random() * conditions.length)];
      temperature = Math.random() * 10 - 5; // -5°C ~ 5°C
    } else if (month >= 3 && month <= 5) { // 봄
      const conditions: WeatherCondition[] = ['clear', 'clouds', 'rain', 'drizzle'];
      condition = conditions[Math.floor(Math.random() * conditions.length)];
      temperature = Math.random() * 15 + 10; // 10°C ~ 25°C
    } else if (month >= 6 && month <= 8) { // 여름
      const conditions: WeatherCondition[] = ['clear', 'clouds', 'rain', 'thunderstorm'];
      condition = conditions[Math.floor(Math.random() * conditions.length)];
      temperature = Math.random() * 15 + 20; // 20°C ~ 35°C
    } else { // 가을
      const conditions: WeatherCondition[] = ['clear', 'clouds', 'rain'];
      condition = conditions[Math.floor(Math.random() * conditions.length)];
      temperature = Math.random() * 15 + 5; // 5°C ~ 20°C
    }
    
    weatherMap[dateKey] = {
      id: `${location.name}-${dateKey}`,
      date,
      temperature: {
        current: Math.round(temperature),
        min: Math.round(temperature - 3),
        max: Math.round(temperature + 5),
      },
      condition,
      description: getWeatherDescription(condition),
      humidity: Math.round(Math.random() * 40 + 40), // 40-80%
      windSpeed: Math.round(Math.random() * 10 + 1), // 1-11 m/s
      pressure: Math.round(Math.random() * 50 + 1000), // 1000-1050 hPa
    };
  }
  
  return weatherMap;
};

// 날씨 상태별 설명 생성
const getWeatherDescription = (condition: WeatherCondition): string => {
  switch (condition) {
    case 'clear':
      return '맑음';
    case 'clouds':
      return '흐림';
    case 'rain':
      return '비';
    case 'snow':
      return '눈';
    case 'thunderstorm':
      return '천둥번개';
    case 'mist':
      return '안개';
    case 'fog':
      return '안개';
    case 'drizzle':
      return '이슬비';
    default:
      return '흐림';
  }
};

export const useWeatherData = (): UseWeatherDataReturn => {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async (location: Location) => {
    setIsLoading(true);
    setError(null);

    try {
      // 환경변수에서 실제 API 키가 있는지 확인
      const realApiKey = import.meta.env.VITE_WEATHER_API_KEY;
      
      if (realApiKey && realApiKey !== 'demo_key') {
        // 실제 API 호출
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.latitude}&lon=${location.longitude}&appid=${realApiKey}&units=metric&lang=kr`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Weather API request failed');
        }

        const data: OpenWeatherResponse = await response.json();
        
        // API 응답을 WeatherData 형식으로 변환
        const weatherMap: Record<string, WeatherData> = {};
        
        if (data.daily) {
          data.daily.forEach((dailyData: OpenWeatherDailyData) => {
            const date = new Date(dailyData.dt * 1000);
            const dateKey = date.toISOString().split('T')[0];
            
            weatherMap[dateKey] = {
              id: `${location.name}-${dateKey}`,
              date,
              temperature: {
                current: dailyData.temp.day,
                min: dailyData.temp.min,
                max: dailyData.temp.max,
              },
              condition: mapWeatherCondition(dailyData.weather[0].main),
              description: dailyData.weather[0].description,
              humidity: dailyData.humidity,
              windSpeed: dailyData.wind_speed,
              pressure: dailyData.pressure,
            };
          });
        }

        setWeatherData(weatherMap);
      } else {
        // Mock 데이터 사용 (데모 모드)
        console.log('API 키가 없어서 Mock 데이터를 사용합니다.');
        const mockData = generateMockWeatherData(location);
        setWeatherData(mockData);
      }
    } catch (err) {
      console.log('API 호출 실패, Mock 데이터를 사용합니다:', err);
      // API 실패 시에도 Mock 데이터 사용
      const mockData = generateMockWeatherData(location);
      setWeatherData(mockData);
      setError(null); // 에러를 표시하지 않고 Mock 데이터 사용
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    weatherData,
    isLoading,
    error,
    fetchWeatherData,
  };
}; 