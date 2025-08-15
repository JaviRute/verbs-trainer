import React, { useState, useEffect } from 'react';
import Spanish from './SpanishApp';
import French from './FrenchApp';
import './App.css';

function App() {
  const [language, setLanguage] = useState("");

  useEffect(() => {
    // Parse the query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const lang = queryParams.get('language');
    
    // If a language is specified in the URL, set it as the initial state
    if (lang) {
      setLanguage(lang);
    }
  }, []);

  return (
    <div className="App">
      {language === "" && (
        <div className='flag-container'>
          <div className="spanish-flag" onClick={() => setLanguage("Spanish")}>
            <div className='one'></div>
            <div className='two'></div>
            <div className='three'></div>
          </div>
          <div className="french-flag" onClick={() => setLanguage("French")}>
            <div className='one'></div>
            <div className='two'></div>
            <div className='three'></div>
          </div>
        </div>
      )}

      {language === "Spanish" && <Spanish />}
      {language === "French" && <French />}
    </div>
  );
}

export default App;