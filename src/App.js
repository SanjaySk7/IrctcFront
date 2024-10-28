import React from 'react';
import { BrowserRouter} from 'react-router-dom';
import './App.css';
import MainContent from './MainContent';

const App = () => {
    return (
        <BrowserRouter>
            <MainContent />
        </BrowserRouter>
    );
};

export default App;
