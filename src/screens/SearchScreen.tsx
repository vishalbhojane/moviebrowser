import React, {useState, useDeferredValue, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {searchMovies, clearSearch} from '../redux/slices/searchSlice';
import MovieCard from '../components/MovieCard';
import {useTheme} from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const SearchScreen = ({navigation}: Props) => {
  const dispatch = useAppDispatch();
  const search = useAppSelector(state => state.search);
  const {theme} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearSearch());
    };
  }, [dispatch]);

  useEffect(() => {
    if (deferredQuery.trim()) {
      dispatch(searchMovies({query: deferredQuery, page: 1}));
    } else {
      dispatch(clearSearch());
    }
  }, [deferredQuery, dispatch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const loadMore = () => {
    if (
      !search.loading &&
      deferredQuery.trim() &&
      search.currentPage < search.totalPages
    ) {
      dispatch(
        searchMovies({query: deferredQuery, page: search.currentPage + 1}),
      );
    }
  };

  const renderItem = ({item}: {item: any}) => <MovieCard {...item} />;

  const renderLoader = () => {
    if (search.loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      );
    }
    return null;
  };

  const renderError = () => {
    if (search.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: theme.colors.error}]}>
            {search.error}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (deferredQuery.trim()) {
                dispatch(searchMovies({query: deferredQuery, page: 1}));
              }
            }}
            style={styles.retryButton}>
            <Text style={{color: theme.colors.primary}}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const renderEmptyState = () => {
    if (
      !search.loading &&
      !search.error &&
      search.results.length === 0 &&
      deferredQuery.trim()
    ) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, {color: theme.colors.text}]}>
            No movies found
          </Text>
        </View>
      );
    }
    return null;
  };

  const isStale = searchQuery !== deferredQuery;

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View
          style={[
            styles.searchBarContainer,
            {backgroundColor: theme.colors.card},
          ]}>
          <Icon
            name="search"
            size={20}
            color={theme.colors.text}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              {
                color: theme.colors.text,
                backgroundColor: theme.colors.card,
              },
            ]}
            placeholder="Search movies..."
            placeholderTextColor={theme.colors.text}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              style={styles.clearButton}>
              <Icon name="close-circle" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          )}
          {isStale && (
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
              style={styles.staleIndicator}
            />
          )}
        </View>
      </View>
      {renderError()}
      <FlatList
        data={search.results}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderLoader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
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
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
    marginRight: 4,
  },
  staleIndicator: {
    marginLeft: 4,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  listContainer: {
    padding: 8,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 8,
  },
  retryButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default SearchScreen;
