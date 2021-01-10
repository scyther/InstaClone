import React from 'react';
import { Right, Header, Body, Title, Button, Text, Icon, Spinner } from 'native-base'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {signOut} from '../action/auth'

const CustomHeader = ({ signOut, authState, navigation }) => {
  return (

    <Header>
      <Body>
        <Title>InstaClone</Title>
        {authState.loading && (<Spinner color="white"/>)}
      </Body>
      <Right>
        {authState.isAuthenticated && (
          <>
            <Button transparent iconLeft onPress={() => { navigation.navigate("AddPost") }}>
              <Text>Add Post</Text>
            </Button>
            <Button transparent onPress={() => signOut()} >
              <Icon name="log-out-outline" style={{color: "red"}} />
            </Button>
          </>
        )}
      </Right>
    </Header>
  );
};


CustomHeader.propTypes = {
  signOut: PropTypes.func.isRequired,
  authState: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  authState: state.auth
})

const mapDispatchToProps = {
  signOut
}
export default connect(mapStateToProps,mapDispatchToProps)(CustomHeader);
