import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// ===== SEPARATOR =====

<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/piggy-bank.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Family Allowance Tracker</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>