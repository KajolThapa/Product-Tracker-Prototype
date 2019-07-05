import React, { Component } from 'react';
// import './app.css';
// import ReactImage from './react.png';
import WebcamCapture from './WebcamCapture';
import ListCollection from './ListCollection';
export default class App extends React.Component {
    render() {
        return <div>
            <WebcamCapture/>
            <ListCollection/>
        </div>
    }
}