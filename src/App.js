import React, {useEffect} from 'react';
//Permissions
import {requestPermission} from './utils/askPermissions';

//Navigation
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//ReactRedux
import {useDispatch, connect} from 'react-redux';

//Screens
import Home from './screens/Home';
import AddPost from './screens/AddPost';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';

//Layout
import CustomHeader from './layout/CustomHeader';
import EmptyContainer from './components/EmptyContainer';

//action
import {SET_USER, IS_AUTHENTICATED} from './action/action.types';

//firebase
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';


const Stack = createStackNavigator();

const App = ({authState}) => {
  const dispatch = useDispatch();


  const onAuthStateChanged = (user) => {
    if (user) {
      dispatch({
        type: IS_AUTHENTICATED,
        payload: true,
      });
      database()
        .ref(`/users/${user._user.uid}`)
        .on('value', (snapshot) => {
          dispatch({
            type: SET_USER,
            payload: snapshot.val(),
          });
        });
    } else {
      dispatch({
        type: IS_AUTHENTICATED,
        payload: false,
      });
    }
  };

  useEffect(() => {
    requestPermission();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (authState.loading) {
    return <EmptyContainer />;
  }
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <CustomHeader {...props} />,
        }}>
        {authState.isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddPost" component={AddPost} />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
};

const mapStateToProps = (state) => ({
  authState: state.auth,
});

export default connect(mapStateToProps)(App);
