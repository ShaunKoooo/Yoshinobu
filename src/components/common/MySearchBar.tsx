
import React, { useState } from 'react';
import {
	StyleSheet,
	TextInput,
	View,
} from 'react-native';
import {
	Icon,
} from 'src/components';

const MySearchBar = () => {
	const [searchQuery, setSearchQuery] = useState('');
	return (
		<View style={styles.searchContainer}>
			<Icon name="magnifier" size={20} color="#4E5969" />
			<TextInput
				style={styles.searchInput}
				placeholder=""
				value={searchQuery}
				onChangeText={setSearchQuery}
				placeholderTextColor="#999"
			/>
		</View>
	);
};

export default MySearchBar;

const styles = StyleSheet.create({
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 91,
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	searchInput: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16,
		color: '#333',
	},
});