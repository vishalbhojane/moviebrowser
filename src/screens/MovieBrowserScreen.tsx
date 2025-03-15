import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {fetchGenres, toggleGenres} from '../redux/slices/genresSlice';
import {clearMovies, fetchMovies} from '../redux/slices/moviesSlice';
import GenreFilterBar from '../components/GenreFilterBar';
import MovieCard from '../components/MovieCard';
import {useTheme} from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieBrowser'>;

const ITEMS_PER_YEAR = 20;
const INITIAL_YEAR = 2012;
const CURRENT_YEAR = new Date().getFullYear();

const MovieBrowserScreen = ({navigation}: Props) => {
  const dispatch = useAppDispatch();
  const genres = useAppSelector(state => state.genres);
  const movies = useAppSelector(state => state.movies);
  const {theme} = useTheme();
  const [years, setYears] = useState([INITIAL_YEAR]);
  const flatListRef = useRef<FlatList | null>(null);

  useEffect(() => {
    dispatch(fetchGenres());
    loadMoviesForYear(INITIAL_YEAR);
  }, [dispatch]);

  const loadMoviesForYear = async (year: number) => {
    if (movies.loading) return;

    await dispatch(
      fetchMovies({
        year,
        page: 1,
        genres:
          genres.selectedGenres.length > 0
            ? genres.selectedGenres.join(',')
            : undefined,
      }),
    );
  };

  useEffect(() => {
    dispatch(clearMovies());
    setYears([INITIAL_YEAR]);
    loadMoviesForYear(INITIAL_YEAR);
  }, [genres.selectedGenres]);

  const handleGenreToggle = (genreId: number) => {
    dispatch(toggleGenres(genreId));
  };

  const handleEndReached = () => {
    if (!movies.loading && years[years.length - 1] < CURRENT_YEAR) {
      const nextYear = years[years.length - 1] + 1;
      loadMoviesForYear(nextYear);
      setYears(prevYears => [...prevYears, nextYear]);
    }
  };

  const handleStartReached = () => {
    if (!movies.loading && years[0] >= 2000) {
      const prevYear = years[0] - 1;
      loadMoviesForYear(prevYear);
      setYears(prevYears => [prevYear, ...prevYears]);
    }
  };

  const renderItem = ({item}: {item: any}) => <MovieCard {...item} />;

  const renderYearSeparator = (year: number) => (
    <View style={styles.yearSeparator}>
      <Text style={[styles.yearText, {color: theme.colors.text}]}>{year}</Text>
    </View>
  );

  const renderMoviesForYear = (year: number) => (
    <View key={year}>
      {renderYearSeparator(year)}
      <FlatList
        data={movies.list[year]?.slice(0, ITEMS_PER_YEAR) || []}
        renderItem={renderItem}
        keyExtractor={item => `${year}-${item.id}`}
        numColumns={2}
        scrollEnabled={false}
      />
    </View>
  );

  const renderLoader = () => {
    if (movies.loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      );
    }
    return null;
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          Movie Browser
        </Text>
        <Icon
          name="search"
          size={24}
          color={theme.colors.text}
          onPress={() => navigation.navigate('Search')}
        />
      </View>
      <GenreFilterBar
        genres={genres.list}
        loading={genres.loading}
        error={genres.error}
        selectedGenres={genres.selectedGenres}
        onGenreToggle={handleGenreToggle}
      />
      <FlatList
        style={styles.moviesList}
        ref={flatListRef}
        data={years}
        renderItem={({item}) => renderMoviesForYear(item)}
        keyExtractor={item => item.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onStartReached={handleStartReached}
        onStartReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderLoader}
        ListHeaderComponent={renderLoader}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        contentContainerStyle={styles.moviesContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  yearSeparator: {
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  yearText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  moviesList: {
    marginTop: 20,
  },
  moviesContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});

export default MovieBrowserScreen;
