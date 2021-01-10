import {
  Button,
  Container,
  Content,
  Form,
  Icon,
  Input,
  Item,
  Text,
  Textarea,
  View,
} from 'native-base';
import React, {useState} from 'react';
import {StyleSheet, ScrollView, Image} from 'react-native';
import {connect} from 'react-redux';
import propTypes from 'prop-types';
//Image Picker
import {launchImageLibrary} from 'react-native-image-picker';
import {options} from '../utils/options';
import ProgressCircle from 'react-native-progress/Circle';
import ImageResizer from 'react-native-image-resizer';

//firebase
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import Snackbar from 'react-native-snackbar';
import shortid from 'shortid';

const AddPost = ({navigation, userState}) => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const [imageUploading, setImageUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const selectImage = async () => {
    launchImageLibrary(options, (response) => {
      console.log('Response=', response);
      if (response.didCancel) {
        console.log('USer Cancelled Image Picker');
      } else if (response.error) {
        console.log('Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        uploadImage(response);
      }
    });
  };

  const uploadImage = async (response) => {
    setImageUploading(true);
    let maxWidth = 600;
    let maxHeight = 600;
    let compressFormat = 'JPEG';
    let quality = 100;
    let rotation = 0;
    let outputPath = undefined;
    let options = {mode: 'contain',onlyScaleDown: true};
    ImageResizer.createResizedImage(
      response.uri,
      maxWidth,
      maxHeight,
      compressFormat,
      quality,
      rotation,
      outputPath,
      false,
      options,
    )
      .then((response) => {
        const reference = storage().ref(response.name);
        console.log(response);
        const path = response.path.replace('/data/user/0/', 'content://');
        const task = reference.putFile(response.uri);
        task.on('state_changed', (taskSnapshot) => {
          const percentage =
            (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 1000;
          setUploadStatus(percentage);
        });

        task.then(async () => {
          const url = await reference.getDownloadURL()
          setImage(url);
          setImageUploading(false);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addPost = async () => {
    try {
      console.log("hi")
      if (!location || !image || !description) {
        return Snackbar.show({
          text: 'Enter all the Fields',
        });
      }
      const uid = shortid.generate();

      await database().ref(`posts/${uid}`).set({
        location,
        description,
        image,
        by: userState.name,
        date: Date.now(),
        instaUserName: userState.instaUserName,
        userImage: userState.image,
        id: uid,
      });
      console.log('Post added Succesfully');
      navigation.navigate('Home');
    } catch {
      (error) => {
        console.log(error);
        Snackbar.show({
          text: 'Failed to Add Post',
        });
      };
    }
  };

  return (
    <Container>
      <Content padder>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {image && (
            <Image
              source={{uri: image}}
              style={styles.image}
              resizeMode="center"
            />
          )}
          <Form>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="Location"
                value={location}
                onChangeText={(text) => {
                  setLocation(text);
                }}
              />
            </Item>
            {imageUploading ? (
              <View style={styles.progress}>
                <ProgressCircle
                  progress={uploadStatus}
                  showsText={true}
                  style={{width: null, marginBottom: 20}}
                />
              </View>
            ) : (
              <Button
                regular
                block
                secondary
                iconleft
                bordered
                onPress={selectImage}
                style={styles.formItem}>
                <Icon name="attach-outline" />
                <Text>Select Image</Text>
              </Button>
            )}

            <Item regular style={styles.formItem}>
              <Textarea
                rowSpan={5}
                placeholder="Description"
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                }}
              />
            </Item>

            <Button regular block onPress={addPost}>
              <Text>Add Post</Text>
            </Button>
          </Form>
        </ScrollView>
      </Content>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  userState: state.auth.user,
});
AddPost.prototypes = {
  userState: propTypes.object.isRequired,
};

export default connect(mapStateToProps)(AddPost);

const styles = StyleSheet.create({
  formItem: {
    marginBottom: 20,
  },
  image: {
    width: null,
    height: 150,
    marginBottom: 20,
  },
  progress: {
    alignItems: 'center',
  },
});
