
import React from 'react';
import {
	StyleSheet,
	TextInput,
	View,
} from 'react-native';
import {
	Icon,
} from 'src/components';

interface MySearchBarProps {
	value?: string;
	onChangeText?: (text: string) => void;
	placeholder?: string;
}

const MySearchBar: React.FC<MySearchBarProps> = ({
	value = '',
	onChangeText,
	placeholder = '搜尋客戶姓名',
}) => {
	return (
		<View style={styles.searchContainer}>
			<Icon name="magnifier" size={20} color="#4E5969" />
			<TextInput
				style={styles.searchInput}
				placeholder={placeholder}
				value={value}
				onChangeText={onChangeText}
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
		margin: 16,
	},
	searchInput: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16,
		color: '#333',
	},
});