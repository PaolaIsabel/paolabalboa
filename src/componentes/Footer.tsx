import './Footer.css'

interface FooterProps {
  totalTasks: number
  completedTasks: number
}

function Footer({ totalTasks, completedTasks }: FooterProps) {
  return (
    <footer className="footer">
      <p>
        Total: <strong>{totalTasks}</strong> | Completadas:{' '}
        <strong>{completedTasks}</strong>
      </p>
    </footer>
  )
}

export default Footer