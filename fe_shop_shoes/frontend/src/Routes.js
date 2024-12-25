import Loading from 'views/Loading';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from 'core';
import { Main as MainLayout, Minimal as MinimalLayout } from 'layouts';
import { PrivateRoute, PublicRoute } from 'components';
import Admin from 'views/Admin/Admin';
import UserDetails from 'views/UserDetails/UserDetail';

const HomeView = lazy(() => import('views/Home'));
const LoginView = lazy(() => import('views/Login'));
const NotFoundView = lazy(() => import('views/NotFound'));
const RegisterView = lazy(() => import('views/Register'));
const ProductDetailsView = lazy(() => import('views/ProductDetails'));
const CartView = lazy(() => import('views/Cart'));
const CheckoutView = lazy(() => import('views/Checkout'));
const OrderView = lazy(() => import('views/Order'));
const FavouritesView = lazy(() => import('views/Favourites'));
const ProductList = lazy(() => import('views/Home/components/ProductList'));
const AdminView = lazy(() => import('views/Admin'));
const AllProducts = lazy(() => import('views/Admin/components/AllProduct/AllProducts'));
const AllUsers = lazy(() => import('views/Admin/components/AllUsers/AllUsers'));
const AllOrder = lazy(() => import('views/Admin/components/AllOrder/AllOrder'));
const Dashboard = lazy(() => import('views/Admin/components/Dashboard/Dashboard'));
const ProductFormUpdate = lazy(() => import('views/Admin/components/AllProduct/ProductFormUpdate/ProductFormUpdate'));
const UserDetai = lazy(() => import('views/UserDetails/UserDetail'));
const ProductSearch = lazy(() => import('views/ProductSearch/ProductSearch'));
const ProductAdd = lazy(() => import('views/Admin/components/AllProduct/ProductForm/ProductForm'));
const AllCategories = lazy(() => import('views/Admin/components/AllCategory/AllCategory')); // Add the route for AllCategories
const ListReview = lazy(() => import('views/Admin/components/AllProduct/ListReview/ListReview'));

export const PageURLs = {
  Login: '/login',
  NotFound: '/404',
  Register: '/register',
  ProductDetails: '/product-detail/:id',
  Cart: '/cart',
  Checkout: '/checkout',
  Order: '/order',
  Favourites: '/favourites',
  // ProductList: '/product-list', // Add the route for the product list
  Admin: '/admin',
  AllProducts: '/admin/products/all',
  AllUsers: '/admin/users',
  AllOrder: '/admin/orders',
  Dashboard: '/admin/dashboard',
  UserDetails: '/user-details',
  ProductSearch: '/product-search',
  ProductAdd : '/admin/products/add',
  AllCategories: '/admin/categories',
  ListReview: '/admin/products/reviews',
};

const RoutesComponent = () => {
  const { loadingAuth } = useAuth();

  return !loadingAuth ? (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            index
            element={
              <PrivateRoute>
                <HomeView />
              </PrivateRoute>
            }
          />
          <Route
            path={PageURLs.ProductDetails}
            element={
              <PrivateRoute>
                <ProductDetailsView />
              </PrivateRoute>
            }
          />
          <Route
            path={PageURLs.Cart}
            element={
              <PrivateRoute>
                <CartView />
              </PrivateRoute>
            }
          />
          <Route
            path={PageURLs.Checkout}
            element={
              <PrivateRoute>
                <CheckoutView />
              </PrivateRoute>
            }
          />
          <Route
            path={`${PageURLs.Order}`}
            element={
              <PrivateRoute>
                <OrderView />
              </PrivateRoute>
            }
          />
          <Route
            path={PageURLs.UserDetails} // Add the new route
            element={
              <PrivateRoute>
                <UserDetai />
              </PrivateRoute>
            }
          />
          <Route
            path={PageURLs.Favourites}
            element={
              <PrivateRoute>
                <FavouritesView />
              </PrivateRoute>
            }
          />
          <Route
            path={PageURLs.ProductSearch} // Add the new route
            element={

              <ProductSearch />

            }
          />
          
        </Route>
        <Route path="*" element={<NotFoundView />} />
        <Route path="/" element={<MinimalLayout />}>
          <Route
            path={PageURLs.Login}
            element={
              <PublicRoute>
                <LoginView />
              </PublicRoute>
            }
          />
          <Route
            path={PageURLs.Register}
            element={
              <PublicRoute>
                <RegisterView />
              </PublicRoute>
            }
          />
          <Route path="/admin" element={<Admin />}>
            <Route path="products/all" element={<AllProducts />} />
            <Route path="products/details/:id" element={<ProductFormUpdate />} />
            <Route path="users" element={<AllUsers />} />
            <Route path="orders" element={<AllOrder />} />
            <Route path="dashboard" element={<Dashboard />}/>
            <Route path="products/add" element={<ProductAdd />}/>
            <Route path="categories" element={<AllCategories />} />
            <Route path="products/reviews" element={<ListReview />} />
            {/* Các route khác */}
          </Route>


        </Route>


      </Routes>
    </Suspense>
  ) : (
    ''
  );
};

export default RoutesComponent;
