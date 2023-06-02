import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        {/* Content of your page goes here */}
      </div>
      <footer style={{ lineHeight: '30px', textAlign: 'center', color: 'white', backgroundColor: 'black', width: '100%' , marginLeft:0, marginRight:0}}>
        <Link to={'/'}><p>MovieGram</p></Link>
        <Link to={'/feedback'}><p>Feedback</p></Link>
      </footer>
    </div>
  );
}

