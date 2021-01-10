import React, {useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import {
  Container,
  Form,
  Input,
  Item,
  Button,
  Text,
  Content,
  H1,
} from 'native-base';
import {signIn} from '../action/auth';
import Welcome from '../assets/undraw_welcome_cats_thqn.png';
import propTypes from 'prop-types';

const SignIn = ({navigation, signIn}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doSignIn = () => {
    dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    signIn({email, password});
  };

  return (
    <Container style={styles.container}>
      <Content padder>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <H1 style={styles.heading}>Welcome to the InstaClone</H1>

          <Image
            source={Welcome}
            style={{width: null, height: 150, marginTop: 30}}
            resizeMode="contain"
          />

          <Form>
            <Item rounded style={styles.formItem}>
              <Input
                placeholder="Enter Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </Item>
            <Item rounded style={styles.formItem}>
              <Input
                placeholder="Enter Password"
                value={password}
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
              />
            </Item>
            <Button rounded block onPress={doSignIn}>
              <Text>SignIn</Text>
            </Button>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              style={{marginTop: 10}}>
              <Text style={{textAlign: 'center'}}>
                Do not have an account, SignUp here
              </Text>
            </TouchableOpacity>
          </Form>
        </ScrollView>
      </Content>
    </Container>
  );
};
const mapDispatchToProps = {
  signIn: (data) => signIn(data),
};

SignIn.propTypes = {
  signIn: propTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(SignIn);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    textAlign: 'center',
    marginHorizontal: 5,
    marginTop: 30,
  },
  formItem: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
});
