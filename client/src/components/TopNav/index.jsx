import styles from './TopNav.module.css'

export default function TopNav () {
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
      </div>
    </header>
  )
}
