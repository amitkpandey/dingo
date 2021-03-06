import React, { Component } from 'react';
import { Text, View, Image, TouchableNativeFeedback, Dimensions } from 'react-native';
import { MiniPlayerProgressBar } from './MiniPlayerProgressBar';
import TrackPlayer from 'react-native-track-player';
import {settings} from "../../../BL/Database/settings"

const { width, height } = Dimensions.get('window');

export class MiniPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			position: 0,
			bufferedPosition: 0,
			duration: 0,
		};

		this.AppInstance = this.props.AppInstance;
	}

	componentDidMount() {
		this._progressUpdates = true;
		this._updateProgress();
		this._timer = setInterval(this._updateProgress.bind(this), 1000);
	}

	componentWillUnmount() {
		this._progressUpdates = false;
		clearInterval(this._timer);
	}

	async _updateProgress() {
		try {
			const data = {
				position: await TrackPlayer.getPosition(),
				bufferedPosition: await TrackPlayer.getBufferedPosition(),
				duration: await TrackPlayer.getDuration(),
				track: await TrackPlayer.getTrack(await TrackPlayer.getCurrentTrack()),
			};

			if (this._progressUpdates) {
				this.setState(data);
			}
		} catch (e) {
			// The player is probably not initialized yet, we'll just ignore it
		}
	}

	getProgress() {
		if (!this.state.duration || !this.state.position) return 0;

		return this.state.position / this.state.duration;
	}

	getBufferedProgress() {
		if (!this.state.duration || !this.state.bufferedPosition) return 0;

		return this.state.bufferedPosition / this.state.duration;
	}

	getCurrentTrack() {
		const currentTrack = this.AppInstance.state.screenStates_screenPlayerStates_pageQueueStates_tracksInQueue[this.AppInstance.state
														.screenStates_screenPlayerStates_pageQueueStates_playingQueueIndex]
		return currentTrack;
	}

	render() {
		const AppInstance = this.AppInstance;

		const track = this.getCurrentTrack();
		return track ? (
			<View style={{ ...this.props.style }}>
				<TouchableNativeFeedback
					onPress={() => {
						AppInstance.setState({
							activeScreen: 'SCREEN_PLAYER',
							screenStates_screenNavigatorStates_newQueueItems: [],
						});
					}}
				>
					<View
						style={{
							width: width,
							height: 55,
							backgroundColor: 'white',
						}}
					>
						<View
							style={{
								height: 50,
								backgroundColor: '#fafafa',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Image
								style={{
									height: 50,
									width: 50,
								}}
								source={{
									uri: settings.get('load_all_images') && track.artwork,
								}}
							/>

							<View
								style={{
									marginHorizontal: 10,
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									flex: 1,
								}}
							>
								<Text
									numberOfLines={1}
									ellipsizeMode={'tail'}
									style={{
										color: 'black',
									}}
								>
									{track.title}
								</Text>

								<Text numberOfLines={1} ellipsizeMode={'tail'} style={{}}>
									{track.artist}
								</Text>
							</View>
						</View>
					</View>
				</TouchableNativeFeedback>
			</View>
		) : null;
	}
}
