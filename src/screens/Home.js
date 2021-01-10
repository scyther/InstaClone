import React, {useEffect} from 'react';
import {StyleSheet, FlatList, SafeAreaView} from 'react-native';
import Post from '../components/Post';
import EmptyContainer from '../components/EmptyContainer';

//redux
import {connect} from 'react-redux';
import {getPosts} from '../action/post';
import propTypes from 'prop-types';
import {Container, H1} from 'native-base';

const Home = ({getPosts, postState, userDetails}) => {
  useEffect(() => {
    getPosts();
  }, []);

  if (postState.loading) {
    return <EmptyContainer />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={postState.posts}
        renderItem={({item}) => (
          <Post item={item} userDetails={userDetails} key={item.id} />
        )}
        ListEmptyComponent={() => (
          <Container style={styles.emptyContainer}>
            <H1>No Post Found</H1>
          </Container>
        )}
      />
    </SafeAreaView>
  );
};

Home.propTypes = {
  getPosts: propTypes.func.isRequired,
  postState: propTypes.object.isRequired,
  userDetails: propTypes.object,
};

const mapStateToProps = (state) => ({
  postState: state.post,
  userDetails: state.auth.user,
});
const mapDispatchToProps = {getPosts};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 4,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
