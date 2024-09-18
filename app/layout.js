import './globals.css'
import SessionProvider from './components/SessionProvider'
import Header from './components/Header'

export default async function RootLayout({ children }) {
  return (
    <html>
      <body className="flex flex-col min-h-screen overflow-hidden bg-gray-200">
        <SessionProvider>
          <Header />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
