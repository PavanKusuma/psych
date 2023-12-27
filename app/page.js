import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Vertification from './components/myui/verification'
// import CampusList from './components/myui/campuslist'
import OutingRequest from './components/myui/outingrequest'
import BlockDates from './components/myui/blockdates'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  // const [selectedTab, setSelectedTab] = useState('Projects');

  
  // check sms api
  // async function sendSMS(){

  //   try {
  //     const accountSid = "AC922e697296cd14fe9c8b5eabfc602c41";
  //     const authToken = "82b9092f382438f4514ca5d2dd9b8697";
  //     const client = require('twilio')(accountSid, authToken);

  //     client.messages
  //       .create({
  //         body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
  //         from: '7799813519',
  //         to: '7799813519'
  //       })
  //       .then(message => console.log(message.sid))
  //       .catch(error => console.error(error));

  //   }
  //   catch (error) {
  //     console.log("Error SMS " + error);
  //     console.log("Error " + error);
  //   }
    
    
  // }

// sendSMS()

  return (

    
    <main className={styles.main}>
      <div className={styles.description}>
        
          <Vertification />
          {/* <BlockDates /> */}
          {/* <Dashboard /> */}
          {/* <OutingRequest /> */}
        
      </div>

    
    </main>








   
  )
}


// import Image from 'next/image'
// import Link from 'next/link'
// import {Label} from '../app/components/ui/label'
// import {Input} from '../app/components/ui/input'
// import {Button} from '../app/components/ui/button'

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
//         <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//           Get started by editing&nbsp;
//           <code className="font-mono font-bold">app/page.js</code>
//         </p>
//         <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
//           <a
//             className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
//             href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             By{' '}
//             <Image
//               src="/vercel.svg"
//               alt="Vercel Logo"
//               className="dark:invert"
//               width={100}
//               height={24}
//               priority
//             />
//           </a>
//         </div>
//       </div>

//       <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
//         <Image
//           className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={180}
//           height={37}
//           priority
//         />
//       </div>

//       <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
//         <a
//           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Docs{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Find in-depth information about Next.js features and API.
//           </p>
//         </a>

//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Learn{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Learn about Next.js in an interactive course with&nbsp;quizzes!
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Templates{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Explore starter templates for Next.js.
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Deploy{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Instantly deploy your Next.js site to a shareable URL with Vercel.
//           </p>
//         </a>

        
//       </div>
//       <div className="bg-gray-100 min-h-screen flex items-center justify-center">
//       <div className="max-w-sm rounded-lg shadow-lg bg-white p-6 space-y-6 border border-gray-200 dark:border-gray-700">
//         <div className="space-y-2 text-center">
//           <h1 className="text-3xl font-bold">Login</h1>
//           <p className="text-zinc-500 dark:text-zinc-400">
//             By logging in, you accept our
//             <Link className="text-blue-500 hover:text-blue-700" href="#">
//               terms
//             </Link>
//             and
//             <Link className="text-blue-500 hover:text-blue-700" href="#">
//               privacy policy
//             </Link>
//             .{"\n                            "}
//           </p>
//         </div>
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" placeholder="m@example.com" required type="email" />
//           </div>
//           <div className="flex items-center space-x-2">
//             <hr className="flex-grow border-zinc-200 dark:border-zinc-700" />
//             <span className="text-zinc-400 dark:text-zinc-300 text-sm">OR</span>
//             <hr className="flex-grow border-zinc-200 dark:border-zinc-700" />
//           </div>
//           <Button className="w-full bg-[#4285F4] text-white" variant="outline">
//             <div className="flex items-center justify-center">
//               {/* <ChromeIcon className="w-5 h-5 mr-2" /> */}
//               Login with Google
//             </div>
//           </Button>
//           <Button className="w-full bg-black text-white" variant="outline">
//             <div className="flex items-center justify-center">
//               {/* <AppleIcon className="w-5 h-5 mr-2" /> */}
//               Login with Apple
//             </div>
//           </Button>
//         </div>
//       </div>
//     </div>
//     </main>
//   )
// }
