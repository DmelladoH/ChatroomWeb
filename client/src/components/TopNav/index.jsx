import styles from './TopNav.module.css'
import useLogin from '../../hooks/useLogin'

export default function TopNav () {
  const { logout } = useLogin()

  const logoutAction = () => {
    logout()
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <h1>logo</h1>
        </div>
        <div className={styles.searchBarContainer}>
          buscador
        </div>
        <div className={styles.userContainer}>
          user
        </div>
        <button onClick={logoutAction}>log out</button>
      </div>
    </header>
  )
}
