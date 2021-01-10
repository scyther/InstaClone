import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import database from '@react-native-firebase/database';

export const signUp = (data) => async (dispatch) => {
  console.log(data);
  const {name, instaUserName, bio, email, password, country, image} = data;
  if (name && bio && instaUserName && country) {
    auth()
      .createUserWithEmailAndPassword(email, password)
      // eslint-disable-next-line no-shadow
      .then((auth) => {
        console.log(auth.user?.uid);
        console.log('User created sucessfully');

        database()
          .ref('/users/' + auth.user?.uid)
          .set({
            uid: auth.user?.uid,
            name,
            email,
            bio,
            instaUserName,
            country,
            image,
          })
          .then(() => {
            console.log('data set succesfully');
            Snackbar.show({
              text: 'Account created successfully',
              textColor: 'white',
              backgroundColor: 'green',
            });
          })
          .catch((error) => {
            console.log(error);
            Snackbar.show({
              text: 'Enter all the fields',
              textColor: 'white',
              backgroundColor: 'red',
            });
          });
      })
      .catch((error) => {
        console.log(error.message);
        Snackbar.show({
          text: error.message,
          textColor: 'white',
          backgroundColor: 'red',
        });
      });
  } else {
    Snackbar.show({
      text: 'Enter all the fields',
    });
  }
};

export const signIn = (data) => async (dispatch) => {
  const {email, password} = data;
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('Login Succesful');
      Snackbar.show({
        text: 'Login Succesful',
        textColor: 'white',
        backgroundColor: 'green',
      });
    })
    .catch((error) => {
      console.error(error.message);
      Snackbar.show({
        text: 'Sign In Failed',
        textColor: 'white',
        backgroundColor: 'red',
      });
    });
};

export const signOut = () => async (dispatch) => {
  auth()
    .signOut()
    .then(() => {
      Snackbar.show({
        text: 'SignOut Successful',
        textColor: 'white',
        backgroundColor: 'green',
      });
    })
    .catch((error) => {
      console.log(error);
      Snackbar.show({
        text: 'SignOut Failed',
        textColor: 'white',
        backgroundColor: 'red',
      });
    });
};
