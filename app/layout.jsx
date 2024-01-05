// import '@styles/globals.css'
// import Head from 'next/head'
// import Nav from '@components/Nav'
// import Provider from '@components/Provider'

// export const metadata = {
//   title: "Promptopia",
//   description: "Discover & Share AI prompts"
// }

// const RootLayout = ({ children }) => {
//   return (
//     <>
//       <Head>
//         <title>{metadata.title}</title>
//         <meta name="description" content={metadata.description} />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <Provider>
//         <div className='main'>
//           <div className='gradient' />
//         </div>

//         <main className='app'>
//           <Nav />
//           {children}
//         </main>
//       </Provider>
//     </>
//   )
// }

export default RootLayout
import '@styles/globals.css'
import Head from 'next/head'
import Nav from '@components/Nav'
import Provider from '@components/Provider'

export const metadata = {
  title: "Promptopia",
  description: "Discover & Share AI prompts"
}

const RootLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
        <html lang="en" />
      </Head>
      <body>
        <Provider>
          <div className='main'>
            <div className='gradient' />
          </div>

          <main className='app'>
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </>
  )
}

export default RootLayout
