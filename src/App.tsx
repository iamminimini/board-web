import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Users from './pages/Users';
import Board from './pages/Board';
import TodoList from './pages/TodoList';
import Button from '@atlaskit/button/new';
// 페이지 컴포넌트

function App() {
  return (
    <Router>
      <div>
        <h1>작업/할일 관리 대시보드</h1>
        {/* 주소 이동을 위한 버튼 */}
        <div>
          <Link to='/'>
            <Button>게시글</Button>
          </Link>
          <Link to='/users'>
            <Button>유저 관리</Button>
          </Link>
          <Link to='/todo-list'>
            <Button>투두 리스트</Button>
          </Link>
        </div>
        <Switch>
          <Route exact path='/' component={Board} />
          <Route path='/users' component={Users} />
          <Route path='/todo-list' component={TodoList} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
