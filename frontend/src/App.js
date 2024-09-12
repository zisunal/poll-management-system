import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Home from './screens/Home'
import Login from './screens/Login'
import Result from './screens/Result'
import Error404 from './screens/Error404'
import AdminHome from './screens/Admin/AdminHome'
import AdminFinished from './screens/Admin/AdminFinished'
import AdminNotStarted from './screens/Admin/AdminNotStarted'
import AdminCreate from './screens/Admin/AdminCreate'
import AdminProfile from './screens/Admin/AdminProfile'

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route exact path='/' element={<Home/>} />
					<Route exact path='/login' element={<Login/>} />
					<Route exact path='/result' element={<Result/>} />
					<Route exact path='/admin' element={<AdminHome/>} />
					<Route exact path='/admin/finished' element={<AdminFinished/>} />
					<Route exact path='/admin/not-started' element={<AdminNotStarted/>} />
					<Route exact path='/admin/create' element={<AdminCreate/>} />
					<Route exact path='/admin/profile' element={<AdminProfile/>} />
					<Route path='*' element={<Error404/>} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
