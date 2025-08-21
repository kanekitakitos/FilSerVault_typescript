import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Movies from './movies';
import Series from './series';
import Login from './login';
import Register from './register';
import Home from './home';
import Profile from './profile';




/**
 * Componente principal da aplicação que configura as rotas usando React Router.
 * @component
 * @returns {JSX.Element} O componente AppBase.
 */
export default function App()
{

	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route index element={<Home />} />
					<Route path="/series" element={<Series />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/movies" element={<Movies />} />
					<Route path="/profile" element={<Profile />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}


