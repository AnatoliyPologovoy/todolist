import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './app/App'
import {Provider} from 'react-redux'
import {store} from './app/store'
import {createHashRouter, RouterProvider,} from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const router = createHashRouter([{ path: '*', Component: App }])

root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>,
)

