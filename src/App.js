import React from 'react'
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom'


import Home from './pages/Home';
import CityList from './pages/CityList';
import MyMap from "./pages/MyMap";
import HouseDetail from "./pages/Housedetail";
import Login from "./pages/Login";
import Registe from "./pages/Registe";
import Rent from "./pages/Rent";
import RentAdd from "./pages/Rent/Add";
import RentSeacth from "./pages/Rent/Search";
import AuthRoute from "./components/AuthRoute";  // 路由访问控制组件




function App() {
  return (
      <Router>
        <div className="App">
          {/* 配置默认路由 */}
          <Route path="/" exact render={() => (<Redirect to="/home" />)} />
          {/*配置路由*/}
          <Route path="/home" component={Home}></Route>
          <Route path="/citylist" component={CityList}></Route>
          <Route path="/map" component={MyMap}></Route>
          <Route path="/detail/:id" component={HouseDetail}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/registe" component={Registe}></Route>

        {/*    登录后才能访问页面*/}
            <AuthRoute exact path="/rent" component={Rent} />
            <AuthRoute path="/rent/add" component={RentAdd} />
            <AuthRoute path="/rent/search" component={RentSeacth} />

        </div>
      </Router>
  );
}

export default App;
