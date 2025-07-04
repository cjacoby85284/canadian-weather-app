import { useState, useEffect } from 'react'
import './App.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { canadianCities, type City } from '@/data/canadian-cities'
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, Thermometer } from 'lucide-react'

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      if (selectedCity) {
        const now = new Date()
        const options: Intl.DateTimeFormatOptions = {
          timeZone: selectedCity.timezone,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
        setCurrentTime(now.toLocaleString('en-CA', options))
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [selectedCity])

  // Fetch weather when city changes
  useEffect(() => {
    if (selectedCity) {
      fetchWeather(selectedCity)
    }
  }, [selectedCity])

  const fetchWeather = async (city: City) => {
    setLoading(true)
    setError(null)
    
    try {
      // Using OpenWeatherMap API (you'll need to sign up for a free API key)
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo'
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`
      )
      
      if (!response.ok) {
        throw new Error('Weather data not available')
      }
      
      const data = await response.json()
      setWeather({
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        icon: data.weather[0].icon
      })
    } catch (err) {
      setError('Unable to fetch weather data. Please try again later.')
      // Set mock data for demo purposes
      setWeather({
        temperature: Math.round(Math.random() * 30 - 10),
        description: 'Partly cloudy',
        humidity: Math.round(Math.random() * 50 + 40),
        windSpeed: Math.round(Math.random() * 20 + 5),
        icon: '02d'
      })
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <Sun className="h-12 w-12 text-yellow-500" />
    if (iconCode.includes('02') || iconCode.includes('03')) return <Cloud className="h-12 w-12 text-gray-400" />
    if (iconCode.includes('04')) return <Cloud className="h-12 w-12 text-gray-600" />
    if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain className="h-12 w-12 text-blue-500" />
    if (iconCode.includes('13')) return <CloudSnow className="h-12 w-12 text-blue-300" />
    return <Sun className="h-12 w-12 text-yellow-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">
          Canadian Weather & Time
        </h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select a City</CardTitle>
            <CardDescription>
              Choose from major Canadian cities with 100,000+ residents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedCity?.name}
              onValueChange={(value) => {
                const city = canadianCities.find(c => c.name === value)
                setSelectedCity(city || null)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a city..." />
              </SelectTrigger>
              <SelectContent>
                {canadianCities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}, {city.province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedCity && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedCity.name}, {selectedCity.province}</span>
                  {weather && getWeatherIcon(weather.icon)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-gray-700 mb-2">
                  {currentTime}
                </div>
                
                {loading && (
                  <div className="text-center py-4 text-gray-500">
                    Loading weather data...
                  </div>
                )}
                
                {weather && !loading && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5 text-red-500" />
                        <span className="text-lg">Temperature</span>
                      </div>
                      <span className="text-2xl font-bold">{weather.temperature}°C</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg capitalize">{weather.description}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <span>Humidity</span>
                      </div>
                      <span>{weather.humidity}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-gray-500" />
                        <span>Wind Speed</span>
                      </div>
                      <span>{weather.windSpeed} km/h</span>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

export default App
