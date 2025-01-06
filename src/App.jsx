import React, { useState, useEffect } from 'react';
import { FaHome, FaChartBar, FaCog, FaPlay, FaPause, FaStop } from 'react-icons/fa';

const timeOptions = [5, 10, 15, 20, 25, 30, 45, 60];

function FlipNumber({ value }) {
  const paddedValue = value.toString().padStart(2, '0');
  return (
    <div className="flip-unit">
      <span className="flip-number">{paddedValue}</span>
    </div>
  );
}

function App() {
  const [duration, setDuration] = useState(20);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [intervals, setIntervals] = useState([]);

  useEffect(() => {
    // Calculate intervals when duration changes
    const intervalCount = 4;
    const newIntervals = Array.from({ length: intervalCount }, (_, i) => 
      Math.round((duration / intervalCount) * (i + 1))
    );
    setIntervals(newIntervals);
  }, [duration]);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          const newTime = prev - 1;
          // Check if current time matches any interval
          if (intervals.includes(Math.ceil(newTime / 60))) {
            // Play bell sound here
            console.log('Bell at interval:', Math.ceil(newTime / 60));
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, intervals]);

  const startTimer = () => {
    if (timeLeft === null || timeLeft === 0) {
      setTimeLeft(duration * 60);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  const minutes = timeLeft === null ? duration : Math.floor(timeLeft / 60);
  const seconds = timeLeft === null ? 0 : timeLeft % 60;

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full py-16 mb-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white/90 mb-12">Meditation Timer</h1>
        
        <div className="flip-clock mb-12">
          <FlipNumber value={Math.floor(minutes / 10)} />
          <FlipNumber value={minutes % 10} />
          <span className="separator">:</span>
          <FlipNumber value={Math.floor(seconds / 10)} />
          <FlipNumber value={seconds % 10} />
        </div>

        <div className="flex justify-center space-x-6">
          {!isRunning && (
            <button
              onClick={startTimer}
              className="control-button bg-white/90 text-purple-700 p-6 rounded-full shadow-lg"
            >
              <FaPlay className="w-8 h-8" />
            </button>
          )}
          {isRunning && (
            <button
              onClick={pauseTimer}
              className="control-button bg-yellow-400/90 text-yellow-900 p-6 rounded-full shadow-lg"
            >
              <FaPause className="w-8 h-8" />
            </button>
          )}
          {(timeLeft !== null && timeLeft !== duration * 60) && (
            <button
              onClick={stopTimer}
              className="control-button bg-red-500/90 text-white p-6 rounded-full shadow-lg"
            >
              <FaStop className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-md space-y-8 px-4 mb-24">
        <div className="glass-panel">
          <h2 className="text-xl font-semibold text-white/90 mb-4">Interval Bells</h2>
          <div className="text-white/80 mb-4">
            Bells will ring at: {intervals.join(', ')} minutes
          </div>
        </div>

        <div className="glass-panel">
          <h2 className="text-xl font-semibold text-white/90 mb-4">Duration</h2>
          <div className="duration-grid">
            {timeOptions.map(time => (
              <button
                key={`duration-${time}`}
                className={`time-button ${duration === time ? 'active' : 'inactive'}`}
                onClick={() => {
                  setDuration(time);
                  if (!isRunning) {
                    setTimeLeft(null);
                  }
                }}
              >
                {time} Min
              </button>
            ))}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 w-full bg-white/10 backdrop-blur-lg border-t border-white/20">
        <div className="max-w-md mx-auto flex justify-around p-4">
          <button className="text-white/90 hover:text-white transition-colors">
            <FaHome className="w-6 h-6" />
          </button>
          <button className="text-white/50 hover:text-white/70 transition-colors">
            <FaChartBar className="w-6 h-6" />
          </button>
          <button className="text-white/50 hover:text-white/70 transition-colors">
            <FaCog className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
