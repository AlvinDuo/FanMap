import logo from "./logo.svg"
import "./App.css"
import { useTranslation } from "react-i18next"

function App() {
	const { t, i18n } = useTranslation()

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng)
	}

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
				<div>
					<h1>{t("welcome")}</h1>

					<button onClick={() => changeLanguage("zh")}>中文</button>
					<button onClick={() => changeLanguage("en")}>English</button>
				</div>
			</header>
		</div>
	)
}

export default App
