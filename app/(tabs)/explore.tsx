
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { Link } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TRENDING_CATEGORIES = [
  { id: '1', name: 'Just Chatting', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Fortnite', image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Valorant', image: 'https://via.placeholder.com/150' },
  { id: '4', name: 'Music', image: 'https://via.placeholder.com/150' },
  { id: '5', name: 'Sports', image: 'https://via.placeholder.com/150' },
];

const RECOMMENDED_CHANNELS = [
  {
    id: '1',
    streamer: 'shipmark',
    title: '24 hours live stream',
    game: 'Just Chatting',
    viewers: '23K',
    video: require('../../assets/Download.mp4'),
    avatar: 'https://via.placeholder.com/40',
  },
  {
    id: '2',
    streamer: 'voodo skates',
    title: 'random title',
    game: 'irl',
    viewers: '12K',
    video: require('../../assets/Download_1.mp4'),
    avatar: 'https://via.placeholder.com/40',
  },
];

export default function ExploreScreen() {
  const renderCategoryItem = ({ item }: { item: typeof TRENDING_CATEGORIES[0] }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <Text style={styles.categoryName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderRecommendedItem = ({ item }: { item: typeof RECOMMENDED_CHANNELS[0] }) => (
    <Link href={`/stream/${item.id}`} asChild>
      <TouchableOpacity style={styles.streamCard}>
        <View style={styles.videoThumbnail}>
          <Video
            style={styles.video}
            source={item.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false} // Don't autoplay in simple list to save resources
            isMuted={true}
          />
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <View style={styles.viewerBadge}>
            <Text style={styles.viewerText}>{item.viewers}</Text>
          </View>
        </View>
        <View style={styles.streamInfo}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.textInfo}>
            <Text style={styles.streamerName}>{item.streamer}</Text>
            <Text style={styles.streamTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.gameName}>{item.game}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              placeholder="Search channels, games, tags..."
              placeholderTextColor="#888"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Trending Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={TRENDING_CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Recommended Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <View style={styles.verticalList}>
            {RECOMMENDED_CHANNELS.map((item) => (
              <Link key={item.id} href={`/stream/${item.id}`} asChild>
                <TouchableOpacity style={styles.streamCard}>
                  <View style={styles.videoThumbnail}>
                    <Video
                      style={styles.video}
                      source={item.video}
                      resizeMode={ResizeMode.COVER}
                      shouldPlay={false} // Don't autoplay in simple list to save resources
                      isMuted={true}
                    />
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                    <View style={styles.viewerBadge}>
                      <Text style={styles.viewerText}>{item.viewers}</Text>
                    </View>
                  </View>
                  <View style={styles.streamInfo}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <View style={styles.textInfo}>
                      <Text style={styles.streamerName}>{item.streamer}</Text>
                      <Text style={styles.streamTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.gameName}>{item.game}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>

        {/* Recent Tags / Discovery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discover by Tags</Text>
          <View style={styles.tagsContainer}>
            {['IRL', 'Music', 'Esports', 'Creative', 'Retro', 'Strategy'].map((tag, i) => (
              <TouchableOpacity key={i} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f23',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  seeAllText: {
    color: '#014743',
    fontWeight: 'bold',
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: 120,
    marginRight: 4,
  },
  categoryImage: {
    width: 120,
    height: 160,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#333',
  },
  categoryName: {
    color: '#efeff1',
    fontWeight: '600',
    fontSize: 14,
  },
  verticalList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  streamCard: {
    flexDirection: 'row',
    height: 90,
  },
  videoThumbnail: {
    width: 160,
    height: 90,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#333',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  liveBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#e91916',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  liveText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  viewerBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  viewerText: {
    color: 'white',
    fontSize: 10,
  },
  streamInfo: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    paddingVertical: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 2,
  },
  textInfo: {
    flex: 1,
  },
  streamerName: {
    color: '#f0ede4',
    fontWeight: 'bold',
    fontSize: 14,
  },
  streamTitle: {
    color: '#adadb8',
    fontSize: 12,
    marginTop: 2,
  },
  gameName: {
    color: '#adadb8',
    fontSize: 12,
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  tagPill: {
    backgroundColor: '#1f1f23',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#f0ede4',
    fontSize: 14,
    fontWeight: '600',
  },
});
