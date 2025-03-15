import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {IMG_BASE_PATH} from '../utils/constants';

type MovieCardProps = {
  title: string;
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
};

const MovieCard = (props: MovieCardProps) => {
  const {title, vote_average, poster_path} = props;
  const imageUrl = IMG_BASE_PATH + poster_path;
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{uri: imageUrl}}
        style={styles.imgContainer}
        resizeMode="cover">
        <View
          style={[
            styles.contentWrap,
            {backgroundColor: theme.colors.monoAlpha7},
          ]}>
          <Text
            style={[styles.title, {color: theme.colors.text}]}
            numberOfLines={2}>
            {title}
          </Text>
          <Text
            style={[styles.subTitle, {color: theme.colors.text}]}
            numberOfLines={1}>
            Rating: {vote_average.toFixed(1)}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 0,
    padding: 8,
  },
  contentWrap: {
    width: '100%',
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: 8,
    height: 80,
  },
  imgContainer: {
    width: '100%',
    height: 280,
    borderRadius: 2,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MovieCard;
