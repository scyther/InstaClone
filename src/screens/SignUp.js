import React, {useState} from 'react';
import {StyleSheet, ScrollView, View, TouchableOpacity} from 'react-native';
import {
  Container,
  Form,
  Item,
  Input,
  Text,
  Button,
  Thumbnail,
  Content,
} from 'native-base';

//redux
import PropTypes from 'prop-types';
import {signUp} from '../action/auth';
import {connect, useDispatch} from 'react-redux';
import {SET_LOADING} from '../action/action.types';

const SignUp = ({signUp, authState, navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instaUserName, setInstaUserName] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [image, setImage] = useState(
    'https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png',
  );
  const [imageUploading, setImageUplading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const dispatch = useDispatch();
  const doSignUp = async () => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    await signUp({name, instaUserName, bio, email, password, country, image});
  };

  return (
    <Container>
      <Content padder>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.imageContainer}>
            <Thumbnail large source={{uri: image}} />
          </View>
          <Form>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="Enter Name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                }}
              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="Enter Email"
                value={email}
                textContentType="emailAddress"
                onChangeText={(text) => {
                  setEmail(text);
                }}
              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="Password"
                value={password}
                secureTextEntry={true}
                textContentType="password"
                onChangeText={(text) => {
                  setPassword(text);
                }}
              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="Instagram User Name"
                value={instaUserName}
                onChangeText={(text) => {
                  setInstaUserName(text);
                }}
              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="Bio"
                value={bio}
                multiline={true}
                numberOfLines={5}
                textAlign="left"
                textAlignVertical="top"
                onChangeText={(text) => {
                  setBio(text);
                }}
              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="Country"
                value={country}
                onChangeText={(text) => {
                  setCountry(text);
                }}
              />
            </Item>
            <Button rounded block onPress={doSignUp}>
              <Text style={{color: 'white'}}>SignUp</Text>
            </Button>
          </Form>
        </ScrollView>
      </Content>
    </Container>
  );
};

SignUp.propTypes = {
  signUp: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  signUp: (data) => signUp(data),
};

const mapStateToProps = (state) => {
  return {authState: state.auth};
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  formItem: {
    marginBottom: 20,
  },
});
