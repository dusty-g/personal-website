//nav bar component
import styles from '../styles/Nav.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'



export default function Nav() {
    const router = useRouter()
    return (
        <nav>
        <ul className={styles.nav}>
          <Link href="/"><li className={router.pathname != '/' ? styles.inactive : styles.active}>Home</li></Link>
          <Link href="/about"><li className={router.pathname != '/about' ? styles.inactive : styles.active}>About</li></Link>
          <Link href="/projects"><li className={router.pathname != '/projects' ? styles.inactive : styles.active}>Projects</li></Link>
          {/* <Link href="/blog"><li className={router.pathname != '/blog' ? styles.inactive : styles.active}>Blog</li></Link> */}
          <Link href="/contact"><li className={router.pathname != '/contact' ? styles.inactive : styles.active}>Contact</li></Link>
        </ul>
      </nav>
    )
}