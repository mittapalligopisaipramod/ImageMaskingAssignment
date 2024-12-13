import {BrowserRouter,Routes,Route} from 'react-router-dom'
import LandingPage from './components/LandingPage'
import PlayingPage from './components/PlayingPage'

const App=()=>{
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/home' element={<PlayingPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App