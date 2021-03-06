import React from 'react';
import { FlatList, Image, Text, TouchableNativeFeedback, View } from 'react-native';
import utils from './../../BL/Utils/utils';
import {settings} from "../../BL/Database/settings"
export class AlbumInfoPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			albumInfo: null,
			albumTracks: null,
		};
	}

	componentDidMount = () => {
		utils.fetchFromEndpoint(
			`albumInfo?artistName=${encodeURIComponent(this.props.album.artistName)}&name=${encodeURIComponent(
				this.props.album.name
			)}`,
			response => {
				this.setState({
					albumInfo: response,
					albumTracks: response.tracks,
				});
			}
		);
	};
	render() {
		const AppInstance = this.props.AppInstance;
		return (
			<View>
				<View
					style={{
						backgroundColor: 'white',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Image
						style={{
							width: 100,
							height: 100,
							backgroundColor: '#ddd',
						}}
						source={{
							uri:
								settings.get('load_all_images') &&
								(this.state.albumInfo
									? this.state.albumInfo.images[this.state.albumInfo.images.length - 1]
									: null),
						}}
					/>
					<Text
						style={{
							fontWeight: 'bold',
							margin: 50,
						}}
					>
						{this.props.album.artistName + ': ' + this.props.album.name}
					</Text>
				</View>

				<Text
					style={{
						margin: 10,
					}}
				>
					Tracks
				</Text>

				<FlatList
					keyExtractor={(item, index) => index.toString()}
					style={{
						backgroundColor: 'white',
					}}
					data={this.state.albumTracks}
					renderItem={({ item, index }) => {
						return (
							<TouchableNativeFeedback
								onPress={() => {
									AppInstance.startInPlayer(
										utils.convertToTrackPlayerFormat(
											utils.addPropertiesToObjectsInArray(this.state.albumTracks.slice(index), {
												albumart: this.state.albumInfo
													? this.state.albumInfo.images[
															this.state.albumInfo.images.length - 1
													  ]
													: null,
											})
										)
									);
								}}
							>
								<View
									style={{
										backgroundColor: 'white',
										flexDirection: 'row',
										margin: 5,
									}}
								>
									<View
										style={{
											marginHorizontal: 10,
											justifyContent: 'flex-start',
											alignItems: 'flex-start',
											flex: 1,
										}}
									>
										<Text
											style={{
												fontWeight: 'bold',
											}}
										>
											{item.name}
										</Text>
										<Text style={{}}>{item.artistName}</Text>
									</View>
								</View>
							</TouchableNativeFeedback>
						);
					}}
				/>
			</View>
		);
	}
}
