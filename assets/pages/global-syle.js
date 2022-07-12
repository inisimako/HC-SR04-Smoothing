import {StyleSheet, Dimensions} from 'react-native';
export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 300,
    height: 50,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#636e72',
    borderRadius: 25,
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputText: {
    width: 200,
    height: 30,
    color: '#636e72',
  },

  inputLabel: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 10,
    fontWeight: 'bold',
  },
  globalButton: {
    width: 300,
    height: 50,
    marginTop: 20,
    backgroundColor: '#6522A8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  image: {
    flex: 1,
    width: Dimensions.get('window').width * 1.1,
    height: Dimensions.get('window').height * 1.1,
    flex: 1,
    alignItems: 'center',
  },
});
