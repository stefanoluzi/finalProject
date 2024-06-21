import { Route, Routes } from "react-router-dom"
import { routes } from "../utils/routes"
import { PublicRoute } from "./PublicRoute"
import { PrivateRoute } from "./PrivateRoute"
import { Home } from "../Layouts"
import { Almuerzo, Cena, Desayuno, Detail, Login, Mediatarde, Register } from "../Components"
import AdminPanel from "../Layouts/AdminPanel"
import CrearReceta from "../Components/AdminPanel/gestionRecetas/CrearReceta"
import MyAccount from "../Components/MyAccount"
import Favs from "../Layouts/Favs"
import Planner from "../Layouts/Planner";
import { UserRoute } from "./UserRoute"
import { Categoria } from "../Layouts/Categoria"


export const AppRouter = () => {
  const categoriasRoutes = [
    { path: 'desayuno', nombre: 'Desayuno'},
    { path: 'almuerzo', nombre: 'Almuerzo'},
    { path: 'merienda', nombre: 'Merienda'},
    { path: 'cena', nombre: 'Cena'},
    { path: 'sdadsa', nombre: 'Sdadsa'},
  ]

  return (
    <div className="content"> {/* El contenedor principal para el contenido */}
      <Routes>
        <Route path={routes.home} element={<Home />} />

        {
          categoriasRoutes.map( (categoria, i) =>
            <Route key={i} path={categoria.path} element={<Categoria categoriaNombre={categoria.nombre} />} />
          )
        }

        {/* <Route path={routes.desayuno} element={<Desayuno />} />
        <Route path={routes.almuerzo} element={<Almuerzo />} />
        <Route path={routes.mediatarde} element={<Mediatarde />} /> 
        <Route path={routes.cena} element={<Cena />} /> */}

        <Route path={routes.detail} element={<Detail />} />

        <Route path={routes.myAccount} element={
          <UserRoute>
            <MyAccount/>
          </UserRoute>
        } />
        <Route path={routes.favs} element={
          <UserRoute>
            <Favs/>
          </UserRoute>
        } />

        <Route path={routes.adminPanel} element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        } /> {/* Página panel de admin */}

        <Route path={routes.crearReceta} element={
          <PrivateRoute>
            <CrearReceta />
          </PrivateRoute>
        } /> {/* Página para crear comida */}
        
        <Route path={routes.register} element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }/>

        <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }>
        </Route>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path={routes.planner} element={<Planner/>}/>
      </Routes>
    </div>
  )
}
