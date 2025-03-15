import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';

type Genre = {
  id: number;
  name: string;
};

type GenreFilterBarProps = {
  genres: Genre[];
  loading: boolean;
  error: string | null;
  selectedGenres: number[];
  onGenreToggle: (genreId: number) => void;
};

const GenreFilterBar = (props: GenreFilterBarProps) => {
  const {genres, loading, error, selectedGenres, onGenreToggle} = props;
  const {theme} = useTheme();

  const renderGenreItem = ({item}: {item: Genre}) => (
    <TouchableOpacity
      style={[
        styles.genreItem,
        {backgroundColor: theme.colors.secondary},
        selectedGenres.includes(item.id) && {
          backgroundColor: theme.colors.primary,
        },
      ]}
      onPress={() => onGenreToggle(item.id)}>
      <Text style={[styles.genreText, {color: theme.colors.white}]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Text style={[styles.message, {color: theme.colors.text}]}>
        Loading genres...
      </Text>
    );
  }

  if (error) {
    return (
      <Text style={[styles.message, {color: theme.colors.accent}]}>
        Error: {error}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {genres.length > 0 ? (
        <FlatList
          data={genres}
          keyExtractor={item => item.id.toString()}
          renderItem={renderGenreItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={[styles.message, {color: theme.colors.text}]}>
          No genres available
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  genreItem: {
    paddingHorizontal: 16,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genreText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default GenreFilterBar;
