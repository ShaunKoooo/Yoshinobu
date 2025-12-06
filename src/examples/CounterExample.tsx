import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {
  increment,
  decrement,
  incrementByAmount,
  reset,
  selectCount,
} from 'src/store/slices/counterSlice';

const CounterExample = () => {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redux Counter Example</Text>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{count}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button title="Decrement -" onPress={() => dispatch(decrement())} />
        <Button title="Increment +" onPress={() => dispatch(increment())} />
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Add 5"
          onPress={() => dispatch(incrementByAmount(5))}
        />
        <Button title="Reset" onPress={() => dispatch(reset())} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  counterContainer: {
    backgroundColor: '#4A90E2',
    borderRadius: 100,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  counterText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
});

export default CounterExample;
