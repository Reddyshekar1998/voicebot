import React from 'react';
import AudioRecorder from './components/AudioRecorder';
import './styles.css';

function App() {
    return (
        <div className="App">
            <h1>Voicebot Call Simulation</h1>
            <AudioRecorder />
        </div>
    );
}

export default App;
