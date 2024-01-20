/*
 *   Copyright (c) 2023 R3BL LLC
 *   All rights reserved.
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

import React, { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"

const Options = () => {
  const [status, setStatus] = useState<string>("")
  const [desiredWaterIntake, setDesiredWaterIntake] = useState<number>(9);
  const [timeBetweenWater, setTimeBetweenWater] = useState<number>(30);
  const [like, setLike] = useState<boolean>(false)

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      {
        desiredWaterIntake: 9,
        timeBetweenWaterIntake: 30,
      },
      (items) => {
        setDesiredWaterIntake(items.desiredWaterIntake)
        setTimeBetweenWater(items.timeBetweenWaterIntake)
      }
    )

  }, [])

  const saveWaterOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        desiredWaterIntake,
        timeBetweenWaterIntake: timeBetweenWater,
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("Options saved.")
        const id = setTimeout(() => {
          setStatus("")
        }, 1000)
        return () => clearTimeout(id)
      }
    )
  };

  return (
    <>
      <div>
        Desired Water Intake:{" "}
        <select value={desiredWaterIntake} onChange={(event) => setDesiredWaterIntake((+event.target.value) || 9)}>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
          <option value={11}>11</option>
        </select>
      </div>
      <div>
        Breaks:{" "}
        <select value={timeBetweenWater} onChange={(event) => setTimeBetweenWater((+event.target.value) || 30)}>
          <option value={30}>30 mins</option>
          <option value={45}>45 mins</option>
          <option value={60}>1 Hour :/</option>
          <option value={75}>1 Hour and 15 Mins :///</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={like}
            onChange={(event) => setLike(event.target.checked)}
          />
          I like Water.
        </label>
      </div>
      <div>{status}</div>
      <button onClick={saveWaterOptions}>Save</button>
    </>
  )
}

const root = createRoot(document.getElementById("root")!)

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
)
