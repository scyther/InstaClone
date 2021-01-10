import React, {useEffect, useState} from 'react';
import {StyleSheet, Image, ActivityIndicator} from 'react-native';
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';

import database from '@react-native-firebase/database';
const Post = ({userDetails, item}) => {
  console.log(item)
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let likes = 0;
    let dislikes = 0;

    if (item.likes) {
      Object.values(item.likes).map((value) => {
        if (value.like) {
          likes += 1;
        }
        if (value.dislike) {
          dislikes += 1;
        }
      });
    }

    setLikes(likes);
    setDislikes(dislikes);
  }, [item]);

  const handleLike = () => {
    database()
      .ref(`/posts/${item.id}/likes/${userDetails.uid}`)
      .set({
        like: 1,
      })
      .then(() => {
        console.log('Post Liked');
      });
  };

  const handleDislike = () => {
    database()
      .ref(`/posts/${item.id}/likes/${userDetails.uid}`)
      .set({
        dislike: 1,
      })
      .then(() => {
        console.log('Post Disliked');
      });
  };

  const periods = {
    month: 30 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  };

  formatTime = (timeCreated) => {
    const diff = Date.now() - timeCreated;

    if (diff > periods.month) {
      // it was at least a month ago
      const monthAgo = Math.floor(diff / periods.month);
      return monthAgo + (monthAgo == 1 ? 'month ago' : 'months ago');
    } else if (diff > periods.week) {
      return Math.floor(diff / periods.week) + 'w';
    } else if (diff > periods.day) {
      return Math.floor(diff / periods.day) + 'd';
    } else if (diff > periods.hour) {
      const hoursAgo = Math.floor(diff / periods.hour);
      return hoursAgo == 1 ? 'an hour ago' : `${hoursAgo} hours ago`;
    } else if (diff > periods.minute) {
      const minutesAgo = Math.floor(diff / periods.minute);
      return minutesAgo + (minutesAgo == 1 ? ' minutes ago' : ' minutes ago');
    } else if (diff > periods.second) {
      const secondsAgo = Math.floor(diff / periods.second);
      return secondsAgo + (secondsAgo == 1 ? 'second ago' : 'seconds ago');
    }
    return 'Just now';
  };

  return (
    <Card>
      <CardItem>
        <Left>
          <Thumbnail source={{uri: item.userImage}} />
          <Body>
            <Text>{item.by}</Text>
            <Text note>{item.location}</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem cardBody>
        <Image
          source={{uri: item.image}}
          style={{height: 200, width: null, flex: 1}}
          resizeMethod="scale"
          resizeMode="contain"
        /><ActivityIndicator animating={loading}/>
      </CardItem>
      <CardItem cardBody>
        <Text
          note
          style={{marginLeft: 20, fontFamily: 'lucida grande'}}
          numberOfLines={2}>
          {item.description}
        </Text>
      </CardItem>
      <CardItem>
        <Left>
          <Button transparent onPress={handleLike}>
            <Icon active name="thumbs-up" />
            <Text>{likes}Likes</Text>
          </Button>
        </Left>
        <Body>
          <Button transparent onPress={handleDislike}>
            <Icon active name="thumbs-down" />
            <Text>{dislikes}Dislikes</Text>
          </Button>
        </Body>
        <Right>
          <Text note>{formatTime(item.date)}</Text>
        </Right>
      </CardItem>
    </Card>
  );
};

export default Post;
