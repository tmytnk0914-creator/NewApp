import { SCREENS } from '../../constants/screens'
import './Navigation.css'

// 画面切り替えタブ(Overview / Monthly Compare)
const NAV_OPTIONS = [
  { value: SCREENS.OVERVIEW, label: 'Overview' },
  { value: SCREENS.MONTHLY, label: 'Monthly Compare' },
]

function Navigation({ screen, onChangeScreen }) {
  return (
    <nav className="navigation">
      {NAV_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`nav-button ${screen === option.value ? 'active' : ''}`}
          onClick={() => onChangeScreen(option.value)}
        >
          {option.label}
        </button>
      ))}
    </nav>
  )
}

export default Navigation
