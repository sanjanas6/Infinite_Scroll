import PostList from './Components/NewsList';
import {Routes , Route} from 'react-router-dom'
import Post from './Components/News';


function App() {
  
  return (
    <Routes>
      <Route path='/posts' element={<PostList />} />
      <Route path='/posts/:objectId' element={<Post />} />
    </Routes>
  );
}

export default App;