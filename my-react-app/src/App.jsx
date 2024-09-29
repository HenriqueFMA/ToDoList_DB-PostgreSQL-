import { useState } from 'react';
import Card from './components/card'; 
import  Img from './images/pikaso_texttoimage_produce-a-background-filled-with-a-gradient-of-dar.jpeg'


function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='relative w-[100%] h-[100%] bg-zinc-900'>
      <img src={Img} alt="My Example" className='w-[100%] h-[45%]' />
      
      {/* Card posicionado sobre a imagem */}
      
        <Card />
     
    </div>
  );
}

export default App;
