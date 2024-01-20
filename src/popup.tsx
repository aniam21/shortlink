import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { changeBackground } from './message_passing';

const Popup = () => {
  const [count, setCount] = useState(0);
  const [timeBetweenWater, setTimeBetweenWater] = useState<number>(10);
  const [timeTillNextDrink, setTimeTillNextDrink] = useState<number>(10);
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    chrome.storage.sync.set({ userDrinked: count });
    setTimeTillNextDrink(timeBetweenWater);
    chrome.alarms.getAll((alarms) => {
      alert(JSON.stringify(alarms));
      if (alarms.length > 1) {
        chrome.alarms.clearAll();
      }
    });
    chrome.action.setIcon({
      path: 'icon.png',
    });
    chrome.alarms.create('timer', { when: Date.now() + timeBetweenWater * 1000, periodInMinutes: 0.5 });
  }, [count]);

  chrome.action.setBadgeText({ text: count.toString() });

  useEffect(() => {
    chrome.storage.sync.set({ timeBetweenWaterIntake: 10 });

    chrome.storage.sync.get(['timer'], (result) => {
      setTimeTillNextDrink(result.timer || 10);
    });
    chrome.storage.sync.get(['userDrinked'], (result) => {
      setCount(result.userDrinked || 0);
    });

    chrome.storage.sync.get(['timeBetweenWaterIntake'], (result) => {
      setTimeBetweenWater(result.timeBetweenWaterIntake || 10);
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  chrome.alarms.onAlarm.addListener((alarm) => {
    console.log(alarm);
    chrome.action.setIcon({
      path: 'error.png',
    });
  });
  return (
    <>
      <ul style={{ minWidth: '700px' }}>
        <li>Current URL: {currentURL}</li>
        <li>Time Till Drink: {timeTillNextDrink}</li>
        <li> {count ? `You drank ${count} cups today!` : "You didn't drink water today!"}</li>
      </ul>
      <button onClick={() => setCount(count + 1)} style={{ marginRight: '5px' }}>
        count up
      </button>
      <button onClick={changeBackground}>change background</button>
    </>
  );
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
