import { SyncContextProvider } from '@robojs/sync'
import { DiscordContextProvider } from '../hooks/useDiscordSdk'
import { Activity } from './Activity'
import './App.css'

export default function App() {
	return (
		<DiscordContextProvider authenticate scope={['identify', 'guilds']} loadingScreen={<div>Loading...</div>}>
			<SyncContextProvider>
				<Activity />
			</SyncContextProvider>
		</DiscordContextProvider>
	)
}