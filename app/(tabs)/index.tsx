import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Just Chatting', 'ARC Raiders', 'Fortnite', 'Minecraft', 'Music', 'Sports'];

export default function FeedScreen() {
  const [activeTab, setActiveTab] = useState('Live');
  const [activeCategory, setActiveCategory] = useState('All');
  const video = useRef(null);

  useEffect(() => {
    if (video.current) {
      // video.current.playAsync(); // Removed to fix type error, autoPlay handled by shouldPlay prop
    }
  }, []);

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.categoryPill, activeCategory === item && styles.categoryPillActive]}
      onPress={() => setActiveCategory(item)}
    >
      <Text style={[styles.categoryText, activeCategory === item && styles.categoryTextActive]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#014743" />

      {/* Top Navigation */}
      <View style={styles.topNav}>
        <View style={styles.profileIcon}>
          <Image source={require('../../assets/images/3c468232f3e509873bacc44b468ba511.png')} style={styles.profileImage} resizeMode="contain" />
        </View>
        <View style={styles.tabsContainer}>
          {['Following', 'Live', 'Clips'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabButton}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.topIcons}>
          <Link href="/(tabs)/activity" asChild>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color="white" style={{ marginRight: 15 }} />
            </TouchableOpacity>
          </Link>
          <Link href="/messages" asChild>
            <TouchableOpacity>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <ScrollView style={styles.feedContainer}>
        {/* Stream Preview Card */}
        <Link href="/stream/1" asChild>
          <TouchableOpacity style={styles.streamCard} activeOpacity={0.9}>
            {/* Video Preview */}
            <View style={styles.videoContainer}>
              <Video
                ref={video}
                style={styles.video}
                source={require('../../assets/Download.mp4')}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay
                isMuted={true}
              />
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <View style={styles.viewerCount}>
                <Text style={styles.viewerText}>23K viewers</Text>
              </View>
              <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.webcamOverlay} />
            </View>

            {/* Stream Info Panel */}
            <View style={styles.streamInfo}>
              <View style={styles.infoTopRow}>
                <View style={styles.streamerDetails}>
                  <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.avatar} />
                  <Text style={styles.streamerName}>shipmark</Text>
                  <Ionicons name="checkmark-circle" size={16} color="#f0ede4" style={{ marginLeft: 4 }} />
                </View>
                <View style={styles.infoActions}>
                  <TouchableOpacity style={styles.followButton}>
                    <Ionicons name="heart-outline" size={16} color="white" style={{ marginRight: 4 }} />
                    <Text style={styles.followText}>Follow</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={20} color="#efeff1" style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.streamTitle} numberOfLines={2}>
                24 hours live stream
              </Text>

              <TouchableOpacity style={styles.gameTag}>
                <Text style={styles.gameTagText}>Just Chatting</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Link>

        {/* Duplicate Card for scrolling effect */}
        <Link href="/stream/2" asChild>
          <TouchableOpacity style={styles.streamCard} activeOpacity={0.9}>
            <View style={styles.videoContainer}>
              <Video
                style={{ width: '100%', height: 500, position: 'absolute', top: 0 }}
                source={require('../../assets/Download_1.mp4')}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay
                isMuted={true}
              />
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <View style={styles.viewerCount}>
                <Text style={styles.viewerText}>12K viewers</Text>
              </View>
            </View>
            <View style={styles.streamInfo}>
              <View style={styles.infoTopRow}>
                <View style={styles.streamerDetails}>
                  <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.avatar} />
                  <Text style={styles.streamerName}>voodo skates</Text>
                  <Ionicons name="checkmark-circle" size={16} color="#f0ede4" style={{ marginLeft: 4 }} />
                </View>
                <View style={styles.infoActions}>
                  <TouchableOpacity style={styles.followButton}>
                    <Ionicons name="heart-outline" size={16} color="white" style={{ marginRight: 4 }} />
                    <Text style={styles.followText}>Follow</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={20} color="#efeff1" style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.streamTitle} numberOfLines={2}>
                random title
              </Text>
              <TouchableOpacity style={styles.gameTag}>
                <Text style={styles.gameTagText}>irl</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Link>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#014743', // Primary
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#013835',
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  tabText: {
    color: '#f0ede4', // Secondary
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.6,
  },
  tabTextActive: {
    opacity: 1,
    fontWeight: 'bold',
  },
  activeIndicator: {
    height: 3,
    backgroundColor: '#f0ede4', // Secondary
    width: '100%',
    marginTop: 4,
    borderRadius: 2,
  },
  topIcons: {
    flexDirection: 'row',
  },
  categoryContainer: {
    paddingVertical: 10,
    backgroundColor: '#000000',
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  categoryPillActive: {
    backgroundColor: '#f0ede4', // Secondary
  },
  categoryText: {
    color: '#f0ede4', // Secondary
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#014743', // Primary
  },
  feedContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  streamCard: {
    marginBottom: 20,
  },
  videoContainer: {
    width: width,
    height: 220,
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e91916',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  viewerCount: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  viewerText: {
    color: 'white',
    fontSize: 12,
  },
  webcamOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#f0ede4',
  },
  streamInfo: {
    padding: 12,
  },
  infoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  streamerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  streamerName: {
    color: '#f0ede4',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0ede4', // Secondary
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  followText: {
    color: '#014743', // Primary
    fontWeight: 'bold',
    fontSize: 12,
  },
  streamTitle: {
    color: '#f0ede4',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  gameTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#26262c',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  gameTagText: {
    color: '#adadb8',
    fontSize: 12,
    fontWeight: '600',
  },
});
