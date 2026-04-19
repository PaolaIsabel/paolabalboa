import './Header.css'

interface HeaderProps {
  totalTasks: number
  completedTasks: number
}

function Header({ totalTasks, completedTasks }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <p className="header-badge">Task Manager Paola</p>
          
        <p className="header-text">
          
        </p>
      </div>

      <div className="header-counter">
        <span>{completedTasks}</span> / {totalTasks} completadas
      </div>
    </header>
  )
}

export default Header