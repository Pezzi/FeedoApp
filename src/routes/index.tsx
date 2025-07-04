// src/routes/index.tsx

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Dashboard } from '../pages/Dashboard'
import { CreateQRCode } from '../pages/CreateQRCode' 
import { AccountSettingsPage } from '../pages/AccountSettingsPage'
import { ProfilePage } from '../pages/ProfilePage'; 

// 1. Importar o componente que faltava
import { QRCodes } from '../pages/QRCodes' 

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          {/* 2. Usar o nome correto do componente aqui */}
          <Route path="/qr-codes" element={<QRCodes />} />
          <Route path="/qr-codes/create" element={<CreateQRCode />} />
          <Route path="/settings" element={<AccountSettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}